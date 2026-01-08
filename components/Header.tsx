import React from 'react';
import { BrainCircuit, Box, Activity, Hexagon, Wallet, Coins } from './Icons';
import { NetworkId, NETWORKS } from '../types';

interface HeaderProps {
  currentNetwork: NetworkId;
  onNetworkChange: (id: NetworkId) => void;
  walletAddress: string | null;
  onConnectWallet: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentNetwork, onNetworkChange, walletAddress, onConnectWallet, onHomeClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0b0e14] text-gray-300">
      <div className="flex items-center h-12 px-4 justify-between">
        <div 
          className="flex items-center space-x-2 sm:space-x-3 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onHomeClick}
        >
          <div className="text-indigo-500">
            <Hexagon className="h-6 w-6 fill-indigo-500/20" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-100">
            Sentia<span className="font-normal text-gray-500 hidden sm:inline">Studio</span>
          </span>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700">
            v1.0.4
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs font-medium min-w-0">
          
          {/* Network Selector */}
          <div className="flex items-center space-x-2 bg-[#161b22] border border-gray-700 rounded-md px-2 py-1 max-w-[140px] sm:max-w-none transition-all">
            <Activity className={`w-3 h-3 shrink-0 ${currentNetwork === 'mainnet' ? 'text-emerald-500' : 'text-yellow-500'}`} />
            <select 
              value={currentNetwork}
              onChange={(e) => onNetworkChange(e.target.value as NetworkId)}
              className="bg-transparent border-none outline-none text-gray-300 cursor-pointer appearance-none pr-4 w-full truncate font-mono sm:font-sans"
            >
              {Object.values(NETWORKS).map(net => (
                <option key={net.id} value={net.id}>{net.name}</option>
              ))}
            </select>
          </div>

          {/* Wallet Connection */}
          {walletAddress ? (
             <div className="flex items-center gap-3">
                 {/* SENT Balance (Protocol Token) */}
                 <div className="hidden lg:flex flex-col items-end mr-2">
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Protocol</div>
                    <div className="text-indigo-400 font-mono leading-none flex items-center gap-1">
                        1,240.50 SENT
                    </div>
                 </div>

                 {/* AMA Balance (Gas Token) */}
                 <div className="hidden sm:flex flex-col items-end border-l border-gray-800 pl-3">
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Gas</div>
                    <div className="text-emerald-400 font-mono leading-none flex items-center gap-1">
                        4.20 AMA
                    </div>
                 </div>

                 <button 
                  className="flex items-center space-x-2 bg-indigo-900/30 border border-indigo-500/50 rounded-md px-3 py-1 text-indigo-300 hover:bg-indigo-900/50 transition-all"
                  onClick={onConnectWallet} 
                 >
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="font-mono">{walletAddress.substring(0, 4)}...{walletAddress.substring(38)}</span>
                 </button>
             </div>
          ) : (
            <button 
              onClick={onConnectWallet}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-3 py-1 transition-all shadow-lg shadow-indigo-900/20"
            >
              <Wallet className="w-3 h-3" />
              <span>Connect</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};