
import React, { useState, useCallback, useEffect } from 'react';
import type { FormState, ImageFile, VideoGenerationState } from './types';
import { generateVEOVideo } from './services/geminiService';
import { LOADING_MESSAGES } from './constants';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageUploader from './components/ImageUploader';
import ConfigurationPanel from './components/ConfigurationPanel';
import VideoOutput from './components/VideoOutput';
import { DownloadIcon } from './components/icons';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [formState, setFormState] = useState<FormState>({
    prompt: 'A majestic lion roaring on a cliff at sunset, cinematic lighting',
    aspectRatio: '16:9',
    soundEnabled: true,
    resolution: '1080p',
  });
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [videoState, setVideoState] = useState<VideoGenerationState>({
    videoUrl: null,
    isLoading: false,
    loadingMessage: '',
    error: null,
  });

  const handleFormChange = useCallback((updates: Partial<FormState>) => {
    setFormState(prevState => ({ ...prevState, ...updates }));
  }, []);

  const handleImageUpload = useCallback((file: ImageFile | null) => {
    setImageFile(file);
  }, []);

  const handleGenerateVideo = async () => {
    if (!apiKey.trim()) {
      setVideoState(prevState => ({ ...prevState, error: 'Please enter your Gemini API key first.' }));
      return;
    }
    
    if (!formState.prompt.trim()) {
      setVideoState(prevState => ({ ...prevState, error: 'Prompt cannot be empty.' }));
      return;
    }
    
    // Clean up previous video URL to prevent memory leaks
    if (videoState.videoUrl) {
      URL.revokeObjectURL(videoState.videoUrl);
    }
    
    setVideoState({
      videoUrl: null,
      isLoading: true,
      loadingMessage: LOADING_MESSAGES[0],
      error: null,
    });

    try {
      const onProgress = (message: string) => {
        setVideoState(prevState => ({ ...prevState, loadingMessage: message }));
      };

      const videoBlob = await generateVEOVideo(formState, imageFile, onProgress, apiKey);
      const url = URL.createObjectURL(videoBlob);
      setVideoState({ videoUrl: url, isLoading: false, loadingMessage: '', error: null });
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setVideoState({ videoUrl: null, isLoading: false, loadingMessage: '', error: errorMessage });
    }
  };
  
  // Effect for cycling loading messages
  useEffect(() => {
    // FIX: Changed NodeJS.Timeout to ReturnType<typeof setInterval> for browser compatibility.
    let interval: ReturnType<typeof setInterval>;
    if (videoState.isLoading) {
      interval = setInterval(() => {
        setVideoState(prevState => {
          const currentIndex = LOADING_MESSAGES.indexOf(prevState.loadingMessage);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return { ...prevState, loadingMessage: LOADING_MESSAGES[nextIndex] };
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [videoState.isLoading, videoState.loadingMessage]);

  // Effect for cleaning up object URL on component unmount
  useEffect(() => {
    return () => {
      if (videoState.videoUrl) {
        URL.revokeObjectURL(videoState.videoUrl);
      }
    };
  }, [videoState.videoUrl]);

  const DeveloperSection = () => (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">🚀 Developer</h3>
      
      <div className="grid grid-cols-3 gap-2">
        {/* YouTube */}
        <a 
          href="https://www.youtube.com/@arulcg" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 transition-colors duration-300 rounded-lg p-2 text-center shadow-md transform hover:scale-105"
        >
          <div className="text-white text-sm mb-1">📺</div>
          <p className="text-red-100 text-xs font-medium">YouTube</p>
        </a>

        {/* Instagram */}
        <a 
          href="https://www.instagram.com/arul.cg/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 rounded-lg p-2 text-center shadow-md transform hover:scale-105"
        >
          <div className="text-white text-sm mb-1">📷</div>
          <p className="text-pink-100 text-xs font-medium">Instagram</p>
        </a>

        {/* Facebook */}
        <a 
          href="https://www.facebook.com/profile.php?id=61578938703730" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-lg p-2 text-center shadow-md transform hover:scale-105"
        >
          <div className="text-white text-sm mb-1">📘</div>
          <p className="text-blue-100 text-xs font-medium">Facebook</p>
        </a>

        {/* Threads */}
        <a 
          href="https://www.threads.com/@arul.cg" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gray-900 hover:bg-black transition-colors duration-300 rounded-lg p-2 text-center shadow-md transform hover:scale-105 border border-gray-700"
        >
          <div className="text-white text-sm mb-1">🧵</div>
          <p className="text-gray-300 text-xs font-medium">Threads</p>
        </a>

        {/* X (Twitter) */}
        <a 
          href="https://x.com/ArulCg" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-black hover:bg-gray-900 transition-colors duration-300 rounded-lg p-2 text-center shadow-md transform hover:scale-105 border border-gray-700"
        >
          <div className="text-white text-sm mb-1">🐦</div>
          <p className="text-gray-300 text-xs font-medium">X</p>
        </a>

        {/* LYNKID */}
        <a 
          href="https://lynk.id/arullagi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-lg p-2 text-center shadow-md transform hover:scale-105"
        >
          <div className="text-white text-sm mb-1">🔗</div>
          <p className="text-green-100 text-xs font-medium">LYNKID</p>
        </a>
      </div>

      <div className="mt-3 text-center">
        <p className="text-gray-400 text-xs">Follow me for updates!</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6">
            {/* API Key Input */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">🔑 API Key</h3>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key from Google AI Studio"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={videoState.isLoading}
              />
              <p className="text-gray-400 text-sm mt-2">
                Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Google AI Studio</a>
              </p>
            </div>
            
            <PromptInput
              prompt={formState.prompt}
              onPromptChange={(prompt) => handleFormChange({ prompt })}
              disabled={videoState.isLoading}
            />
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              disabled={videoState.isLoading} 
            />
            <ConfigurationPanel
              formState={formState}
              onFormChange={handleFormChange}
              disabled={videoState.isLoading}
            />
            
            {/* Developer Section - Always visible */}
            <DeveloperSection />
            
            <button
              onClick={handleGenerateVideo}
              disabled={videoState.isLoading || !formState.prompt || !apiKey}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
            >
              {videoState.isLoading ? 'Generating...' : 'Generate Video'}
            </button>
          </div>
          
          {/* Right Column: Output */}
          <div className="mt-8 lg:mt-0">
            <VideoOutput
              videoUrl={videoState.videoUrl}
              isLoading={videoState.isLoading}
              loadingMessage={videoState.loadingMessage}
              error={videoState.error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;