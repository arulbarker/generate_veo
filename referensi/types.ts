import { VEO_MODEL_NAME, NANO_BANANA_MODEL_NAME } from './constants';

export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';
export type Model = typeof VEO_MODEL_NAME | typeof NANO_BANANA_MODEL_NAME;

export interface FormState {
  prompt: string;
  aspectRatio: AspectRatio;
  soundEnabled: boolean;
  resolution: Resolution;
  model: Model;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface OutputState {
  videoUrl: string | null;
  imageUrl: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

export interface EditedImage {
  url: string;
  mimeType: string;
}