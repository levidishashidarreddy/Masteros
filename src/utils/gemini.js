function extractJSON(text) {
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;

  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    if (text[i] === '}') depth--;

    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }

  return null;
}

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

IMPORTANT:
Return exactly one JSON object.
Do not include markdown.
Do not include explanations.
Do not include extra text after the JSON.

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

  console.log("Raw Gemini Response Length:", text.length);
  console.log("Raw Gemini Response:", text);

  // Clean the response before JSON.parse()
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const extracted = extractJSON(cleaned);
  if (!extracted) {
    throw new Error("No valid JSON object found in response");
  }

  console.log("Extracted JSON Length:", extracted.length);
  console.log("Extracted JSON:", extracted);

  let parsed;
  try {
    parsed = JSON.parse(extracted);
  } catch (parseError) {
    console.error("JSON parsing failed:", parseError);
    throw new Error(`JSON parsing failed: ${parseError.message}`);
  }

  console.log("Parsed JSON:", parsed);

  // Validation: Ensure tracks, projects, milestones exist
  if (!parsed || typeof parsed !== 'object') {
    throw new Error("Parsed response is not a valid JSON object");
  }
  if (!parsed.tracks || !Array.isArray(parsed.tracks)) {
    throw new Error("Missing 'tracks' array in generated JSON");
  }
  parsed.tracks.forEach((track, index) => {
    if (!track.name) {
      throw new Error(`Track at index ${index} is missing a name`);
    }
    if (!track.projects) {
      throw new Error(`Track at index ${index} is missing projects`);
    }
    if (!track.milestones) {
      throw new Error(`Track at index ${index} is missing milestones`);
    }
  });

  return parsed;
};
