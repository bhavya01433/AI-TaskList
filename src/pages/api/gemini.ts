import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const prompt = req.body?.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
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

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Gemini gave no reply.";
    res.status(200).json({ result: text });
  } catch (err) {
    console.error("Catch block error:", err);
    res.status(500).json({ error: "Server error", details: err });
  }
}
