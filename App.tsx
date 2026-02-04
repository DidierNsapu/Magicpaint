
import React, { useState, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { editImage } from './services/geminiService';
import { ImageState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ImageState>({
    original: null,
    edited: null,
    isProcessing: false,
    error: null
  });
  const [prompt, setPrompt] = useState<string>('ajoute des couleurs vives et un fond foret entre les arbres à coté du rivière pleine des poissons qui nagent.');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setState(prev => ({
          ...prev,
          original: event.target?.result as string,
          edited: null,
          error: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!state.original || !prompt) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      const result = await editImage(state.original, prompt);
      setState(prev => ({
        ...prev,
        edited: result,
        isProcessing: false
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || "Failed to edit image",
        isProcessing: false
      }));
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const reset = () => {
    setState({
      original: null,
      edited: null,
      isProcessing: false,
      error: null
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20">
      <Header />

      <main className="w-full max-w-5xl px-4 space-y-8">
        {!state.original ? (
          <div 
            onClick={triggerUpload}
            className="group relative flex flex-col items-center justify-center w-full aspect-video md:aspect-[21/9] border-2 border-dashed border-slate-300 rounded-3xl bg-white hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex flex-col items-center gap-4 text-slate-500 group-hover:text-indigo-600 transition-colors">
              <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">Select a photo to start</p>
                <p className="text-sm opacity-70">PNG, JPG or WebP (max 10MB)</p>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Original Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs">1</span>
                Original Photo
              </h3>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                <img src={state.original} alt="Original" className="w-full h-full object-cover" />
                <button 
                  onClick={reset}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-rose-500 text-white rounded-lg backdrop-blur-md transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Editing Tools & Result */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
                  Magic Instruction
                </h3>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe how you want to change the photo..."
                  className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700 resize-none"
                />
                <Button 
                  onClick={handleEdit} 
                  isLoading={state.isProcessing}
                  className="w-full mt-4"
                >
                  Apply AI Magic
                </Button>
                {state.error && (
                  <p className="mt-3 text-sm text-rose-500 font-medium bg-rose-50 p-3 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {state.error}
                  </p>
                )}
              </div>

              {state.edited && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">3</span>
                    Magic Result
                  </h3>
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-indigo-200 border-4 border-white bg-slate-200">
                    <img src={state.edited} alt="Edited" className="w-full h-full object-cover" />
                    <a 
                      href={state.edited} 
                      download="gemini-magic.png"
                      className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-indigo-600 p-3 rounded-xl shadow-lg backdrop-blur-sm transition-all flex items-center gap-2 font-bold text-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              )}

              {state.isProcessing && !state.edited && (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 border-dashed animate-pulse">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
                  <p className="text-slate-600 font-medium">Gemini is painting your masterpiece...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Example Chips */}
        {!state.isProcessing && (
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider w-full text-center mb-2">Try these ideas</span>
            {[
              "Add vibrant sunset colors and a forest background",
              "Make it a retro oil painting style",
              "Change the background to a futuristic neon city",
              "Add a cinematic lighting and depth of field",
              "Turn the sky into a starry night with aurora borealis"
            ].map((idea, idx) => (
              <button 
                key={idx}
                onClick={() => setPrompt(idea)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm"
              >
                {idea}
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto pt-20 text-slate-400 text-sm">
        <p>&copy; 2024 Gemini Magic Studio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
