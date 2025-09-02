import { GoogleGenAI, Modality } from '@google/genai';
import type { FormState, ImageFile, EditedImage } from '../types';
import { VEO_MODEL_NAME, NANO_BANANA_MODEL_NAME } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper to wait for a specific duration
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
}

export const generateVEOVideo = async (
  formState: FormState,
  imageFile: ImageFile | null,
  onProgress: (message: string) => void
): Promise<Blob> => {
  const apiKey = getApiKey();
  onProgress('Starting video generation process...');

  const generationOptions: any = {
    model: VEO_MODEL_NAME,
    prompt: formState.prompt,
    config: {
      numberOfVideos: 1,
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

export const editImageWithNanoBanana = async (
  prompt: string,
  imageFile: ImageFile
): Promise<EditedImage> => {
  getApiKey();

  const response = await ai.models.generateContent({
    model: NANO_BANANA_MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            data: imageFile.base64,
            mimeType: imageFile.mimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const mimeType: string = part.inlineData.mimeType;
      return {
        url: `data:${mimeType};base64,${base64ImageBytes}`,
        mimeType: mimeType
      };
    }
  }

  throw new Error("The model did not return an image. It may have refused the request.");
};