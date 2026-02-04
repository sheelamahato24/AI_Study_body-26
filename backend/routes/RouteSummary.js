import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

router.post("/summary", async (req, res) => {
  try {
    const { topic, level } = req.body;

    if (!topic || !level) {
      return res.status(400).json({ error: "topic and level required" });
    }

    const levels = {
      basic: "Explain in very simple beginner-friendly words.",
      intermediate: "Explain with simple examples.",
      advanced: "Explain in deep technical detail.",
    };

    const prompt = `
You are a teacher explaining a topic to students.

Topic: ${topic}
Level: ${level}

${levels[level] || levels.basic}

STRICT RULES:
- Write ONLY in paragraph form.
- Do NOT use bullet points, numbers, headings, or lists.
- Write in simple, easy, student-friendly language.

CONTENT:
Explain definition, purpose, usage, and one simple example.
`;

    const result = await model.generateContent(prompt);

    // ✅ CORRECT WAY
    const text = result.response.text();

    res.json({ summary: text });

  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= FLASHCARDS =================
// ================= FLASHCARDS =================
router.post("/flashcards", async (req, res) => {
  try {
    const { topic, level } = req.body;

    if (!topic || !level) {
      return res.status(400).json({ error: "topic and level required" });
    }

    const levelGuide = {
      basic: "Use very simple words. Explain like for a beginner.",
      intermediate: "Use simple examples and a little detail.",
      advanced: "Explain in more technical and detailed way.",
    };

    const prompt = `
You are a teacher making study flashcards for students.

Topic: ${topic}
Level: ${level}

Instruction:
${levelGuide[level] || levelGuide.basic}

Rules:
- Create 8 to 10 important flashcards that cover the whole topic.
- Each flashcard must have:
  - "title": short heading
  - "description": short, clear explanation
- Use simple, student-friendly language.
- Cover definitions, uses, parts, examples, and important points.
- Return ONLY valid JSON array in this format:

[
  { "title": "Title 1", "description": "Short explanation 1" },
  { "title": "Title 2", "description": "Short explanation 2" }
]
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();
    text = text.replace(/```json/g, "").replace(/```/g, "");

    let flashcards;
    try {
      flashcards = JSON.parse(text);
    } catch (err) {
      console.error("FLASHCARD JSON PARSE ERROR:", err);
      return res.status(500).json({ error: "Invalid AI response", raw: text });
    }

    return res.json({ flashcards });

  } catch (error) {
    console.error("FLASHCARD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================= QUIZ =================
// ================= QUIZ =================
router.post("/quiz", async (req, res) => {
  try {
    const { topic, level } = req.body;
    if (!topic || !level)
      return res.status(400).json({ error: "topic and level required" });

    const levelText = {
      basic: "Very easy beginner-level questions.",
      intermediate: "Medium level questions with simple logic.",
      advanced: "Hard and tricky conceptual questions."
    };

    const prompt = `
You are a teacher.

Create 5 multiple-choice questions for the topic "${topic}".
Difficulty: ${level} (${levelText[level]})

Rules:
- Each question must have 4 options.
- Only ONE option should be correct.
- Use very simple language.
- Return ONLY valid JSON in this exact format:

[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  }
]
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();
    text = text.replace(/```json/g, "").replace(/```/g, "");

    let quiz;
    try {
      quiz = JSON.parse(text);
    } catch (err) {
      console.error("QUIZ JSON PARSE ERROR:", err);
      return res.status(500).json({ error: "Invalid AI response", raw: text });
    }

    res.json({ questions: quiz });
  } catch (error) {
    console.error("QUIZ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
