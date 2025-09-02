export const VEO_MODEL_NAME = 'veo-2.0-generate-001';
export const NANO_BANANA_MODEL_NAME = 'gemini-2.5-flash-image-preview';

export const MODELS = {
  [VEO_MODEL_NAME]: {
    name: 'VEO',
    type: 'Video',
  },
  [NANO_BANANA_MODEL_NAME]: {
    name: 'Nano Banana',
    type: 'Image Edit',
  },
} as const;


export const LOADING_MESSAGES = [
  'Initializing model...',
  'Analyzing your prompt and image...',
  'Compositing initial frames...',
  'This can take a few minutes, please wait...',
  'Rendering high-resolution details...',
  'Applying final touches...',
  'Almost there, finalizing the output...',
];