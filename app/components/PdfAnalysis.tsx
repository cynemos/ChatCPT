import React, { useState } from 'react';

function PdfAnalysis({ apiKey }: { apiKey: string }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleFileChange = (event: any) => {
    setPdfFile(event.target.files[0]);
  };

  const analyzePdf = async () => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('apiKey', apiKey);

    try {
      const response = await fetch('/api/pdf-analysis', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error('Error analyzing PDF:', error);
      alert('Failed to analyze PDF.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">PDF Analysis</h2>
      <div className="mb-4">
        <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">
          Select PDF File
        </label>
        <input
          type="file"
          id="pdf"
          accept="application/pdf"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={handleFileChange}
        />
      </div>
      <button
        onClick={analyzePdf}
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Analyze PDF
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

export default PdfAnalysis;
