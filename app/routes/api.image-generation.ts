import OpenAI from "openai";
import { ActionFunction, json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const { prompt, apiKey } = await request.json();

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return json({ imageUrl: image.data[0].url });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return json({ error: "Failed to generate image." }, { status: 500 });
  }
};
