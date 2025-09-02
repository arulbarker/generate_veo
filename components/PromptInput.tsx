
import React from 'react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  disabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, onPromptChange, disabled }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <label htmlFor="prompt" className="block text-lg font-semibold mb-2 text-gray-300">
        Prompt
      </label>
      <p className="text-sm text-gray-500 mb-3">
        Describe the video you want to create. You can use plain text or a JSON formatted string for more complex instructions.
      </p>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="e.g., A cinematic shot of a futuristic city with flying cars..."
        rows={6}
        className="w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-y"
        disabled={disabled}
      />
      <div className="text-right text-sm text-gray-500 mt-2">
        {prompt.length} / 2000
      </div>
    </div>
  );
};

export default PromptInput;
