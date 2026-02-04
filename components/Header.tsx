
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        Powered by Gemini 2.5 Flash Image
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
        Magic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Studio</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Upload any photo and use natural language to transform it. 
        Add backgrounds, change styles, or edit specific details with the power of AI.
      </p>
    </header>
  );
};
