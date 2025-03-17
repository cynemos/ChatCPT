import OpenAI from "openai";
import { ActionFunction, json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const { message, apiKey } = await request.json();

  console.log("API Key:", apiKey); // Debugging: Check if API key is being passed correctly
  console.log("Message:", message); // Debugging: Check if message is being passed correctly

  if (!apiKey) {
    console.error("API Key is missing.");
    return json({ response: "API Key is missing." }, { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
    });

    console.log("OpenAI Response:", completion); // Debugging: Log the entire OpenAI response

    return json({ response: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return json({ response: "Failed to get response from OpenAI. " + error.message }, { status: 500 });
  }
};
