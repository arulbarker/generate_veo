
export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';

export interface FormState {
  prompt: string;
  aspectRatio: AspectRatio;
  soundEnabled: boolean;
  resolution: Resolution;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface VideoGenerationState {
  videoUrl: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

export interface VideoHistoryItem {
  id: string;
  videoUrl: string;
  prompt: string;
  timestamp: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  imageUsed: boolean;
}
