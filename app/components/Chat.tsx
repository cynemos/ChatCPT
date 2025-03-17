import React, { useState } from 'react';

function Chat({ apiKey }: { apiKey: string }) {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    if (!message) return;

    setChatLog([...chatLog, { type: 'user', message }]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, apiKey }),
      });

      const data = await response.json();
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: 'Error processing your request.' }]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto">
        {chatLog.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`px-3 py-1 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="flex rounded-md shadow-sm">
          <input
            type="text"
            className="flex-grow focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md border border-gray-300 px-3 py-2 text-gray-900"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
