import React from 'react';
import { GeneratedIcon } from '../types';

interface IconCardProps {
  icon: GeneratedIcon;
}

export const IconCard: React.FC<IconCardProps> = ({ icon }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = icon.url;
    link.download = `smart-analyzer-icon-${icon.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700 flex flex-col items-center animate-fade-in-up">
      <div className="relative group w-64 h-64 mb-4 bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-600">
        <div className="absolute inset-0 bg-checkboard opacity-10"></div>
        {/* We use a mask to simulate macOS squircle if needed, but usually we just show the full image */}
        <img 
          src={icon.url} 
          alt={icon.prompt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
           {/* Overlay content if needed */}
        </div>
      </div>
      
      <div className="w-full flex justify-between items-center px-2">
        <span className="text-xs text-gray-400 font-mono">ID: {icon.id.slice(0, 8)}</span>
        <button 
          onClick={handleDownload}
          className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};