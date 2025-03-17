import React, { useState } from 'react';

function AudioTranscription({ apiKey }: { apiKey: string }) {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');

  const handleFileChange = (event: any) => {
    setAudioFile(event.target.files[0]);
  };

  const transcribeAudio = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('apiKey', apiKey);

    try {
      const response = await fetch('/api/audio-transcription', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setTranscription(data.transcription);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Failed to transcribe audio.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Audio Transcription</h2>
      <div className="mb-4">
        <label htmlFor="audio" className="block text-sm font-medium text-gray-700">
          Select Audio File
        </label>
        <input
          type="file"
          id="audio"
          accept="audio/*"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={handleFileChange}
        />
      </div>
      <button
        onClick={transcribeAudio}
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Transcribe
      </button>
      {transcription && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">Transcription:</h3>
          <p className="whitespace-pre-line">{transcription}</p>
        </div>
      )}
    </div>
  );
}

export default AudioTranscription;
