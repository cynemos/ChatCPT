import React, { useState } from 'react';

function ImageGeneration({ apiKey }: { apiKey: string }) {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const generateImage = async () => {
    if (!prompt) return;

    try {
      const response = await fetch('/api/image-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, apiKey }),
      });

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Image Generation</h2>
      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          Prompt
        </label>
        <input
          type="text"
          id="prompt"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <button
        onClick={generateImage}
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate Image
      </button>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Generated Image" className="max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default ImageGeneration;
