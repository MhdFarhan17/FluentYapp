import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Ensure we have the API key
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const { scenario, userMessage, history } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "antigravity-preview-05-2026"
    });

    const systemPrompt = `You are an English language AI tutor conducting a role-play exercise with a student.
      The current scenario is: "${scenario}".
      
      Your goal is to:
      1. Stay in character and respond naturally to the student's message to keep the conversation going. Keep your response brief (1-3 sentences) so they can practice.
      2. Analyze the student's message for grammar or vocabulary mistakes.
      
      You must respond in valid JSON with exactly two fields:
      - "reply": Your conversational response in character.
      - "grammarCorrection": If the student made a grammar mistake, provide a brief, encouraging correction here. If their grammar was perfect, set this to null.
      
      Example JSON response if there's a mistake:
      {
        "reply": "I'm doing well, thanks for asking! How was your weekend?",
        "grammarCorrection": "Instead of saying 'I doing good', you should say 'I am doing well'."
      }
      
      DO NOT return Markdown formatting. Return ONLY the raw JSON string.`;

    let conversationContext = "";
    if (history && history.length > 0) {
      conversationContext = "Past Conversation:\n" + history.map((msg: any) => 
        `${msg.role === 'user' ? 'Student' : 'AI Tutor'}: ${msg.content}`
      ).join("\n") + "\n\n";
    }

    const promptToSend = `[SYSTEM INSTRUCTIONS: ${systemPrompt}]\n\n${conversationContext}Current Student Message: ${userMessage}`;

    const result = await model.generateContent(promptToSend);
    let responseText = result.response.text();
    
    // Clean markdown formatting if model returned it despite instructions
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Parse the JSON string returned by Gemini
    const parsedResponse = JSON.parse(responseText);

    return NextResponse.json(parsedResponse);
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate response from AI" }, { status: 500 });
  }
}
