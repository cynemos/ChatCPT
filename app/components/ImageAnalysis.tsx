import React, { useState } from 'react';

function ImageAnalysis({ apiKey }: { apiKey: string }) {
  const [imageFile, setImageFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleFileChange = (event: any) => {
    setImageFile(event.target.files[0]);
  };

  const analyzeImage = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('apiKey', apiKey);

    try {
      const response = await fetch('/api/image-analysis', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Image Analysis</h2>
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Select Image File
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={handleFileChange}
        />
      </div>
      <button
        onClick={analyzeImage}
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Analyze Image
      </button>
      {analysisResult && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">Analysis Result:</h3>
          <p className="whitespace-pre-line">{analysisResult}</p>
        </div>
      )}
    </div>
  );
}

export default ImageAnalysis;
