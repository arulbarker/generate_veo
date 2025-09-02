import React from 'react';
import { DownloadIcon } from './icons';

interface OutputPanelProps {
  videoUrl: string | null;
  imageUrl: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const Spinner: React.FC = () => (
  <div className="border-4 border-t-4 border-gray-600 border-t-indigo-500 rounded-full w-12 h-12 animate-spin"></div>
);

const OutputPanel: React.FC<OutputPanelProps> = ({ videoUrl, imageUrl, isLoading, loadingMessage, error }) => {
  const getDownloadName = () => {
    if (videoUrl) return "veo-generated-video.mp4";
    if (imageUrl) return "nano-banana-edited-image.png";
    return "download";
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 aspect-video flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {isLoading && (
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-lg font-semibold text-gray-300 animate-pulse">{loadingMessage}</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center text-red-400">
          <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && !videoUrl && !imageUrl && (
        <div className="text-center text-gray-500">
          <h3 className="text-xl font-bold">Output Panel</h3>
          <p>Your generated media will appear here.</p>
        </div>
      )}

      {(videoUrl || imageUrl) && !isLoading && (
        <>
          {videoUrl && (
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              className="absolute top-0 left-0 w-full h-full object-contain bg-black"
            >
              Your browser does not support the video tag.
            </video>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Generated output"
              className="absolute top-0 left-0 w-full h-full object-contain bg-black"
            />
          )}
          <a
            href={videoUrl || imageUrl || '#'}
            download={getDownloadName()}
            className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110 z-10"
            aria-label="Download media"
          >
            <DownloadIcon className="h-6 w-6" />
          </a>
        </>
      )}
    </div>
  );
};

export default OutputPanel;