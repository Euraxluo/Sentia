import React, { useState, useEffect, useMemo } from 'react';
import { RotateCw, Activity, Play, Box, Download, FileCode, CheckCircle2, Wallet, Lock, Search, Rocket, Zap, Terminal, Percent, Coins, TrendingUp, GitFork, AlertCircle, Layers, Trophy, Users, PieChart, Globe } from './Icons';
import { NetworkId, NETWORKS, LogType, NovaConfig, PROTOCOL_CONSTANTS } from '../types';

interface DeployPanelProps {
  code: string;
  networkId: NetworkId;
  onDeploy: (address: string) => void;
  onInteract: () => void;
  onLog: (msg: string, type: LogType) => void;
  isSimulating: boolean;
  config?: NovaConfig;
  onConfigChange?: (config: NovaConfig) => void;
  walletAddress: string | null;
  onConnectWallet: () => void;
}

interface ContractFunction {
  name: string;
  args: { name: string; type: string }[];
}

export const DeployPanel: React.FC<DeployPanelProps> = ({ code, networkId, onDeploy, onInteract, onLog, isSimulating, config, onConfigChange, walletAddress, onConnectWallet }) => {
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [compiledBytecode, setCompiledBytecode] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  
  // Interaction State
  const [selectedFunc, setSelectedFunc] = useState<string>('');
  const [funcArgs, setFuncArgs] = useState<Record<string, string>>({});

  const exportedFunctions = useMemo(() => {
    const regex = /export\s+function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g;
    const functions: ContractFunction[] = [];
    let match;
    
    while ((match = regex.exec(code)) !== null) {
      const funcName = match[1];
      const argsStr = match[2].trim();
      const args: { name: string; type: string }[] = [];
      
      if (argsStr) {
        argsStr.split(',').forEach(arg => {
          const [name, type] = arg.split(':').map(s => s.trim());
          if (name) args.push({ name, type: type || 'any' });
        });
      }
      functions.push({ name: funcName, args });
    }
    
    if (functions.length === 0) return [{ name: 'run', args: [] }];
    return functions;
  }, [code]);

  useEffect(() => {
    if (exportedFunctions.length > 0) {
      setSelectedFunc(exportedFunctions[0].name);
      setFuncArgs({});
    }
  }, [exportedFunctions]);

  // Economic State
  const isForking = !!config?.upstreamAgentId;
  const isX402 = !!config?.x402Enabled;

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompiledBytecode(null);
    onLog("Initializing asc (AssemblyScript Compiler) v0.19.23...", "SYSTEM");
    setTimeout(() => onLog("> asc contract.ts --target release", "BUILD"), 400);
    setTimeout(() => onLog("Optimizing WASM (Binaryen -O3)...", "BUILD"), 1200);
    setTimeout(() => {
      setIsCompiling(false);
      // Robust regex check for export function
      const hasExport = /export\s+function\s+/.test(code);
      
      if (hasExport) {
        const mockBytecode = "0061736d0100000001070160027f7f017f030201000707010372756e00000a09010700200020016a0b"; 
        setCompiledBytecode(mockBytecode);
        onLog("Compilation Successful. Artifact: build/release.wasm", "SYSTEM");
      } else {
        onLog("Compiler Error: Entry point not found. Ensure at least one 'export function' exists.", "ERROR");
      }
    }, 2000);
  };

  const handleDownloadWasm = () => {
    if (!compiledBytecode) return;
    const element = document.createElement("a");
    const file = new Blob([compiledBytecode], {type: 'application/wasm'});
    element.href = URL.createObjectURL(file);
    element.download = "amadeus_contract.wasm";
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
    onLog("Artifact exported: amadeus_contract.wasm", "SYSTEM");
  };

  const handleDeploy = async () => {
    if (!compiledBytecode) return;
    setIsDeploying(true);

    onLog(`Connecting to ${NETWORKS[networkId].rpc}...`, "SYSTEM");
    onLog(`Preparing Deployment Transaction...`, "SYSTEM");
    
    // Economic Logging
    if (isForking) {
        onLog(`TYPE: Validator (Fork) Deployment`, "VERIFICATION");
        onLog(`Action: Registering Node in Swarm ${config?.upstreamAgentId}`, "NETWORK");
        onLog(`Incentive Model: Eligible for split of $SENT Reward Pool`, "SYSTEM");
    } else {
        onLog(`TYPE: Genesis Deployment (New Architecture)`, "VERIFICATION");
        onLog(`Action: Registering new Agent Template`, "NETWORK");
        onLog(`Right Created: 2.5% of Future $SENT Allocation`, "SYSTEM");
        
        // x402 Registration Log
        if (isX402) {
            await new Promise(r => setTimeout(r, 600));
            onLog(`x402: Service Interface Detected`, "x402");
            onLog(`x402: Registering in Public Directory...`, "x402");
            onLog(`x402: Fee Set to ${config?.x402ServiceFee} SENT per call`, "x402");
        }
    }
    
    await new Promise(r => setTimeout(r, 1200));
    onLog(`Gas Fee: 0.0042 AMA`, "TRANSACTION");
    
    setTimeout(() => onLog(`Requesting Signature from ${walletAddress?.substring(0,8)}...`, "SYSTEM"), 500);
    setTimeout(() => onLog(`Signature valid. Broadcasting...`, "TRANSACTION"), 1500);

    setTimeout(() => {
      setIsDeploying(false);
      const mockAddress = "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setContractAddress(mockAddress);
      onDeploy(mockAddress);
      onLog(`Transaction Confirmed in Block #14203922`, "SYSTEM");
      onLog(`Contract deployed at ${mockAddress}`, "SYSTEM");
    }, 2500);
  };

  const handleInteract = () => {
    if (!walletAddress) {
        onLog("Error: Wallet not connected. Cannot sign transaction.", "ERROR");
        return;
    }
    const currentFunc = exportedFunctions.find(f => f.name === selectedFunc);
    const argsString = currentFunc?.args.map(arg => `${arg.name}: ${funcArgs[arg.name] || 'null'}`).join(', ');
    onLog(`Preparing transaction: ${selectedFunc}(${argsString || ''})`, "SYSTEM");
    onLog(`Requesting Signature from ${walletAddress.substring(0,8)}...`, "SYSTEM");
    setTimeout(() => {
        onLog(`Signature confirmed. Sending to mempool...`, "TRANSACTION");
        onInteract();
    }, 1000);
  };

  const currentFunctionDef = exportedFunctions.find(f => f.name === selectedFunc);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-l border-gray-800 font-sans">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center space-x-2 text-sm font-semibold text-white bg-[#161b22]">
        <Box className="w-4 h-4 text-indigo-400" />
        <span>Deploy & Activate</span>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        
        {/* Wallet Connection */}
        <div className="space-y-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Wallet</div>
            {!walletAddress ? (
                <button 
                  onClick={onConnectWallet}
                  className="w-full py-2 border border-dashed border-gray-600 rounded text-xs text-gray-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-900/10 transition-all flex items-center justify-center space-x-2"
                >
                    <Wallet className="w-3 h-3" />
                    <span>Connect Wallet</span>
                </button>
            ) : (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-lg flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                        <span className="text-xs text-emerald-400 font-mono">{walletAddress.substring(0,6)}...{walletAddress.substring(38)}</span>
                    </div>
                    <Lock className="w-3 h-3 text-emerald-600" />
                </div>
            )}
        </div>

        {/* Build Section */}
        <div className="space-y-3 border-t border-gray-800 pt-4">
           <div className="flex justify-between items-center">
             <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">1. Compiler</h3>
             {compiledBytecode && (
               <button 
                 onClick={handleDownloadWasm}
                 className="flex items-center space-x-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
               >
                 <Download className="w-3 h-3" />
                 <span>Artifacts</span>
               </button>
             )}
           </div>
           
           <button 
             onClick={handleCompile}
             disabled={isCompiling || isDeploying}
             className="w-full flex items-center justify-center space-x-2 py-2 bg-[#21262d] hover:bg-[#30363d] border border-gray-700 rounded text-xs text-white transition-all disabled:opacity-50 font-medium"
           >
             <RotateCw className={`w-3 h-3 ${isCompiling ? 'animate-spin' : ''}`} />
             <span>{isCompiling ? 'Compiling...' : (compiledBytecode ? 'Rebuild' : 'Compile Contract')}</span>
           </button>
           
           {compiledBytecode && (
             <div className="text-[10px] text-emerald-400 flex items-center gap-2 bg-emerald-950/30 p-2 rounded border border-emerald-900/50">
               <CheckCircle2 className="w-3 h-3" /> 
               <span className="truncate flex-1 font-mono">build/release.wasm</span>
               <span className="text-gray-500">14.2 KB</span>
             </div>
           )}
        </div>

        {/* ECONOMIC CONFIG SECTION */}
        {compiledBytecode && (
        <div className="space-y-3 border-t border-gray-800 pt-4 animate-in fade-in slide-in-from-top-1">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                <PieChart className="w-3 h-3 text-yellow-500" />
                2. Swarm Economics
            </h3>

            {isForking ? (
                // VIEW FOR FORKERS: Validator Role
                <div className="bg-[#161b22] border border-gray-700 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Action:</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <GitFork className="w-3 h-3" /> Join Swarm
                        </span>
                    </div>

                    <div className="space-y-2 text-[10px]">
                         <p className="text-gray-400 leading-relaxed">
                            You are deploying a fork of an existing agent. If this Swarm is active (100+ forks), you will earn a share of the <strong className="text-indigo-400">$SENT</strong> Incentive Pool.
                         </p>
                         <div className="flex justify-between items-center pt-2">
                             <span className="text-gray-500">Incentive Share</span>
                             <span className="text-white font-mono font-bold">97.5% (Split by all forkers)</span>
                         </div>
                    </div>
                </div>
            ) : (
                // VIEW FOR CREATORS: Genesis Role
                <div className="bg-[#161b22] border border-gray-700 rounded-lg p-3 space-y-4">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Action:</span>
                        <span className="font-bold text-purple-400 flex items-center gap-1">
                            <Rocket className="w-3 h-3" /> Genesis Deploy
                        </span>
                    </div>

                    <div className="space-y-3">
                         <p className="text-[10px] text-gray-400 leading-relaxed">
                            You are the architect. You will receive <span className="text-purple-400 font-bold">2.5%</span> of the <strong className="text-indigo-400">$SENT</strong> Incentives allocated to this agent's ecosystem.
                         </p>
                        
                        {isX402 && (
                             <div className="flex items-start gap-2 p-2 bg-cyan-900/10 border border-cyan-500/20 rounded">
                                <Globe className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                                <div className="text-[10px] text-cyan-300">
                                    <strong>x402 Service Active:</strong> Charging {config?.x402ServiceFee} SENT per call.
                                </div>
                             </div>
                        )}
                        
                        <div className="flex items-start gap-2 p-2 bg-indigo-900/10 border border-indigo-500/20 rounded">
                           <TrendingUp className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                           <div className="text-[10px] text-indigo-300">
                              <strong>Growth:</strong> More forks = Higher weight in the 5% TVL Pool.
                           </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        )}

        {/* Deploy Section */}
        {compiledBytecode && (
          <div className="space-y-3 border-t border-gray-800 pt-4 animate-in fade-in slide-in-from-top-1">
            <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">3. Execution</h3>
            </div>

            <div className="bg-[#161b22] p-3 rounded border border-gray-700">
               <div className="flex justify-between items-center mb-1 text-[10px] text-gray-400">
                  <span>Network</span>
                  <span className="text-white font-medium">{NETWORKS[networkId].name}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-700/50 pt-1 mt-1">
                  <span>Deployment Fee</span>
                  <span className="text-white font-medium font-mono">
                    0.0042 AMA (Gas)
                  </span>
               </div>
            </div>
            
            <button 
              onClick={handleDeploy}
              disabled={isDeploying || !!contractAddress || !walletAddress}
              className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded text-xs text-white font-bold transition-all shadow-lg ${
                contractAddress 
                ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700' 
                : (!walletAddress ? 'bg-gray-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20')
              }`}
            >
              {isDeploying ? (
                 <Rocket className="w-3 h-3 animate-pulse" />
              ) : (
                 <Zap className="w-3 h-3" />
              )}
              <span>
                {contractAddress 
                    ? 'Deployed & Active' 
                    : (isDeploying ? 'Processing...' : (isForking ? 'Join Swarm (Fork)' : 'Deploy Genesis Agent'))
                }
              </span>
            </button>
            
            {contractAddress && (
              <div className="bg-[#0b0e14] p-2 rounded border border-gray-700 mt-2">
                <div className="flex justify-between items-center mb-1">
                    <div className="text-[10px] text-gray-500 uppercase">Contract Address</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" /> Active
                    </div>
                </div>
                <div className="font-mono text-xs text-indigo-300 break-all select-all cursor-text">{contractAddress}</div>
              </div>
            )}
          </div>
        )}

        {/* Interact Section */}
        {contractAddress && (
           <div className="space-y-3 border-t border-gray-800 pt-4 animate-in fade-in slide-in-from-top-1">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">4. Interact</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400">Method</label>
                <div className="relative">
                  <select 
                    value={selectedFunc}
                    onChange={(e) => setSelectedFunc(e.target.value)}
                    className="w-full bg-[#161b22] border border-gray-700 rounded p-2 text-xs text-white appearance-none focus:border-indigo-500 focus:outline-none font-mono"
                  >
                    {exportedFunctions.map(f => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-2.5 pointer-events-none text-gray-500">
                    <FileCode className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {currentFunctionDef && currentFunctionDef.args.length > 0 && (
                <div className="space-y-2 p-2 bg-[#0b0e14] rounded border border-gray-700">
                  {currentFunctionDef.args.map((arg) => (
                    <div key={arg.name} className="flex flex-col space-y-1">
                      <label className="text-[10px] text-gray-500 font-mono">{arg.name} <span className="text-gray-600">({arg.type})</span></label>
                      <input 
                        type="text" 
                        placeholder={`value`}
                        value={funcArgs[arg.name] || ''}
                        onChange={(e) => setFuncArgs(prev => ({...prev, [arg.name]: e.target.value}))}
                        className="w-full bg-[#161b22] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleInteract}
                disabled={isSimulating || !walletAddress}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded text-xs font-bold text-white shadow-lg mt-2 ${
                    !walletAddress ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-emerald-700 hover:bg-emerald-600 shadow-emerald-900/20'
                }`}
              >
                {isSimulating ? (
                  <Activity className="w-3 h-3 animate-pulse" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                <span>Write Transaction</span>
              </button>
           </div>
        )}

      </div>
    </div>
  );
};