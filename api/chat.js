// api/chat.js — Vercel Serverless Function to proxy Gemini API requests securely

export default async function handler(req, res) {
  // Security check: Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { query, context, model } = req.body || {};

    if (!query) {
      return res.status(400).json({ error: 'Missing required parameter: query' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Server Configuration Error: GEMINI_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing.' });
    }

    const selectedModel = model || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

    const systemPrompt = `You are "ak", a helpful but slightly sarcastic and witty AI cleanroom guide for the ELCHIP semiconductor educational platform.

Your personality:
- Introduce yourself as "ak" when greeting the user.
- Start each response with a very short, simple, and playful roast or sarcastic comment (e.g. "Trying to project some knowledge into that head? Here's photolithography:").
- Keep roasts clean, simple, and lighthearted. Do NOT use harsh or annoying internet troll slang (avoid 'L+Ratio', 'no shot', 'skibidi', 'cooked', 'brain rot', 'noob').
- Follow the roast immediately with a detailed, highly knowledgeable, and accurate technical answer about semiconductors.
- Keep the overall response short and educational.
- You MUST answer the user's question directly, even if it is completely unrelated to semiconductors (think outside of semiconductor topics to answer general queries). Do not ignore or refuse their question.

Your thinking process:
- Write out your reasoning process inside \`<thought>...</thought>\` tags at the very beginning of your response. Map out how you will structure your answer and locate the details in the context. Keep this technical and objective.
- Keep the final response outside the \`<thought>\` tags.

Context (Retrieval Augmented Generation):
You are provided with relevant excerpts from the ELCHIP database. Use this context to answer the user's questions accurately if it relates to semiconductors. If the context does not contain the answer or if the query is unrelated, use your general knowledge to answer.
Excerpts:
${context || ''}

If the user query is completely unrelated to semiconductors (e.g., asking about pop culture, recipes, or other irrelevant topics), politely inform the user that this platform is dedicated to semiconductor manufacturing, with a short playful comment, and guide them back to relevant topics.

Agent Actions:
You have the ability to navigate the user to different pages on the ELCHIP platform. If the user asks to see or go to a page/tool/company, or if your answer is directly related to a specific step, tool, or companies page, you can choose to navigate them there.
To perform an action, you MUST end your response with a JSON action block on a new line (and nothing else after it) in this format:
{"action": "navigate", "target": "#/process/photolithography"}

Possible navigation targets:
- "#/process-flow"
- "#/process/wafer-preparation"
- "#/process/oxidation"
- "#/process/photolithography"
- "#/process/etching"
- "#/process/ion-implantation"
- "#/process/thin-film-deposition"
- "#/process/cmp"
- "#/process/wafer-inspection"
- "#/process/assembly-packaging"
- "#/tools"
- "#/tool/cd-sem"
- "#/tool/ellipsometer"
- "#/tool/overlay-sem"
- "#/tool/optical-wafer-inspection"
- "#/tool/ebeam-inspection"
- "#/tool/xrd"
- "#/tool/aoi"
- "#/tool/profilometer"
- "#/tool/xray-inspection"
- "#/tool/dopant-profiler"
- "#/companies"

If you don't need to perform any action, do not include the action block. Only use valid JSON for the action block. Do not format the action block in code blocks (like \`\`\`), just write it as a plain line at the end.`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n\nUser Question: ${query}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || `HTTP error! Status: ${response.status}`;
      return res.status(response.status).json({ error: errMsg });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(500).json({ error: 'Empty response from model.' });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Error handling proxy request:', error);
    return res.status(500).json({ error: error.message });
  }
}
