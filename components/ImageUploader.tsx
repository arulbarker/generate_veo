
import React, { useState, useCallback, useRef } from 'react';
import type { ImageFile } from '../types';
import { ImageIcon, TrashIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile | null) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        setFileName(file.name);
        onImageUpload({
          base64: base64String,
          mimeType: file.type,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);
  
  const removeImage = useCallback(() => {
    setPreview(null);
    setFileName(null);
    onImageUpload(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [onImageUpload]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-300 mb-2">Reference Image (Optional)</h3>
      <div 
        className={`mt-2 flex justify-center items-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
          disabled ? 'cursor-not-allowed bg-gray-800/50' : 'border-gray-600 hover:border-indigo-500 hover:bg-gray-700/50'
        }`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
          disabled={disabled}
        />
        {preview ? (
          <div className="relative p-4 w-full">
            <img src={preview} alt="Image preview" className="max-h-48 rounded-md mx-auto" />
            <p className="text-center text-sm mt-2 text-gray-400 truncate">{fileName}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); removeImage(); }} 
              className="absolute top-2 right-2 bg-red-600/70 hover:bg-red-500 rounded-full p-1.5 text-white transition-colors"
              disabled={disabled}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-center p-8">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-500" />
            <p className="mt-2 text-sm text-gray-400">
              <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
