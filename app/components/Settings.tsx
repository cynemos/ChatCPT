import React, { useState } from 'react';

function Settings({ apiKey, setApiKey }: { apiKey: string; setApiKey: (apiKey: string) => void }) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(localApiKey);
    alert('API Key saved!');
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Settings</h2>
      <div className="mb-4">
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
          OpenAI API Key
        </label>
        <input
          type="password"
          id="apiKey"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={localApiKey}
          onChange={(e) => setLocalApiKey(e.target.value)}
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Save API Key
      </button>
    </div>
  );
}

export default Settings;
