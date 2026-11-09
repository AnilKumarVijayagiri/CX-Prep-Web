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
  return {
    title: typeof parsed.title === "string" ? parsed.title.slice(0, 120) : "Topic practice test",
    instructions: typeof parsed.instructions === "string" ? parsed.instructions.slice(0, 280) : "Choose one answer for each question, then submit to review your results.",
    questions
  };
}

module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendError(response, 405, "Method not allowed.");
    return;
  }

  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) {
    sendError(response, 503, "AI test generation is not configured yet. Add OLLAMA_API_KEY to the Vercel project environment.");
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
  const questionCount = Number(body.questionCount);
  const sourceQuestions = Array.isArray(body.questions) ? body.questions.slice(0, 12).map(item => ({
    question: typeof item?.question === "string" ? item.question.slice(0, 500) : "",
    answer: typeof item?.answer === "string" ? item.answer.slice(0, 1200) : ""
  })) : [];

  if (!topic || !notes || !Number.isInteger(questionCount) || questionCount < 3 || questionCount > 10) {
    sendError(response, 400, "Choose a topic with learning notes and request between 3 and 10 questions.");
    return;
  }

  const systemPrompt = "You create accurate interview-preparation assessments. Return one JSON object only, without markdown. The object must have title (string), instructions (string), and questions (array). Each question must have question (string), options (an array of exactly four distinct strings), answerIndex (integer from 0 to 3), and explanation (string). Questions must test understanding of the supplied material. Do not invent facts outside it. Avoid trick questions, duplicate questions, and ambiguous options.";
  const userPrompt = JSON.stringify({
    task: `Create exactly ${questionCount} ${difficulty} multiple-choice interview practice questions.`,
    careerPath: roadmap,
    topic,
    learningMaterial: notes,
    interviewQuestionBank: sourceQuestions
  });

  try {
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
      console.error("Ollama Cloud request failed with status", upstream.status);
      sendError(response, upstream.status === 401 || upstream.status === 403 ? 502 : 503, "Ollama could not generate the test. Check the Vercel Ollama key and model settings, then try again.");
      return;
    }

    const result = await upstream.json();
    const content = result.choices?.[0]?.message?.content;
    const test = typeof content === "string" ? parseGeneratedTest(content, questionCount) : null;
    if (!test) {
      sendError(response, 502, "The AI returned an incomplete test. Please generate it again.");
      return;
    }

    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.status(200).json(test);
  } catch (error) {
    console.error("Ollama Cloud request failed:", error.name);
    sendError(response, error.name === "TimeoutError" ? 504 : 502, "Test generation is temporarily unavailable. Please try again.");
  }
};
