export const generateRoadmapFromGemini = async (goal, level, hours, duration, signal = null) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDemoKeyReplaceMeWithReal';
  
  const prompt = `Create a structured learning roadmap.

Goal:
${goal}

Current Level:
${level}

Study Hours:
${hours} hours/day

Duration:
${duration}

IMPORTANT: Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include explanations.
Do NOT include \`\`\`json blocks.

Requirements:
- Create learning tracks.
- Create important topics.
- Create important subtopics.
- Suggest projects.
- Suggest milestones.
- Keep progression level friendly.

Output JSON format:
{
  "tracks": [
    {
      "name": "Track Name (e.g. HTML)",
      "topics": [
        {
          "name": "Topic Name (e.g. Introduction)",
          "subtopics": [
            "Subtopic 1 (e.g. What is HTML)",
            "Subtopic 2"
          ]
        }
      ],
      "projects": [
        "Project 1 (e.g. Portfolio Website)",
        "Project 2"
      ],
      "milestones": [
        "Milestone 1 (e.g. Build simple pages)"
      ]
    }
  ]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    }),
    ...(signal ? { signal } : {})
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData?.error?.message || response.statusText;
    throw new Error(`Gemini API call failed (${response.status}): ${errMsg}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  console.log("Raw Gemini Response:", text);

  // Clean the response before JSON.parse()
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.warn("Standard JSON parse failed, trying fallback parser...", parseError);
    // Fallback parser: Find the first "{" and the last "}" and extract only the JSON portion
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonPortion = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonPortion);
      } catch (fallbackError) {
        console.error("Fallback JSON parse failed:", fallbackError);
        throw new Error(`JSON parsing failed: ${fallbackError.message}. Raw response snippet: ${text.substring(0, 150)}...`);
      }
    } else {
      throw new Error(`JSON parsing failed: ${parseError.message}. No matching braces found in response.`);
    }
  }
};
