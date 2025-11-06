import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { drugs, role } = await req.json();

  const prompt = `
You are an AI assistant summarizing pharmaceutical inventory trends.
Role: ${role}
Data: ${JSON.stringify(drugs.slice(0, 30))} 

Generate a concise summary highlighting:
- Low stock or expiring items
- Stock sufficiency patterns
- Key recommendations for the ${role}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: "You are an expert inventory analyst." }, { role: "user", content: prompt }],
    temperature: 0.6,
  });

  return NextResponse.json({ summary: completion.choices[0].message.content });
}
