import { useState, useEffect, useCallback } from 'react';
import { Link, Outlet } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  MicrophoneIcon,
  DocumentIcon,
  EyeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Chat from "~/components/Chat";
import ImageGeneration from "~/components/ImageGeneration";
import AudioTranscription from "~/components/AudioTranscription";
import PdfAnalysis from "~/components/PdfAnalysis";
import ImageAnalysis from "~/components/ImageAnalysis";
import Settings from "~/components/Settings";

export const meta: MetaFunction = () => ([
  { title: "ChatGPT Clone by CYNEMOS" },
  { description: "An enhanced ChatGPT clone with multiple functionalities." }
]);

export default function Index() {
  const [apiKey, setApiKey] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('chat');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedApiKey = localStorage.getItem('openai_api_key');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('openai_api_key', apiKey);
    }
  }, [apiKey, isClient]);

  const renderFeature = useCallback(() => {
    const features = {
      'chat': <Chat apiKey={apiKey} />,
      'image-generation': <ImageGeneration apiKey={apiKey} />,
      'audio-transcription': <AudioTranscription apiKey={apiKey} />,
      'pdf-analysis': <PdfAnalysis apiKey={apiKey} />,
      'image-analysis': <ImageAnalysis apiKey={apiKey} />,
      'settings': <Settings apiKey={apiKey} setApiKey={setApiKey} />,
    };
    return features[selectedFeature] || <Chat apiKey={apiKey} />;
  }, [apiKey, selectedFeature]);

  const featureButtons = [
    { name: 'chat', label: 'Chat', icon: ChatBubbleLeftRightIcon },
    { name: 'image-generation', label: 'Image Generation', icon: PhotoIcon },
    { name: 'audio-transcription', label: 'Audio Transcription', icon: MicrophoneIcon },
    { name: 'pdf-analysis', label: 'PDF Analysis', icon: DocumentIcon },
    { name: 'image-analysis', label: 'Image Analysis', icon: EyeIcon },
    { name: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <header className="bg-white shadow-sm mb-4">
        <div className="max-w-7xl mx-auto py-4 px-6 sm:px-8 lg:px-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            ChatGPT Clone by CYNEMOS
          </h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex h-[70vh] shadow-lg rounded-xl overflow-hidden">
            <nav className="w-64 bg-white p-4 rounded-l-xl">
              <ul>
                {featureButtons.map(({ name, label, icon: Icon }) => (
                  <li key={name} className="mb-3">
                    <button
                      onClick={() => setSelectedFeature(name)}
                      className={`w-full text-left flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200 ${
                        selectedFeature === name ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-white rounded-r-xl p-6"
            >
              {renderFeature()}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
