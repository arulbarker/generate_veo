import React from 'react';
import type { VideoHistoryItem } from '../types';

interface VideoHistoryProps {
  history: VideoHistoryItem[];
  onDeleteVideo: (id: string) => void;
  onClearHistory: () => void;
}

const VideoHistory: React.FC<VideoHistoryProps> = ({ history, onDeleteVideo, onClearHistory }) => {
  const downloadVideo = (videoUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `video-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generating':
        return <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">⏳ Generating...</span>;
      case 'completed':
        return <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">✅ Completed</span>;
      case 'error':
        return <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">❌ Error</span>;
      default:
        return null;
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg h-full flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4">📚 Video History</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-center">No videos generated yet. Create your first video!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">📚 Video History ({history.length})</h3>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto">
        {history.map((item) => (
          <div key={item.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Status Badge */}
                <div className="mb-3">
                  {getStatusBadge(item.status)}
                </div>

                {/* Video or Loading Placeholder */}
                {item.status === 'generating' ? (
                  <div className="w-full max-w-xs bg-gray-800 rounded-lg mb-3 aspect-video flex items-center justify-center border-2 border-dashed border-gray-600">
                    <div className="text-center">
                      <div className="animate-spin text-2xl mb-2">⏳</div>
                      <p className="text-gray-400 text-xs">{item.loadingMessage || 'Generating...'}</p>
                    </div>
                  </div>
                ) : item.status === 'error' ? (
                  <div className="w-full max-w-xs bg-red-900/20 rounded-lg mb-3 aspect-video flex items-center justify-center border-2 border-red-600">
                    <div className="text-center">
                      <div className="text-2xl mb-2">❌</div>
                      <p className="text-red-400 text-xs">{item.error || 'Generation failed'}</p>
                    </div>
                  </div>
                ) : item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    className="w-full max-w-xs rounded-lg mb-3"
                    controls
                    preload="metadata"
                  />
                ) : null}

                <p className="text-white text-sm font-medium mb-2 line-clamp-2">
                  {item.prompt}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <span className={`px-2 py-1 rounded text-white ${
                    item.veoModel === 'veo-3.0-generate-preview' 
                      ? 'bg-green-600' 
                      : 'bg-blue-600'
                  }`}>
                    {item.veoModel === 'veo-3.0-generate-preview' ? 'VEO 3' : 'VEO 2'}
                  </span>
                  <span className="bg-gray-600 px-2 py-1 rounded">
                    {item.aspectRatio}
                  </span>
                  <span className="bg-gray-600 px-2 py-1 rounded">
                    {item.resolution}
                  </span>
                  {item.imageUsed && (
                    <span className="bg-indigo-600 px-2 py-1 rounded text-white">
                      📷 Image
                    </span>
                  )}
                  <span className="bg-gray-600 px-2 py-1 rounded">
                    {item.timestamp}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {item.status === 'completed' && item.videoUrl && (
                  <button
                    onClick={() => downloadVideo(item.videoUrl!, item.prompt)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                    title="Download video"
                  >
                    ⬇️ Download
                  </button>
                )}
                <button
                  onClick={() => onDeleteVideo(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                  title="Delete video"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoHistory;