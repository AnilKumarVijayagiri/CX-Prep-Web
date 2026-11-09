const requestWindows = new Map();
const REQUEST_LIMIT = 20;
const WINDOW_MS = 60_000;

function sendError(response, status, message) {
  response.setHeader("Cache-Control", "no-store");
  response.status(status).json({ error: message });
}

module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendError(response, 405, "Method not allowed.");
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendError(response, 503, "PrepPo AI chat is not configured. Add GEMINI_API_KEY to the Vercel project environment.");
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
    sendError(response, 429, "PrepPo AI is receiving too many messages from this connection. Try again shortly.");
    return;
  }
  requestWindows.set(address, window ? { ...window, count: window.count + 1 } : { startedAt: now, count: 1 });

  const body = request.body || {};
  const roadmap = typeof body.roadmap === "string" ? body.roadmap.trim().slice(0, 180) : "";
  const topic = typeof body.topic === "string" ? body.topic.trim().slice(0, 180) : "";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 5000) : "";
  const questions = Array.isArray(body.questions) ? body.questions.slice(0, 8).map(item => ({
    question: typeof item?.question === "string" ? item.question.slice(0, 400) : "",
    answer: typeof item?.answer === "string" ? item.answer.slice(0, 800) : ""
  })) : [];
  const messages = Array.isArray(body.messages) ? body.messages.slice(-8).filter(item =>
    item && ["user", "assistant"].includes(item.role) && typeof item.text === "string" && item.text.trim()
  ).map(item => ({ role: item.role, text: item.text.trim().slice(0, 1200) })) : [];
  const messageSize = messages.reduce((total, item) => total + item.text.length, 0);

  if (!roadmap || !topic || !messages.length || messages[messages.length - 1].role !== "user" || messageSize > 6000) {
    sendError(response, 400, "Choose a course topic and send a message under 1,200 characters.");
    return;
  }

  const systemText = [
    "You are PrepPo AI, a friendly and concise interview-preparation coach for St. School learners.",
    "Answer the learner's question using the selected course material below. Explain concepts clearly, use short examples, and ask a useful follow-up when appropriate.",
    "If asked to quiz the learner, ask one question at a time and do not reveal its answer until they try.",
    "Do not claim the learner passed, award points, or change challenge state; only the website challenge controls do that.",
    "If the supplied notes do not contain enough information, say so and give a clearly labeled general explanation.",
    `Selected course: ${roadmap}`,
    `Selected topic: ${topic}`,
    `Learning notes: ${notes || "No notes supplied."}`,
    `Interview Q&A material: ${JSON.stringify(questions)}`
  ].join("\n\n");

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: messages.map(item => ({ role: item.role === "assistant" ? "model" : "user", parts: [{ text: item.text }] })),
        generationConfig: { temperature: 0.6, maxOutputTokens: 700 }
      }),
      signal: AbortSignal.timeout(45_000)
    });

    if (!upstream.ok) {
      console.error("Gemini chat request failed with status", upstream.status);
      if (upstream.status === 401 || upstream.status === 403) {
        sendError(response, 502, "Gemini rejected the configured key. Check GEMINI_API_KEY in Vercel.");
        return;
      }
      if (upstream.status === 429) {
        sendError(response, 429, "Gemini's current API quota is reached. Try again later or check your AI Studio quota.");
        return;
      }
      sendError(response, 503, "PrepPo AI is temporarily unavailable. Please try again.");
      return;
    }

    const result = await upstream.json();
    const text = result.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("").trim();
    if (!text) {
      sendError(response, 502, "Gemini did not return a chat response. Please try again.");
      return;
    }

    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.status(200).json({ reply: text.slice(0, 6000) });
  } catch (error) {
    console.error("Gemini chat request failed:", error.name);
    sendError(response, error.name === "TimeoutError" ? 504 : 502, "PrepPo AI could not reach Gemini. Please try again.");
  }
};
