import OpenAI from "openai";
import { ActionFunction, json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const apiKey = formData.get("apiKey") as string;

    if (!image) {
      return json({ error: "No image file provided." }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    try {
      const arrayBuffer = await image.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');

      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Describe this image." },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      });

      return json({ analysis: response.choices[0].message.content });
    } catch (error) {
      console.error("OpenAI Error:", error);
      return json({ error: "Failed to analyze image." }, { status: 500 });
    }
};
