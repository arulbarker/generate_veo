import React from 'react';
import type { FormState, Model, AspectRatio, Resolution } from '../types';
import { MODELS, VEO_MODEL_NAME } from '../constants';

interface ConfigurationPanelProps {
  formState: FormState;
  onFormChange: (updates: Partial<FormState>) => void;
  disabled: boolean;
}

const OptionButton = <T,>({ value, selectedValue, onClick, children, disabled = false }: { value: T, selectedValue: any, onClick: (value: T) => void, children: React.ReactNode, disabled?: boolean }) => (
  <button
    onClick={() => onClick(value)}
    disabled={disabled}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed ${
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
      <div className="space-y-4">
        {/* Model Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-2">Select Model</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(MODELS) as Model[]).map((modelKey) => (
              <OptionButton 
                key={modelKey}
                value={modelKey} 
                selectedValue={formState.model} 
                onClick={(v) => handleOptionChange('model', v as Model)}
                disabled={disabled}
              >
                {MODELS[modelKey].name} ({MODELS[modelKey].type})
              </OptionButton>
            ))}
          </div>
        </div>

        {formState.model === VEO_MODEL_NAME && (
          <div className="space-y-4 border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-base font-semibold text-gray-300">Video Options</h3>
            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                <OptionButton value="16:9" selectedValue={formState.aspectRatio} onClick={(v) => handleOptionChange('aspectRatio', v as AspectRatio)} disabled={disabled}>16:9</OptionButton>
                <OptionButton value="9:16" selectedValue={formState.aspectRatio} onClick={(v) => handleOptionChange('aspectRatio', v as AspectRatio)} disabled={disabled}>9:16</OptionButton>
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Resolution <span className="text-gray-500">(for demo)</span></label>
              <div className="grid grid-cols-2 gap-2">
                <OptionButton value="720p" selectedValue={formState.resolution} onClick={(v) => handleOptionChange('resolution', v as Resolution)} disabled={disabled}>720p</OptionButton>
                <OptionButton value="1080p" selectedValue={formState.resolution} onClick={(v) => handleOptionChange('resolution', v as Resolution)} disabled={disabled}>1080p</OptionButton>
              </div>
            </div>

            {/* Sound */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sound <span className="text-gray-500">(for demo)</span></label>
              <div className="grid grid-cols-2 gap-2">
                <OptionButton value={true} selectedValue={formState.soundEnabled} onClick={(v) => handleOptionChange('soundEnabled', v as boolean)} disabled={disabled}>Enabled</OptionButton>
                <OptionButton value={false} selectedValue={formState.soundEnabled} onClick={(v) => handleOptionChange('soundEnabled', v as boolean)} disabled={disabled}>Disabled</OptionButton>
              </div>
            </div>
             <p className="text-xs text-gray-500">Note: Sound and Resolution options are for demonstration purposes as they are not yet fully supported in the current API version.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPanel;