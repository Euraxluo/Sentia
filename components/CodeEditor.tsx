import React, { useState, useRef } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { generateContractCode } from '../services/geminiService';

// Access global Prism instance loaded via script tag in index.html
declare const Prism: any;

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  const [showAi, setShowAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const generatedCode = await generateContractCode(aiPrompt);
      onChange(generatedCode);
      setShowAi(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const highlight = (code: string) => {
    if (typeof Prism !== 'undefined' && Prism.languages.typescript) {
      return Prism.highlight(code, Prism.languages.typescript, 'typescript');
    }
    // Fallback if Prism isn't loaded yet
    return code; 
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0d1117]">
      {/* Header Bar */}
      <div className="flex-none flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800 text-xs text-gray-400 select-none z-20">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400">contract.ts</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-500">AssemblyScript</span>
        </div>
        
        <button 
          onClick={() => setShowAi(!showAi)}
          className={`flex items-center space-x-1 transition-colors ${showAi ? 'text-white' : 'text-indigo-400 hover:text-indigo-300'}`}
        >
          <Sparkles className="w-3 h-3" />
          <span>AI Assistant</span>
        </button>
      </div>
      
      {/* AI Prompt Overlay */}
      {showAi && (
        <div className="absolute top-10 left-4 right-4 z-30 bg-[#1f242c] border border-indigo-500/50 rounded-lg shadow-2xl p-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-indigo-400" /> 
              Generate Logic
            </span>
            <button onClick={() => setShowAi(false)} className="text-gray-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Describe the contract logic..."
              className="flex-1 bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 placeholder-gray-600 font-mono"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              autoFocus
            />
            <button 
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded text-xs font-bold flex items-center min-w-[32px] justify-center"
            >
              {isGenerating ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send className="w-3 h-3" />}
            </button>
          </div>
        </div>
      )}

      {/* Editor Container with Scroll Handling */}
      <div className="flex-1 relative overflow-auto bg-[#0d1117] flex font-mono">
        
        {/* Sticky Line Numbers */}
        <div 
            className="flex-shrink-0 w-12 bg-[#0d1117] border-r border-gray-800 text-right pr-3 pt-4 text-gray-600 select-none z-10 sticky left-0 min-h-full"
            style={{ 
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '14px',
              lineHeight: '24px',
            }}
        >
          {Array.from({ length: Math.max(code.split('\n').length, 50) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 min-w-0">
            <Editor
            value={code}
            onValueChange={onChange}
            highlight={highlight}
            padding={16}
            className="font-mono text-sm"
            style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 14,
                lineHeight: '24px',
                backgroundColor: 'transparent',
                minHeight: '100%',
            }}
            textareaClassName="focus:outline-none"
            />
        </div>
      </div>
    </div>
  );
};