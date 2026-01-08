import React, { useRef, useEffect } from 'react';
import { ExecutionLog } from '../types';
import { Terminal, ArrowRight, BrainCircuit, Activity, AlertCircle, HardDrive, Globe, ShieldCheck, Database, Cpu, ChevronDown, ChevronUp } from './Icons';

interface ConsoleProps {
  logs: ExecutionLog[];
  isSimulating: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export const Console: React.FC<ConsoleProps> = ({ logs, isSimulating, isOpen, onToggle }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'AI_THOUGHT': return <BrainCircuit className="w-3 h-3 text-purple-400" />;
      case 'TRANSACTION': return <Activity className="w-3 h-3 text-emerald-400" />;
      case 'ERROR': return <AlertCircle className="w-3 h-3 text-red-400" />;
      case 'SYSTEM': return <HardDrive className="w-3 h-3 text-blue-400" />;
      case 'NETWORK': return <Globe className="w-3 h-3 text-cyan-400" />;
      case 'VERIFICATION': return <ShieldCheck className="w-3 h-3 text-indigo-400" />;
      case 'STORAGE': return <Database className="w-3 h-3 text-orange-400" />;
      case 'HARDWARE': return <Cpu className="w-3 h-3 text-pink-400" />;
      default: return <ArrowRight className="w-3 h-3 text-gray-600" />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'AI_THOUGHT': return 'text-purple-300 bg-purple-950/20 border-purple-900/40';
      case 'TRANSACTION': return 'text-emerald-300 bg-emerald-950/20 border-emerald-900/40';
      case 'ERROR': return 'text-red-300 bg-red-950/20 border-red-900/40';
      case 'NETWORK': return 'text-cyan-300 bg-cyan-950/20 border-cyan-900/40';
      case 'VERIFICATION': return 'text-indigo-300 bg-indigo-950/20 border-indigo-900/40';
      case 'STORAGE': return 'text-orange-300 bg-orange-950/20 border-orange-900/40';
      case 'HARDWARE': return 'text-pink-300 bg-pink-950/20 border-pink-900/40';
      case 'SYSTEM': return 'text-blue-300';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-t border-gray-800 transition-all duration-300">
      <div 
        onClick={onToggle}
        className="px-4 py-2 border-b border-gray-800 bg-[#161b22] flex items-center justify-between cursor-pointer hover:bg-[#1c2128] transition-colors select-none"
      >
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Terminal className="w-3 h-3" />
          <span className="font-mono">AVM Output Logs</span>
          <span className="bg-gray-800 text-gray-500 px-1.5 rounded-full text-[10px]">{logs.length}</span>
        </div>
        <div className="flex items-center space-x-3">
           <div className="flex space-x-1.5">
             <div className="w-2 h-2 rounded-full bg-[#30363d]"></div>
             <div className="w-2 h-2 rounded-full bg-[#30363d]"></div>
           </div>
           <div className="text-gray-500 hover:text-white">
             {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
           </div>
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-3 terminal-scroll">
          {logs.length === 0 && !isSimulating && (
            <div className="text-gray-600 italic opacity-50">
              > Amadeus VM ready.<br/>
              > Waiting for signed transaction...
            </div>
          )}

          {logs.map((log) => (
            <div key={log.id} className={`flex items-start space-x-3 animate-in fade-in duration-300`}>
              <div className="mt-1 flex-shrink-0 opacity-40 text-[10px] w-14 text-gray-500 text-right">{log.timestamp.split(' ')[0]}</div>
              <div className={`flex-1 p-2 rounded border ${getColor(log.type)}`}>
                 <div className="flex items-center space-x-2 mb-1 opacity-80 border-b border-white/5 pb-1">
                   {getIcon(log.type)}
                   <span className="uppercase font-bold text-[10px] tracking-wider">{log.type}</span>
                   {log.gasUsed && <span className="ml-auto text-[10px] text-gray-500">GAS: {log.gasUsed.toLocaleString()}</span>}
                 </div>
                 <div className="leading-relaxed whitespace-pre-wrap font-mono mt-1">{log.message}</div>
              </div>
            </div>
          ))}
          
          {isSimulating && (
            <div className="flex items-center space-x-2 text-gray-500 animate-pulse pl-16">
              <span className="text-indigo-400">➜</span>
              <span>Verifying proofs & confirming block...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};