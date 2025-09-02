
import { GoogleGenAI } from '@google/genai';
import type { FormState, ImageFile } from '../types';
import { VEO_MODEL_NAME } from '../constants';

// Helper to wait for a specific duration
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateVEOVideo = async (
  formState: FormState,
  imageFile: ImageFile | null,
  onProgress: (message: string) => void,
  apiKey: string
): Promise<Blob> => {
  if (!apiKey) {
    throw new Error("API Key is required. Please enter your Gemini API key.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  onProgress('Starting video generation process...');

  const generationOptions: any = {
    model: veo-3.0-generate-preview,
    prompt: formState.prompt,
    config: {
      numberOfVideos: 1,
      // NOTE: The following VEO API parameters are not yet exposed in the SDK.
      // The UI options are for demonstration and future compatibility.
      // aspectRatio: formState.aspectRatio,
      // soundEnabled: formState.soundEnabled,
      // resolution: formState.resolution,
    },
  };

  if (imageFile) {
    generationOptions.image = {
      imageBytes: imageFile.base64,
      mimeType: imageFile.mimeType,
    };
  }

  let operation = await ai.models.generateVideos(generationOptions);
  
  onProgress('Video operation started. Polling for completion...');

  // Polling logic
  while (!operation.done) {
    await delay(10000); // Poll every 10 seconds
    try {
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log('Polling status:', operation.done);
    } catch (error) {
      console.error('Error during polling:', error);
      throw new Error('Failed to get operation status during polling.');
    }
  }

  onProgress('Video processing complete. Fetching video file...');

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    console.error('Operation response:', operation.response);
    throw new Error('Video generation succeeded, but no download link was found.');
  }

  const videoUrl = `${downloadLink}&key=${apiKey}`;
  
  const response = await fetch(videoUrl);

  if (!response.ok) {
    throw new Error(`Failed to download the video. Status: ${response.statusText}`);
  }

  onProgress('Download complete!');
  
  return response.blob();
};
