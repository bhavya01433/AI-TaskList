import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const userInput = req.body?.prompt;

  if (!userInput) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  const formattedPrompt = `
You are an intelligent to-do list assistant.

🎯 Goal:
Based on the user's input below, generate a clear, actionable list of tasks that fully covers what's needed to achieve the goal — whether it's 3 steps or 15.

📦 Output Format:
Return ONLY a JavaScript array of strings like:
["Task 1", "Task 2", "Task 3", ...]

✅ Each task must:
- Be short, specific, and action-based (e.g., "Design landing page", "Call vendor for quote")
- Be **relevant to the input and context-aware**
- Follow a logical and natural order (step-by-step)
- Include time references if useful (e.g., "Submit report by 5 PM", "Take breaks every 2 hours")
- Avoid empty strings, filler text, or vague tasks

🚫 Rules:
- NO explanation, notes, or text outside the array
- NO objects, nested data, or markdown
- NO empty tasks or placeholder content

🧠 Input:
${userInput}
`.trim();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: formattedPrompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", JSON.stringify(data, null, 2));
      return res
        .status(response.status)
        .json({ error: data.error.message || "Unknown Gemini error" });
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    try {
      const tasks = JSON.parse(rawText);
      if (Array.isArray(tasks)) {
        return res.status(200).json({ tasks });
      }
    } catch {
      const fallback = rawText
        .split("\n")
        .map((line: string) => line.replace(/^[-*•]\s*/, "").trim())
        .filter(Boolean);
      return res.status(200).json({ tasks: fallback });
    }

    return res.status(500).json({ error: "Failed to parse Gemini response" });
  } catch (err) {
    console.error("Catch block error:", err);
    return res.status(500).json({ error: "Server error", details: err });
  }
}
