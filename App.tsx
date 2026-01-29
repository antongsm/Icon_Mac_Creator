import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { IconCard } from './components/IconCard';
import { generateIconImage } from './services/gemini';
import { GeneratedIcon, IconGenerationConfig, GenerationStatus } from './types';

// Initial prompt based on user request
const INITIAL_PROMPT = "Smart Analyzer. A macOS application that processes long texts to find logical and semantic concepts. It fully analyzes text and extracts key ideas. Visuals: Abstract nodes, data flow, magnifying glass, intelligent analysis.";

const App: React.FC = () => {
  const [config, setConfig] = useState<IconGenerationConfig>({
    prompt: INITIAL_PROMPT,
    style: 'Default'
  });
  
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setIcons([]); // Clear previous results

    try {
      // We generate two icons concurrently with slightly different style prompts to ensure variety
      const prompt1 = config.prompt;
      const prompt2 = config.prompt;

      const results = await Promise.all([
        generateIconImage(prompt1, "Hyper-realistic, glossy 3D glassmorphism, blue and purple neon accents"),
        generateIconImage(prompt2, "Clean minimalist, metallic texture, abstract geometric shapes, orange and teal accents")
      ]);

      const newIcons: GeneratedIcon[] = [
        {
          id: crypto.randomUUID(),
          url: results[0],
          prompt: "Variation 1: Glossy 3D"
        },
        {
          id: crypto.randomUUID(),
          url: results[1],
          prompt: "Variation 2: Minimalist Geometric"
        }
      ];

      setIcons(newIcons);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(GenerationStatus.ERROR);
      setError(err.message || "Failed to generate icons. Please check your API key and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Smart Analyzer
              </h1>
              <p className="text-xs text-gray-400">Icon Generator Studio</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-medium border border-blue-800/50">
              Powered by Gemini 2.5
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
        
        <div className="text-center mb-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Create icons for <span className="text-blue-400">Smart Analyzer</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Generate professional, macOS-style application icons using AI. 
            Tailored for text analysis and semantic concepts.
          </p>
        </div>

        <InputForm 
          config={config} 
          status={status} 
          onChange={setConfig} 
          onSubmit={handleGenerate} 
        />

        {/* Error Message */}
        {status === GenerationStatus.ERROR && (
          <div className="mt-8 w-full max-w-2xl bg-red-900/20 border border-red-800 text-red-200 px-6 py-4 rounded-xl flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {status === GenerationStatus.LOADING && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-full max-w-3xl">
             {[1, 2].map(i => (
               <div key={i} className="bg-gray-800 rounded-xl p-4 h-[350px] border border-gray-700 animate-pulse flex flex-col items-center justify-center">
                 <div className="w-64 h-64 bg-gray-700 rounded-2xl mb-4"></div>
                 <div className="h-4 w-32 bg-gray-700 rounded"></div>
               </div>
             ))}
           </div>
        )}

        {/* Results */}
        {icons.length > 0 && (
          <div className="mt-16 w-full max-w-4xl">
             <div className="flex items-center gap-4 mb-8">
               <div className="h-px flex-1 bg-gray-700"></div>
               <h3 className="text-xl font-semibold text-gray-300">Generated Variations</h3>
               <div className="h-px flex-1 bg-gray-700"></div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
               {icons.map((icon) => (
                 <IconCard key={icon.id} icon={icon} />
               ))}
             </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 mt-auto bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Smart Analyzer Tools. Generated using Google Gemini API.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;