
import React from 'react';
import type { FormState, AspectRatio, Resolution } from '../types';

interface ConfigurationPanelProps {
  formState: FormState;
  onFormChange: (updates: Partial<FormState>) => void;
  disabled: boolean;
}

// FIX: Changed selectedValue type from T to any to resolve type mismatch between literal value and union-typed state.
const OptionButton = <T,>({ value, selectedValue, onClick, children }: { value: T, selectedValue: any, onClick: (value: T) => void, children: React.ReactNode }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full ${
      selectedValue === value 
        ? 'bg-indigo-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {children}
  </button>
);

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ formState, onFormChange, disabled }) => {
  const handleOptionChange = <K extends keyof FormState,>(key: K, value: FormState[K]) => {
    if(!disabled) {
        onFormChange({ [key]: value });
    }
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg border border-gray-700 transition-opacity duration-300 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <h3 className="text-lg font-semibold text-gray-300 mb-4">Configuration</h3>
      <div className="space-y-4">
        {/* Aspect Ratio */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Aspect Ratio</label>
          <div className="grid grid-cols-2 gap-2">
            <OptionButton value="16:9" selectedValue={formState.aspectRatio} onClick={(v) => handleOptionChange('aspectRatio', v as AspectRatio)}>16:9</OptionButton>
            <OptionButton value="9:16" selectedValue={formState.aspectRatio} onClick={(v) => handleOptionChange('aspectRatio', v as AspectRatio)}>9:16</OptionButton>
          </div>
        </div>

        {/* Resolution */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Resolution <span className="text-gray-500">(for demo)</span></label>
          <div className="grid grid-cols-2 gap-2">
            <OptionButton value="720p" selectedValue={formState.resolution} onClick={(v) => handleOptionChange('resolution', v as Resolution)}>720p</OptionButton>
            <OptionButton value="1080p" selectedValue={formState.resolution} onClick={(v) => handleOptionChange('resolution', v as Resolution)}>1080p</OptionButton>
          </div>
        </div>

        {/* Sound */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Sound <span className="text-gray-500">(for demo)</span></label>
          <div className="grid grid-cols-2 gap-2">
            <OptionButton value={true} selectedValue={formState.soundEnabled} onClick={(v) => handleOptionChange('soundEnabled', v as boolean)}>Enabled</OptionButton>
            <OptionButton value={false} selectedValue={formState.soundEnabled} onClick={(v) => handleOptionChange('soundEnabled', v as boolean)}>Disabled</OptionButton>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4">Note: Sound and Resolution options are for demonstration purposes as they are not yet fully supported in the current API version.</p>
    </div>
  );
};

export default ConfigurationPanel;