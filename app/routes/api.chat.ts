import OpenAI from "openai";
import { ActionFunction, json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const { message, apiKey } = await request.json();

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
    });

    return json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return json({ response: "Failed to get response from OpenAI." }, { status: 500 });
  }
};
