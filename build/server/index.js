import { jsx, jsxs } from "react/jsx-runtime";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import OpenAI from "openai";
import { json } from "@remix-run/node";
import fs from "node:fs/promises";
import path from "node:path";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon, PhotoIcon, MicrophoneIcon, DocumentIcon, EyeIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    try {
      let markup = renderToString(
        /* @__PURE__ */ jsx(
          RemixServer,
          {
            context: remixContext,
            url: request.url
          }
        )
      );
      resolve(new Response(markup, {
        status: responseStatusCode,
        headers: {
          ...Object.fromEntries(responseHeaders),
          "Content-Type": "text/html"
        }
      }));
    } catch (error) {
      reject(error);
    }
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const action$4 = async ({ request }) => {
  const formData = await request.formData();
  const audio = formData.get("audio");
  const apiKey = formData.get("apiKey");
  if (!audio) {
    return json({ error: "No audio file provided." }, { status: 400 });
  }
  const openai = new OpenAI({
    apiKey
  });
  try {
    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempFilePath = path.join("/tmp", audio.name);
    await fs.writeFile(tempFilePath, buffer);
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      // Weird type conversion
      model: "whisper-1"
    });
    await fs.unlink(tempFilePath);
    return json({ transcription: transcription.text });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return json({ error: "Failed to transcribe audio." }, { status: 500 });
  }
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
const action$3 = async ({ request }) => {
  const { prompt, apiKey } = await request.json();
  const openai = new OpenAI({
    apiKey
  });
  try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024"
    });
    return json({ imageUrl: image.data[0].url });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return json({ error: "Failed to generate image." }, { status: 500 });
  }
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({ request }) => {
  const formData = await request.formData();
  const image = formData.get("image");
  const apiKey = formData.get("apiKey");
  if (!image) {
    return json({ error: "No image file provided." }, { status: 400 });
  }
  const openai = new OpenAI({
    apiKey
  });
  try {
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
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
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });
    return json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return json({ error: "Failed to analyze image." }, { status: 500 });
  }
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({ request }) => {
  return json({ analysis: "PDF analysis is not implemented in this environment due to the lack of PDF processing libraries." }, { status: 501 });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
const action = async ({ request }) => {
  const { message, apiKey } = await request.json();
  const openai = new OpenAI({
    apiKey
  });
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }]
    });
    return json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return json({ response: "Failed to get response from OpenAI." }, { status: 500 });
  }
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
function Chat({ apiKey }) {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const sendMessage = async () => {
    if (!message) return;
    setChatLog([...chatLog, { type: "user", message }]);
    setMessage("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message, apiKey })
      });
      const data = await response.json();
      setChatLog((prevChatLog) => [...prevChatLog, { type: "bot", message: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatLog((prevChatLog) => [...prevChatLog, { type: "bot", message: "Error processing your request." }]);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-grow p-4 overflow-y-auto", children: chatLog.map((msg, index) => /* @__PURE__ */ jsx("div", { className: `mb-2 ${msg.type === "user" ? "text-right" : "text-left"}`, children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-lg ${msg.type === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`, children: msg.message }) }, index)) }),
    /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex rounded-md shadow-sm", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "flex-grow focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md border border-gray-300 px-3 py-2 text-gray-900",
          placeholder: "Enter your message",
          value: message,
          onChange: (e) => setMessage(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: sendMessage,
          className: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-md",
          children: "Send"
        }
      )
    ] }) })
  ] });
}
function ImageGeneration({ apiKey }) {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const generateImage = async () => {
    if (!prompt) return;
    try {
      const response = await fetch("/api/image-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt, apiKey })
      });
      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-2", children: "Image Generation" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "prompt", className: "block text-sm font-medium text-gray-700", children: "Prompt" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          id: "prompt",
          className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          value: prompt,
          onChange: (e) => setPrompt(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: generateImage,
        className: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded",
        children: "Generate Image"
      }
    ),
    imageUrl && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("img", { src: imageUrl, alt: "Generated Image", className: "max-w-full rounded-lg" }) })
  ] });
}
function AudioTranscription({ apiKey }) {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };
  const transcribeAudio = async () => {
    if (!audioFile) return;
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("apiKey", apiKey);
    try {
      const response = await fetch("/api/audio-transcription", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      setTranscription(data.transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      alert("Failed to transcribe audio.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-2", children: "Audio Transcription" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "audio", className: "block text-sm font-medium text-gray-700", children: "Select Audio File" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          id: "audio",
          accept: "audio/*",
          className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          onChange: handleFileChange
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: transcribeAudio,
        className: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded",
        children: "Transcribe"
      }
    ),
    transcription && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-700", children: "Transcription:" }),
      /* @__PURE__ */ jsx("p", { className: "whitespace-pre-line", children: transcription })
    ] })
  ] });
}
function PdfAnalysis({ apiKey }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };
  const analyzePdf = async () => {
    if (!pdfFile) return;
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("apiKey", apiKey);
    try {
      const response = await fetch("/api/pdf-analysis", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      alert("Failed to analyze PDF.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-2", children: "PDF Analysis" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "pdf", className: "block text-sm font-medium text-gray-700", children: "Select PDF File" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          id: "pdf",
          accept: "application/pdf",
          className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          onChange: handleFileChange
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: analyzePdf,
        className: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded",
        children: "Analyze PDF"
      }
    ),
    analysisResult && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-700", children: "Analysis Result:" }),
      /* @__PURE__ */ jsx("p", { className: "whitespace-pre-line", children: analysisResult })
    ] })
  ] });
}
function ImageAnalysis({ apiKey }) {
  const [imageFile, setImageFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };
  const analyzeImage = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("apiKey", apiKey);
    try {
      const response = await fetch("/api/image-analysis", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-2", children: "Image Analysis" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "image", className: "block text-sm font-medium text-gray-700", children: "Select Image File" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          id: "image",
          accept: "image/*",
          className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          onChange: handleFileChange
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: analyzeImage,
        className: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded",
        children: "Analyze Image"
      }
    ),
    analysisResult && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-700", children: "Analysis Result:" }),
      /* @__PURE__ */ jsx("p", { className: "whitespace-pre-line", children: analysisResult })
    ] })
  ] });
}
function Settings({ apiKey, setApiKey }) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const handleSave = () => {
    setApiKey(localApiKey);
    alert("API Key saved!");
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-2", children: "Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "apiKey", className: "block text-sm font-medium text-gray-700", children: "OpenAI API Key" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          id: "apiKey",
          className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          value: localApiKey,
          onChange: (e) => setLocalApiKey(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleSave,
        className: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded",
        children: "Save API Key"
      }
    )
  ] });
}
const meta = () => [
  { title: "ChatGPT Clone by CYNEMOS" },
  { description: "An enhanced ChatGPT clone with multiple functionalities." }
];
function Index() {
  const [apiKey, setApiKey] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("chat");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedApiKey = localStorage.getItem("openai_api_key");
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("openai_api_key", apiKey);
    }
  }, [apiKey]);
  const renderFeature = useCallback(() => {
    const features = {
      "chat": /* @__PURE__ */ jsx(Chat, { apiKey }),
      "image-generation": /* @__PURE__ */ jsx(ImageGeneration, { apiKey }),
      "audio-transcription": /* @__PURE__ */ jsx(AudioTranscription, { apiKey }),
      "pdf-analysis": /* @__PURE__ */ jsx(PdfAnalysis, { apiKey }),
      "image-analysis": /* @__PURE__ */ jsx(ImageAnalysis, { apiKey }),
      "settings": /* @__PURE__ */ jsx(Settings, { apiKey, setApiKey })
    };
    return features[selectedFeature] || /* @__PURE__ */ jsx(Chat, { apiKey });
  }, [apiKey, selectedFeature]);
  const featureButtons = [
    { name: "chat", label: "Chat", icon: ChatBubbleLeftRightIcon },
    { name: "image-generation", label: "Image Generation", icon: PhotoIcon },
    { name: "audio-transcription", label: "Audio Transcription", icon: MicrophoneIcon },
    { name: "pdf-analysis", label: "PDF Analysis", icon: DocumentIcon },
    { name: "image-analysis", label: "Image Analysis", icon: EyeIcon },
    { name: "settings", label: "Settings", icon: Cog6ToothIcon }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-100 to-blue-100", children: [
    /* @__PURE__ */ jsx("header", { className: "bg-white shadow-sm mb-4", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto py-4 px-6 sm:px-8 lg:px-10", children: /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-gray-900", children: "ChatGPT Clone by CYNEMOS" }) }) }),
    /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex h-[70vh] shadow-lg rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsx("nav", { className: "w-64 bg-white p-4 rounded-l-xl", children: /* @__PURE__ */ jsx("ul", { children: featureButtons.map(({ name, label, icon: Icon }) => /* @__PURE__ */ jsx("li", { className: "mb-3", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedFeature(name),
          className: `w-full text-left flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200 ${selectedFeature === name ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`,
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }),
            /* @__PURE__ */ jsx("span", { children: label })
          ]
        }
      ) }, name)) }) }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -50 },
          transition: { duration: 0.3 },
          className: "flex-1 bg-white rounded-r-xl p-6",
          children: renderFeature()
        },
        selectedFeature
      )
    ] }) }) })
  ] });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DBS4ncH8.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-Cg_nHh0T.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-D9Ajy4F-.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-Cg_nHh0T.js"], "css": ["/assets/root-16ozSST9.css"] }, "routes/api.audio-transcription": { "id": "routes/api.audio-transcription", "parentId": "root", "path": "api/audio-transcription", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.audio-transcription-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.image-generation": { "id": "routes/api.image-generation", "parentId": "root", "path": "api/image-generation", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.image-generation-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.image-analysis": { "id": "routes/api.image-analysis", "parentId": "root", "path": "api/image-analysis", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.image-analysis-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.pdf-analysis": { "id": "routes/api.pdf-analysis", "parentId": "root", "path": "api/pdf-analysis", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.pdf-analysis-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.chat": { "id": "routes/api.chat", "parentId": "root", "path": "api/chat", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.chat-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BFUrisn7.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js"], "css": [] } }, "url": "/assets/manifest-9c7162c5.js", "version": "9c7162c5" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/api.audio-transcription": {
    id: "routes/api.audio-transcription",
    parentId: "root",
    path: "api/audio-transcription",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/api.image-generation": {
    id: "routes/api.image-generation",
    parentId: "root",
    path: "api/image-generation",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/api.image-analysis": {
    id: "routes/api.image-analysis",
    parentId: "root",
    path: "api/image-analysis",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api.pdf-analysis": {
    id: "routes/api.pdf-analysis",
    parentId: "root",
    path: "api/pdf-analysis",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/api.chat": {
    id: "routes/api.chat",
    parentId: "root",
    path: "api/chat",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route6
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
