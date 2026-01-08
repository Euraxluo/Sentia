import React from 'react';
import { NovaConfig, NOVA_MODELS } from '../types';
import { Settings, Cpu, BrainCircuit, Play, Database, ShieldCheck, Globe, Coins, Lock } from './Icons';

interface NovaPanelProps {
  config: NovaConfig;
  onChange: (config: NovaConfig) => void;
  isSimulating: boolean;
  onRun: () => void;
}

export const NovaPanel: React.FC<NovaPanelProps> = ({ config, onChange, isSimulating, onRun }) => {
  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-l border-gray-800">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center space-x-2 text-sm font-semibold text-white bg-[#161b22]">
        <Settings className="w-4 h-4 text-gray-400" />
        <span>Compute Config (Nova)</span>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Inference Node (Model)</label>
          <div className="relative">
            <select 
              value={config.model}
              onChange={(e) => onChange({ ...config, model: e.target.value })}
              className="w-full bg-[#0b0e14] border border-gray-700 rounded-md p-3 text-xs text-gray-200 font-mono appearance-none focus:border-indigo-500 focus:outline-none"
            >
              {NOVA_MODELS.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <BrainCircuit className="absolute right-3 top-3 w-4 h-4 text-purple-400 pointer-events-none" />
          </div>
          <div className="flex items-center space-x-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-emerald-500 font-mono">NODE ONLINE: nova.ama.one</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
             <label className="font-medium text-gray-400 uppercase tracking-wider">Entropy (Temp)</label>
             <span className="text-indigo-400 font-mono">{config.temperature.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            value={config.temperature}
            onChange={(e) => onChange({ ...config, temperature: parseFloat(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Top K */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
             <label className="font-medium text-gray-400 uppercase tracking-wider">Sampling (Top K)</label>
             <span className="text-indigo-400 font-mono">{config.topK}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            step="1"
            value={config.topK}
            onChange={(e) => onChange({ ...config, topK: parseInt(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* System Prompt */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">System Context (Instruction Set)</label>
          <textarea 
            rows={4}
            className="w-full bg-[#0b0e14] border border-gray-700 rounded-md p-3 text-xs text-gray-300 font-mono focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
            value={config.systemPrompt}
            onChange={(e) => onChange({ ...config, systemPrompt: e.target.value })}
          />
        </div>

        {/* Bonus Challenges Section */}
        <div className="pt-4 border-t border-gray-800 space-y-4">
           <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
             <Settings className="w-3 h-3" />
             Protocol Features
           </div>

            {/* x402 Service Protocol (New Feature) */}
           <div className="flex flex-col gap-2 p-3 bg-[#0b0e14] border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <div className={`p-1.5 rounded ${config.x402Enabled ? 'bg-cyan-900/30 text-cyan-400' : 'bg-gray-800 text-gray-500'}`}>
                        <Globe className="w-4 h-4" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-200">x402 Service Standard</span>
                        <span className="text-[9px] text-gray-500">Public Interface (Paid)</span>
                     </div>
                  </div>
                  <button 
                    onClick={() => onChange({ ...config, x402Enabled: !config.x402Enabled })}
                    className={`w-9 h-5 rounded-full relative transition-colors ${config.x402Enabled ? 'bg-cyan-500' : 'bg-gray-700'}`}
                  >
                     <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.x402Enabled ? 'left-5' : 'left-1'}`}></div>
                  </button>
              </div>
              
              {config.x402Enabled && (
                <div className="mt-2 pt-2 border-t border-gray-700/50 space-y-2 animate-in fade-in">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">Usage Fee (per call)</span>
                      <div className="flex items-center gap-1 bg-[#161b22] px-2 py-0.5 rounded border border-gray-700">
                         <input 
                            type="number" 
                            step="0.1" 
                            className="bg-transparent w-10 text-right text-white font-mono focus:outline-none"
                            value={config.x402ServiceFee}
                            onChange={(e) => onChange({ ...config, x402ServiceFee: parseFloat(e.target.value) })}
                         />
                         <span className="text-indigo-400 font-bold">SENT</span>
                      </div>
                   </div>
                   <p className="text-[9px] text-cyan-500/80 leading-snug">
                      Your agent will be listed in the x402 Registry. Other agents can call it for {config.x402ServiceFee} SENT.
                   </p>
                </div>
              )}
           </div>

           {/* Arweave Toggle */}
           <div className="flex flex-col gap-2 p-3 bg-[#0b0e14] border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <div className={`p-1.5 rounded ${config.useArweave ? 'bg-orange-900/30 text-orange-400' : 'bg-gray-800 text-gray-500'}`}>
                        <Database className="w-4 h-4" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-200">Immutable Provenance</span>
                        <span className="text-[9px] text-gray-500">Store logs on Arweave</span>
                     </div>
                  </div>
                  <button 
                    onClick={() => onChange({ ...config, useArweave: !config.useArweave })}
                    className={`w-9 h-5 rounded-full relative transition-colors ${config.useArweave ? 'bg-orange-500' : 'bg-gray-700'}`}
                  >
                     <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.useArweave ? 'left-5' : 'left-1'}`}></div>
                  </button>
              </div>
           </div>

           {/* Privacy Toggle */}
           <div className="flex items-center justify-between p-3 bg-[#0b0e14] border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                 <div className={`p-1.5 rounded ${config.usePrivacy ? 'bg-indigo-900/30 text-indigo-400' : 'bg-gray-800 text-gray-500'}`}>
                    <ShieldCheck className="w-4 h-4" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-200">Verifiable Compute</span>
                    <span className="text-[9px] text-gray-500">TEE + ZK Proofs</span>
                 </div>
              </div>
              <button 
                onClick={() => onChange({ ...config, usePrivacy: !config.usePrivacy })}
                className={`w-9 h-5 rounded-full relative transition-colors ${config.usePrivacy ? 'bg-indigo-500' : 'bg-gray-700'}`}
              >
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.usePrivacy ? 'left-5' : 'left-1'}`}></div>
              </button>
           </div>
        </div>

      </div>

      <div className="p-4 border-t border-gray-800 bg-[#161b22]">
        <button
          onClick={onRun}
          disabled={isSimulating}
          className={`w-full py-3 px-4 rounded-md font-bold text-white text-sm flex items-center justify-center space-x-2 transition-all ${
            isSimulating 
            ? 'bg-gray-700 cursor-not-allowed opacity-75' 
            : 'bg-purple-700 hover:bg-purple-600 shadow-lg shadow-purple-900/20'
          }`}
        >
          {isSimulating ? (
            <>
              <Cpu className="w-4 h-4 animate-spin" />
              <span>Invoking Nova...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Test Inference</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};