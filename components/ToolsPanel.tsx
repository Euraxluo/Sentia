import React from 'react';
import { AVAILABLE_TOOLS, AgentTool, NovaConfig } from '../types';
import { Package, Plus, Check, Coins, Search, Globe, MessageSquare, TrendingUp, Calculator, ExternalLink } from './Icons';

interface ToolsPanelProps {
  config: NovaConfig;
  onInstall: (tool: AgentTool) => void;
  onUninstall: (toolId: string) => void;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({ config, onInstall, onUninstall }) => {
  
  const getIcon = (id: string) => {
    switch (id) {
      case 'web_search': return <Search className="w-5 h-5 text-blue-400" />;
      case 'twitter_api': return <MessageSquare className="w-5 h-5 text-sky-400" />;
      case 'bloomberg_feed': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'wolfram_alpha': return <Calculator className="w-5 h-5 text-orange-400" />;
      default: return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-l border-gray-800">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between text-sm font-semibold text-white bg-[#161b22]">
        <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-indigo-400" />
            <span>Capability Modules</span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
            <Coins className="w-3 h-3 text-indigo-500" />
            <span>Pay-per-run</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-xs text-gray-400 leading-relaxed bg-[#1f2937]/50 p-3 rounded border border-gray-700/50 mb-4">
            Install capabilities to extend your Agent's reach. <br/>
            <span className="text-indigo-400">Warning:</span> Using these tools consumes <strong>$SENT</strong> during execution.
        </div>

        {AVAILABLE_TOOLS.map((tool) => {
          const isInstalled = config.enabledTools.includes(tool.id);

          return (
            <div 
                key={tool.id} 
                className={`group relative p-4 rounded-xl border transition-all duration-300 ${
                    isInstalled 
                    ? 'bg-[#0d1117] border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'bg-[#161b22] border-gray-800 hover:border-gray-600'
                }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${isInstalled ? 'bg-indigo-900/20' : 'bg-gray-800'}`}>
                      {getIcon(tool.id)}
                   </div>
                   <div>
                      <h4 className={`text-sm font-bold ${isInstalled ? 'text-white' : 'text-gray-300'}`}>{tool.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] font-mono mt-0.5">
                         <span className="text-indigo-400 font-bold">-{tool.costPerRun} SENT</span>
                         <span className="text-gray-600">/ run</span>
                      </div>
                   </div>
                </div>
                <button
                    onClick={() => isInstalled ? onUninstall(tool.id) : onInstall(tool)}
                    className={`p-1.5 rounded-full transition-all ${
                        isInstalled 
                        ? 'bg-indigo-600 text-white hover:bg-red-500/20 hover:text-red-400' 
                        : 'bg-gray-700 text-gray-400 hover:bg-white hover:text-black'
                    }`}
                >
                    {isInstalled ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed h-[36px]">
                  {tool.description}
              </p>

              {isInstalled && (
                  <div className="mt-3 pt-3 border-t border-indigo-900/30 flex items-center gap-2 text-[10px] text-indigo-300 animate-in fade-in">
                      <ExternalLink className="w-3 h-3" />
                      <span>Imports & Snippets Injected</span>
                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
