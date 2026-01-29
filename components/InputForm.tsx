import React from 'react';
import { IconGenerationConfig, GenerationStatus } from '../types';

interface InputFormProps {
  config: IconGenerationConfig;
  status: GenerationStatus;
  onChange: (config: IconGenerationConfig) => void;
  onSubmit: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ config, status, onChange, onSubmit }) => {
  const isGenerating = status === GenerationStatus.LOADING;

  return (
    <div className="w-full max-w-2xl bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          App Description
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Describe your application..."
          value={config.prompt}
          onChange={(e) => onChange({ ...config, prompt: e.target.value })}
          disabled={isGenerating}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Generating 2 variations automatically.
        </div>
        <button
          onClick={onSubmit}
          disabled={isGenerating || !config.prompt.trim()}
          className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all transform active:scale-95 flex items-center gap-2
            ${isGenerating || !config.prompt.trim() 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20 shadow-lg'}`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
              Generate Icons
            </>
          )}
        </button>
      </div>
    </div>
  );
};