import React, { useState, useCallback, useEffect } from 'react';
import type { FormState, ImageFile, OutputState, Model } from './types';
import { generateVEOVideo, editImageWithNanoBanana } from './services/geminiService';
import { LOADING_MESSAGES, NANO_BANANA_MODEL_NAME, VEO_MODEL_NAME } from './constants';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageUploader from './components/ImageUploader';
import ConfigurationPanel from './components/ConfigurationPanel';
import OutputPanel from './components/VideoOutput';

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    prompt: 'A majestic lion roaring on a cliff at sunset, cinematic lighting',
    aspectRatio: '16:9',
    soundEnabled: true,
    resolution: '1080p',
    model: VEO_MODEL_NAME,
  });
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [outputState, setOutputState] = useState<OutputState>({
    videoUrl: null,
    imageUrl: null,
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

  const handleGenerate = async () => {
    if (!formState.prompt.trim()) {
      setOutputState(prevState => ({ ...prevState, error: 'Prompt cannot be empty.' }));
      return;
    }

    // Clean up previous media URLs to prevent memory leaks
    if (outputState.videoUrl) URL.revokeObjectURL(outputState.videoUrl);
    // Image URL is base64, no need to revoke

    setOutputState({
      videoUrl: null,
      imageUrl: null,
      isLoading: true,
      loadingMessage: LOADING_MESSAGES[0],
      error: null,
    });

    try {
      if (formState.model === VEO_MODEL_NAME) {
        // --- Video Generation Logic ---
        const videoBlob = await generateVEOVideo(formState, imageFile, (message) => {
          setOutputState(prevState => ({ ...prevState, loadingMessage: message }));
        });
        const url = URL.createObjectURL(videoBlob);
        setOutputState({ videoUrl: url, imageUrl: null, isLoading: false, loadingMessage: '', error: null });
      } else if (formState.model === NANO_BANANA_MODEL_NAME) {
        // --- Image Editing Logic ---
        if (!imageFile) {
          throw new Error('An image is required for the Nano Banana model.');
        }
        const editedImage = await editImageWithNanoBanana(formState.prompt, imageFile);
        setOutputState({ videoUrl: null, imageUrl: editedImage.url, isLoading: false, loadingMessage: '', error: null });
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setOutputState({ videoUrl: null, imageUrl: null, isLoading: false, loadingMessage: '', error: errorMessage });
    }
  };

  // Effect for cycling loading messages
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (outputState.isLoading) {
      interval = setInterval(() => {
        setOutputState(prevState => {
          const currentIndex = LOADING_MESSAGES.indexOf(prevState.loadingMessage);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return { ...prevState, loadingMessage: LOADING_MESSAGES[nextIndex] };
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [outputState.isLoading, outputState.loadingMessage]);

  // Effect for cleaning up object URL on component unmount
  useEffect(() => {
    return () => {
      if (outputState.videoUrl) {
        URL.revokeObjectURL(outputState.videoUrl);
      }
    };
  }, [outputState.videoUrl]);

  const isNanoBanana = formState.model === NANO_BANANA_MODEL_NAME;
  const isGenerationDisabled = outputState.isLoading || !formState.prompt || (isNanoBanana && !imageFile);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6">
            <ConfigurationPanel
              formState={formState}
              onFormChange={handleFormChange}
              disabled={outputState.isLoading}
            />
            <PromptInput
              prompt={formState.prompt}
              onPromptChange={(prompt) => handleFormChange({ prompt })}
              disabled={outputState.isLoading}
            />
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              disabled={outputState.isLoading} 
              isRequired={isNanoBanana}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerationDisabled}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
              aria-live="polite"
            >
              {outputState.isLoading ? 'Generating...' : (isNanoBanana ? 'Edit Image' : 'Generate Video')}
            </button>
          </div>
          {/* Right Column: Output */}
          <div className="mt-8 lg:mt-0">
            <OutputPanel
              videoUrl={outputState.videoUrl}
              imageUrl={outputState.imageUrl}
              isLoading={outputState.isLoading}
              loadingMessage={outputState.loadingMessage}
              error={outputState.error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;