import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { NovaPanel } from './components/NovaPanel';
import { ToolsPanel } from './components/ToolsPanel'; // Import ToolsPanel
import { Console } from './components/Console';
import { DeployPanel } from './components/DeployPanel';
import { AgentMarketplace } from './components/AgentMarketplace';
import { TokenomicsPanel } from './components/TokenomicsPanel';
import { LandingPage } from './components/LandingPage';
import { Whitepaper } from './components/Whitepaper'; // Import Whitepaper
import { DEFAULT_CONTRACT_CODE, DEFAULT_NOVA_CONFIG, NovaConfig, ExecutionLog, NetworkId, LogType, AgentTemplate, TokenomicsData, AgentTool } from './types';
import { simulateContract, generateContractCode } from './services/geminiService';
import { FileCode, Play, Settings as SettingsIcon, Box, Code2, Layers, Cpu, Database, Coins, Package, BookOpen } from './components/Icons';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [showWhitepaper, setShowWhitepaper] = useState(false); // Whitepaper state
  
  // Core Data State
  const [code, setCode] = useState(DEFAULT_CONTRACT_CODE);
  const [config, setConfig] = useState<NovaConfig>(DEFAULT_NOVA_CONFIG);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [network, setNetwork] = useState<NetworkId>('testnet');
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  
  // Global Wallet State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Economy State (Mock Data)
  const [tokenomicsData] = useState<TokenomicsData>({
    amaBalance: 145.20,
    sentBalance: 1240.50,
    stakedAma: 8500.00,
    sentRewards: 342.12,
    activeForks: 42,
    dailyRevenue: [
      { day: 'Mon', staking: 120, market: 45 },
      { day: 'Tue', staking: 132, market: 52 },
      { day: 'Wed', staking: 101, market: 48 },
      { day: 'Thu', staking: 184, market: 90 },
      { day: 'Fri', staking: 240, market: 110 },
      { day: 'Sat', staking: 210, market: 95 },
      { day: 'Sun', staking: 295, market: 130 },
    ],
    topAgents: [
      { id: '1', name: 'Liquid Velocity', creator: 'satoshi', weight: 2480, marketShare: 45.2, users: 1240 },
      { id: '2', name: 'DAO Sentinel', creator: 'vitalik', weight: 850, marketShare: 15.5, users: 850 },
      { id: '3', name: 'Curator AI', creator: 'punk6529', weight: 384, marketShare: 7.0, users: 320 },
      { id: '4', name: 'Tensor Kernel', creator: 'jim_k', weight: 225, marketShare: 4.1, users: 45 },
    ]
  });

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  
  // UI Navigation State
  const [activeView, setActiveView] = useState<'marketplace' | 'studio' | 'economy'>('marketplace');
  const [studioTab, setStudioTab] = useState<'code' | 'tools' | 'nova' | 'deploy'>('code'); // Added 'tools'
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const addLog = (message: string, type: LogType, gasUsed?: number) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      gasUsed
    }]);
  };

  const handleConnectWallet = () => {
    if (walletAddress) return;
    const addr = "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setWalletAddress(addr);
    addLog(`Wallet connected: ${addr.substring(0,6)}...${addr.substring(38)}`, "SYSTEM");
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setIsConsoleOpen(true);
    setLogs([]);
    addLog('Initializing Runtime Environment...', 'SYSTEM');

    try {
      const result = await simulateContract(code, config, network);
      for (const log of result.logs) {
        await new Promise(r => setTimeout(r, 800));
        addLog(log.message, log.type as LogType, log.gasUsed);
      }
      addLog(`Transaction Complete. Final State: ${result.finalState}. Total Gas: ${result.totalGas}`, 'SYSTEM');
    } catch (e) {
      console.error(e);
      addLog('Runtime Error: ' + (e as Error).message, 'ERROR');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDeployLog = (msg: string, type: LogType) => {
    addLog(msg, type);
    if (type === 'ERROR' || type === 'TRANSACTION') setIsConsoleOpen(true);
  };

  const handleDeploySuccess = (address: string) => {
    setDeployedAddress(address);
    addLog(`Contract deployed to ${address}`, 'SYSTEM');
  };

  // Tool Installation Logic (Code Injection)
  const handleInstallTool = (tool: AgentTool) => {
     if (config.enabledTools.includes(tool.id)) return;
     
     // Update Config
     setConfig(prev => ({...prev, enabledTools: [...prev.enabledTools, tool.id]}));
     
     // Inject Code
     let newCode = code;
     
     // 1. Inject Import (avoid duplicates)
     if (!newCode.includes(tool.importSnippet)) {
         newCode = tool.importSnippet + "\n" + newCode;
     }

     // 2. Inject Usage Example inside function
     // Try to find the start of the `run` function to inject helpful comments
     const runFuncRegex = /export\s+function\s+run\s*\([^)]*\)\s*:\s*void\s*\{/;
     const match = newCode.match(runFuncRegex);
     
     if (match) {
         const insertIndex = match.index! + match[0].length;
         const indent = "\n  ";
         const snippet = indent + tool.usageSnippet;
         newCode = newCode.slice(0, insertIndex) + snippet + newCode.slice(insertIndex);
     } else {
         // Fallback: Append to end if structure is weird
         newCode += "\n" + tool.usageSnippet;
     }

     setCode(newCode);
     addLog(`Module Installed: ${tool.name}`, "BUILD");
     setStudioTab('code'); // Switch back to code so they see the change
  };

  const handleUninstallTool = (toolId: string) => {
    setConfig(prev => ({...prev, enabledTools: prev.enabledTools.filter(t => t !== toolId)}));
    addLog(`Module Uninstalled: ${toolId}`, "BUILD");
  };

  const handleSelectAgent = async (agent: AgentTemplate) => {
    setActiveView('studio');
    setStudioTab('code'); // Reset to code view
    addLog(`Forking template: ${agent.name} (ID: ${agent.id})...`, 'SYSTEM');
    
    // Inject Economic Data into Config so DeployPanel can read it
    setConfig({
      ...config,
      model: agent.model,
      systemPrompt: `You are an autonomous agent specialized in ${agent.category}. ${agent.description}`,
      useArweave: agent.difficulty === 'Advanced',
      usePrivacy: agent.category === 'DeFi',
      upstreamAgentId: agent.id, // Link the upstream ID
      upstreamRoyaltyRate: agent.royaltyRate, // The fee I must pay
      upstreamYieldBoost: agent.yieldBoost // The reward I get
    });

    try {
      addLog(`Generating ${agent.category} logic via Gemini...`, 'BUILD');
      const prompt = `Create a complex AssemblyScript smart contract for an AI Agent.
      Name: ${agent.name}
      Type: ${agent.category}
      Description: ${agent.description}
      Requirements:
      - Use 'Nova.inference' to make decisions.
      - Use 'Storage' to save state.
      - If DeFi, calculate potential profit.
      - If Governance, analyze proposal text.
      `;
      const generatedCode = await generateContractCode(prompt);
      setCode(generatedCode);
      addLog(`Template Forked Successfully. Economics: ${agent.royaltyRate}% Royalty, ${agent.yieldBoost}x Yield.`, 'SYSTEM');
    } catch (e) {
      addLog('Failed to generate template code', 'ERROR');
    }
  };

  const handleEnterApp = (view: 'marketplace' | 'studio' | 'economy' = 'marketplace') => {
    setActiveView(view);
    setShowLanding(false);
    setShowWhitepaper(false); // Ensure whitepaper is closed when entering the app
  };
  
  return (
    <>
      {/* Whitepaper Overlay - Rendered globally to support Landing Page access */}
      {showWhitepaper && <Whitepaper onClose={() => setShowWhitepaper(false)} />}

      {showLanding ? (
        <LandingPage onEnterApp={handleEnterApp} onOpenWhitepaper={() => setShowWhitepaper(true)} />
      ) : (
        <div className="h-[100dvh] w-screen flex flex-col bg-[#030712] overflow-hidden text-gray-300 animate-in fade-in duration-700 font-sans relative">
          
          <Header 
            currentNetwork={network} 
            onNetworkChange={setNetwork} 
            walletAddress={walletAddress}
            onConnectWallet={handleConnectWallet}
            onHomeClick={() => setShowLanding(true)}
          />
          
          <main className="flex-1 flex overflow-hidden">
            
            {/* Sidebar (Main Navigation) */}
            <div className="w-16 md:w-64 flex-shrink-0 flex flex-col bg-[#0d1117] border-r border-gray-800 transition-all duration-300 z-20">
              <div className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:block">
                Platform
              </div>
              <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
                <button 
                  onClick={() => setActiveView('marketplace')}
                  className={`w-full flex items-center justify-center md:justify-start space-x-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${activeView === 'marketplace' ? 'bg-indigo-900/20 text-white shadow-lg shadow-indigo-900/10 border border-indigo-500/30' : 'text-gray-400 hover:bg-[#161b22] hover:text-gray-200'}`}
                >
                  <Box className={`w-5 h-5 shrink-0 ${activeView === 'marketplace' ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span className="text-sm font-medium hidden md:inline">Marketplace</span>
                </button>

                <button 
                  onClick={() => setActiveView('studio')}
                  className={`w-full flex items-center justify-center md:justify-start space-x-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${activeView === 'studio' ? 'bg-purple-900/20 text-white shadow-lg shadow-purple-900/10 border border-purple-500/30' : 'text-gray-400 hover:bg-[#161b22] hover:text-gray-200'}`}
                >
                  <Code2 className={`w-5 h-5 shrink-0 ${activeView === 'studio' ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span className="text-sm font-medium hidden md:inline">Agent Studio</span>
                </button>

                <button 
                  onClick={() => setActiveView('economy')}
                  className={`w-full flex items-center justify-center md:justify-start space-x-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${activeView === 'economy' ? 'bg-emerald-900/20 text-white shadow-lg shadow-emerald-900/10 border border-emerald-500/30' : 'text-gray-400 hover:bg-[#161b22] hover:text-gray-200'}`}
                >
                  <Coins className={`w-5 h-5 shrink-0 ${activeView === 'economy' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span className="text-sm font-medium hidden md:inline">Economy</span>
                </button>
                
                {/* Documentation Button Removed */}
              </div>
              
              <div className="p-4 border-t border-gray-800 hidden md:block">
                 <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Systems Normal
                 </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#030712] relative">
              
              {activeView === 'marketplace' && (
                <AgentMarketplace onSelect={handleSelectAgent} />
              )}

              {activeView === 'economy' && (
                <TokenomicsPanel 
                  data={tokenomicsData} 
                  walletAddress={walletAddress}
                  onConnectWallet={handleConnectWallet}
                />
              )}

              {activeView === 'studio' && (
                <>
                  {/* Studio Toolbar */}
                  <div className="flex-none h-14 bg-[#0d1117] border-b border-gray-800 flex items-center px-4 justify-between md:justify-start gap-4 z-20">
                    
                    {/* Purple Border Tab Group */}
                    <div className="flex items-center gap-1 p-1 bg-[#0b0e14] border border-purple-500/30 rounded-lg shadow-sm shadow-purple-900/10">
                        <button 
                           onClick={() => setStudioTab('code')}
                           className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                             studioTab === 'code' 
                               ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30' 
                               : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-300'
                           }`}
                        >
                           <FileCode className="w-3.5 h-3.5" />
                           Code
                        </button>

                        <button 
                           onClick={() => setStudioTab('tools')}
                           className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                             studioTab === 'tools' 
                               ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30' 
                               : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-300'
                           }`}
                        >
                           <Package className="w-3.5 h-3.5" />
                           Tools
                        </button>

                        <button 
                           onClick={() => setStudioTab('nova')}
                           className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                             studioTab === 'nova' 
                               ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30' 
                               : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-300'
                           }`}
                        >
                           <SettingsIcon className="w-3.5 h-3.5" />
                           Config
                        </button>

                        <button 
                           onClick={() => setStudioTab('deploy')}
                           className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                             studioTab === 'deploy' 
                               ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30' 
                               : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-300'
                           }`}
                        >
                           <Play className="w-3.5 h-3.5" />
                           Run
                        </button>
                    </div>
                    
                    {/* Desktop Hint */}
                    <div className="hidden md:flex items-center text-xs text-gray-500 gap-2 ml-auto">
                      <span className="px-2 py-0.5 bg-[#1f242c] rounded border border-gray-800 font-mono text-[10px]">CMD+S</span> to save
                    </div>
                  </div>

                  {/* Workspace Content */}
                  <div className="flex-1 flex overflow-hidden relative">
                     
                     {/* Desktop: Editor is always visible unless hidden by mobile logic */}
                     <div className={`flex-1 flex flex-col min-w-0 bg-[#0d1117] transition-all duration-300 ${
                        // On mobile, hide editor if tab is not code
                        (studioTab !== 'code') ? 'hidden lg:flex' : 'flex'
                     }`}>
                       <CodeEditor code={code} onChange={setCode} />
                     </div>
                     
                     {/* Right Panel - Context Aware */}
                     {(studioTab === 'nova' || studioTab === 'deploy' || studioTab === 'tools') && (
                       <div className="flex-1 lg:flex-none lg:w-96 bg-[#0d1117] border-l border-gray-800 z-10 flex flex-col flex">
                         {studioTab === 'tools' && (
                            <ToolsPanel 
                               config={config} 
                               onInstall={handleInstallTool} 
                               onUninstall={handleUninstallTool} 
                            />
                         )}
                         {studioTab === 'nova' && (
                           <NovaPanel 
                             config={config} 
                             onChange={setConfig} 
                             isSimulating={isSimulating}
                             onRun={handleRunSimulation}
                           />
                         )}
                         {studioTab === 'deploy' && (
                           <DeployPanel 
                             code={code}
                             networkId={network}
                             onDeploy={handleDeploySuccess}
                             onInteract={handleRunSimulation}
                             onLog={handleDeployLog}
                             isSimulating={isSimulating}
                             config={config} 
                             onConfigChange={setConfig}
                             walletAddress={walletAddress}
                             onConnectWallet={handleConnectWallet}
                           />
                         )}
                       </div>
                     )}
                  </div>

                  {/* Global Console (Collapsible) */}
                  <div className={`flex-none bg-[#0d1117] transition-all duration-300 ease-in-out border-t border-gray-800 z-20 ${isConsoleOpen ? 'h-[35vh] lg:h-1/3 min-h-[150px]' : 'h-9 min-h-[36px]'}`}>
                    <Console 
                      logs={logs} 
                      isSimulating={isSimulating} 
                      isOpen={isConsoleOpen}
                      onToggle={() => setIsConsoleOpen(!isConsoleOpen)}
                    />
                  </div>
                </>
              )}
            </div>

          </main>
        </div>
      )}
    </>
  );
};

export default App;