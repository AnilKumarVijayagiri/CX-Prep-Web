const requestWindows = new Map();
const REQUEST_LIMIT = 8;
const WINDOW_MS = 60_000;

function sendError(response, status, message) {
  response.setHeader("Cache-Control", "no-store");
  response.status(status).json({ error: message });
}

function parseGeneratedTest(content, requestedCount) {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.questions)) return null;
  const questions = parsed.questions.slice(0, requestedCount).filter(question =>
    question &&
    typeof question.question === "string" && question.question.trim() &&
    Array.isArray(question.options) && question.options.length === 4 &&
    question.options.every(option => typeof option === "string" && option.trim()) &&
    Number.isInteger(question.answerIndex) && question.answerIndex >= 0 && question.answerIndex < 4 &&
    typeof question.explanation === "string" && question.explanation.trim()
  );

  if (questions.length !== requestedCount) return null;
  const normalizedQuestions = questions.map(question => ({
    ...question,
    timeLimit: question.timeLimit === 5 ? 5 : 7
  }));
  return {
    title: typeof parsed.title === "string" ? parsed.title.slice(0, 120) : "Topic practice test",
    instructions: typeof parsed.instructions === "string" ? parsed.instructions.slice(0, 280) : "Choose one answer for each question, then submit to review your results.",
    questions: normalizedQuestions
  };
}

async function requestOllamaTest(apiKey, systemPrompt, userPrompt, requestedCount) {
  const upstream = await fetch("https://ollama.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || "gemma4:31b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.35,
      max_tokens: 2200,
      stream: false
    }),
    signal: AbortSignal.timeout(55_000)
  });
  if (!upstream.ok) {
    const error = new Error("Ollama Cloud request failed.");
    error.status = upstream.status;
    throw error;
  }
  const result = await upstream.json();
  const content = result.choices?.[0]?.message?.content;
  const test = typeof content === "string" ? parseGeneratedTest(content, requestedCount) : null;
  if (!test) {
    const error = new Error("Ollama returned incomplete test JSON.");
    error.status = 502;
    throw error;
  }
  return test;
}

async function requestGeminiTest(apiKey, systemPrompt, userPrompt, requestedCount) {
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.35, maxOutputTokens: 2200 }
    }),
    signal: AbortSignal.timeout(55_000)
  });
  if (!upstream.ok) {
    const error = new Error("Gemini request failed.");
    error.status = upstream.status;
    throw error;
  }
  const result = await upstream.json();
  const content = result.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("");
  const test = typeof content === "string" ? parseGeneratedTest(content, requestedCount) : null;
  if (!test) {
    const error = new Error("Gemini returned incomplete test JSON.");
    error.status = 502;
    throw error;
  }
  return test;
}

module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendError(response, 405, "Method not allowed.");
    return;
  }

  const ollamaKey = process.env.OLLAMA_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!ollamaKey && !geminiKey) {
    sendError(response, 503, "AI test generation is not configured yet. Add OLLAMA_API_KEY or GEMINI_API_KEY to the Vercel project environment.");
    return;
  }

  const address = String(request.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  for (const [key, window] of requestWindows) {
    if (now - window.startedAt >= WINDOW_MS) requestWindows.delete(key);
  }
  const window = requestWindows.get(address);
  if (window && window.count >= REQUEST_LIMIT) {
    response.setHeader("Retry-After", "60");
    sendError(response, 429, "Too many test generations from this connection. Try again in a minute.");
    return;
  }
  requestWindows.set(address, window ? { ...window, count: window.count + 1 } : { startedAt: now, count: 1 });

  const body = request.body || {};
  const topic = typeof body.topic === "string" ? body.topic.trim().slice(0, 180) : "";
  const roadmap = typeof body.roadmap === "string" ? body.roadmap.trim().slice(0, 180) : "";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 8000) : "";
  const difficulty = ["beginner", "intermediate", "mixed"].includes(body.difficulty) ? body.difficulty : "mixed";
  const mode = body.mode === "daily" ? "daily" : "test";
  const questionCount = mode === "daily" ? 5 : Number(body.questionCount);
  const sourceQuestions = Array.isArray(body.questions) ? body.questions.slice(0, 12).map(item => ({
    question: typeof item?.question === "string" ? item.question.slice(0, 500) : "",
    answer: typeof item?.answer === "string" ? item.answer.slice(0, 1200) : ""
  })) : [];

  if (!topic || !notes || !Number.isInteger(questionCount) || questionCount < (mode === "daily" ? 5 : 3) || questionCount > 10) {
    sendError(response, 400, "Choose a topic with learning notes and request between 3 and 10 questions.");
    return;
  }

  const systemPrompt = "You create accurate interview-preparation assessments. Return one JSON object only, without markdown. The object must have title (string), instructions (string), and questions (array). Each question must have question (string), options (an array of exactly four distinct strings), answerIndex (integer from 0 to 3), explanation (string), and timeLimit (integer 5 or 7). Choose 5 seconds for direct recall and 7 seconds when the question needs brief reasoning. Questions must test understanding of the supplied material. Do not invent facts outside it. Avoid trick questions, duplicate questions, and ambiguous options.";
  const userPrompt = JSON.stringify({
    task: mode === "daily"
      ? "Create exactly five short, sequential rapid-fire multiple-choice questions for a timed daily challenge. Mix direct recall and brief reasoning; set each timeLimit to 5 or 7 seconds accordingly."
      : `Create exactly ${questionCount} ${difficulty} multiple-choice interview practice questions.`,
    mode,
    careerPath: roadmap,
    topic,
    learningMaterial: notes,
    interviewQuestionBank: sourceQuestions
  });

  let test = null;
  let ollamaError = null;
  if (ollamaKey) {
    try {
      test = await requestOllamaTest(ollamaKey, systemPrompt, userPrompt, questionCount);
    } catch (error) {
      ollamaError = error;
      console.error("Ollama Cloud request failed:", error.status || error.name);
    }
  }

  if (!test && geminiKey) {
    try {
      test = await requestGeminiTest(geminiKey, systemPrompt, userPrompt, questionCount);
    } catch (error) {
      console.error("Gemini test fallback failed:", error.status || error.name);
      if (error.status === 401 || error.status === 403) {
        sendError(response, 502, "Gemini rejected the fallback key. Check GEMINI_API_KEY in Vercel.");
        return;
      }
      if (error.status === 429) {
        sendError(response, 429, "Gemini's current API quota is reached. Try again later or check your AI Studio quota.");
        return;
      }
      sendError(response, error.name === "TimeoutError" ? 504 : 503, "Gemini could not generate this test. Check the model and AI Studio quota, then try again.");
      return;
    }
  }

  if (!test && ollamaError) {
    if (ollamaError.status === 402) {
      sendError(response, 402, "Ollama Cloud requires billing or credits, and the Gemini fallback is not configured.");
      return;
    }
    if (ollamaError.status === 429) {
      sendError(response, 429, "Ollama Cloud is rate limiting requests. Wait a little and try again.");
      return;
    }
    sendError(response, ollamaError.status === 401 || ollamaError.status === 403 ? 502 : ollamaError.name === "TimeoutError" ? 504 : 503, "Ollama could not generate the test. Check its key and model settings, or configure GEMINI_API_KEY as a fallback.");
    return;
  }

  if (!test) {
    sendError(response, 503, "No AI provider could generate this test. Check the configured provider keys and quotas.");
    return;
  }

  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(200).json(test);
};
