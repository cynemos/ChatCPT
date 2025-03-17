import OpenAI from "openai";
import { ActionFunction, json } from "@remix-run/node";
import fs from 'node:fs/promises';
import path from 'node:path';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const audio = formData.get("audio") as File;
  const apiKey = formData.get("apiKey") as string;

  if (!audio) {
    return json({ error: "No audio file provided." }, { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    // Convert the File object to a Buffer
    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a temporary file
    const tempFilePath = path.join('/tmp', audio.name); // Use /tmp directory
    await fs.writeFile(tempFilePath, buffer);

    // Now, you can use the tempFilePath with OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath) as any, // Weird type conversion
      model: "whisper-1",
    });

    // Clean up the temporary file
    await fs.unlink(tempFilePath);

    return json({ transcription: transcription.text });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return json({ error: "Failed to transcribe audio." }, { status: 500 });
  }
};
