import React, { useState } from 'react';
import { GeneratedIcon } from '../types';
import { generateIcns } from '../utils/icnsGenerator';

interface IconCardProps {
  icon: GeneratedIcon;
}

export const IconCard: React.FC<IconCardProps> = ({ icon }) => {
  const [isConverting, setIsConverting] = useState(false);

  const handleDownloadPng = () => {
    const link = document.createElement('a');
    link.href = icon.url;
    link.download = `smart-analyzer-icon-${icon.id.slice(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadIcns = async () => {
    setIsConverting(true);
    try {
      const blob = await generateIcns(icon.url);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `smart-analyzer-icon-${icon.id.slice(0, 8)}.icns`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to generate ICNS", e);
      alert("Failed to convert to ICNS format.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700 flex flex-col items-center animate-fade-in-up w-full max-w-sm">
      <div className="relative group w-full aspect-square mb-4 bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-600">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <img 
          src={icon.url} 
          alt={icon.prompt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 pointer-events-none"></div>
      </div>
      
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-gray-400 font-mono mb-2">
           <span>ID: {icon.id.slice(0, 8)}</span>
           <span className="bg-gray-700 px-2 py-0.5 rounded text-gray-300">{icon.prompt.includes("Glassmorphism") ? "3D Glossy" : "Minimalist"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleDownloadPng}
            className="text-sm bg-gray-700 hover:bg-gray-600 hover:text-white text-gray-200 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            PNG
          </button>
          
          <button 
            onClick={handleDownloadIcns}
            disabled={isConverting}
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConverting ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            )}
            {isConverting ? '...' : '.ICNS'}
          </button>
        </div>
      </div>
    </div>
  );
};