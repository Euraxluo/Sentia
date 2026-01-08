import React from 'react';
import { BrainCircuit, ArrowRight, Zap, Code2, ShieldCheck, Database, Cpu, Globe, Layers, Activity, Coins, PieChart, GitFork, Trophy, Users, TrendingUp, Lock, BarChart3, Wallet, Hexagon, FileCode, BookOpen } from 'lucide-react';
import { PROTOCOL_CONSTANTS } from '../types';

interface LandingPageProps {
  onEnterApp: (view?: 'marketplace' | 'studio' | 'economy') => void;
  onOpenWhitepaper: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenWhitepaper }) => {
  
  const tickerItems = (
    <>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div> SENTIA v1.0 ONLINE</span>
        <span className="text-emerald-500">AMA: $4.20 (GAS)</span>
        <span className="text-indigo-400 font-bold">SENT: $0.85 (REWARD)</span>
        <span>ACTIVE CLUSTERS: 142</span>
        <span>TVL: 45.2M AMA</span>
        <span className="text-indigo-400">GENESIS BLOCK: MINED</span>
        <span className="text-gray-500">TPS: 12,400</span>
        <span className="text-purple-400">NOVA INFERENCE: OPTIMIZED</span>
    </>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-y-auto font-sans selection:bg-indigo-500/30">
      
      {/* Live Ticker */}
      <div className="bg-[#0b0e14] border-b border-gray-800 py-2 overflow-hidden flex whitespace-nowrap z-50 relative">
        <div className="animate-marquee flex items-center gap-12 text-xs font-mono text-gray-400 pr-12">
           {/* Render twice for seamless loop */}
           {tickerItems}
           {tickerItems}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#030712]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onEnterApp('marketplace')}>
              <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                 <Hexagon className="h-6 w-6 text-indigo-400 fill-indigo-500/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-none">Sentia</span>
                <span className="text-[9px] text-gray-500 font-mono tracking-wider leading-none mt-0.5">BUILT ON AMADEUS</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <button onClick={() => document.getElementById('economics')?.scrollIntoView({behavior: 'smooth'})} className="text-gray-400 hover:text-white transition-colors hidden sm:block">Economics</button>
              <button onClick={() => document.getElementById('provenance')?.scrollIntoView({behavior: 'smooth'})} className="text-gray-400 hover:text-white transition-colors hidden sm:block">Provenance</button>
              
              <button onClick={onOpenWhitepaper} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                 <BookOpen className="w-4 h-4" />
                 <span>Docs</span>
              </button>

              <button 
                onClick={() => onEnterApp('marketplace')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              >
                Launch Studio
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 sm:pt-32 sm:pb-24 overflow-hidden border-b border-gray-800">
        {/* Abstract Financial Background */}
        <div className="absolute inset-0 -z-10">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-indigo-900/10 to-transparent"></div>
           <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
           {/* Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
             
             {/* Left Column: Copy */}
             <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/30 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-6 font-mono tracking-wide">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  AMADEUS GENESIS HACKATHON
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none text-white">
                  The Protocol for <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-white">Autonomous Agents.</span>
                </h1>
                
                <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
                  <strong>Sentia</strong> is the liquidity layer for AI. Built on the Amadeus Protocol (L1), 
                  we enable developers to deploy agents, stake $AMA, and earn <strong className="text-indigo-400">$SENT</strong> rewards.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <button 
                    onClick={() => onEnterApp('economy')}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </button>
                  <button 
                    onClick={onOpenWhitepaper}
                    className="w-full sm:w-auto px-8 py-4 bg-[#161b22] border border-gray-700 text-white rounded-lg font-bold text-lg hover:border-gray-500 hover:bg-[#1c2128] transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    Read Whitepaper
                  </button>
                </div>
             </div>

             {/* Right Column: Economic Dashboard Preview */}
             <div className="relative group cursor-pointer" onClick={() => onEnterApp('economy')}>
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-[#0d1117] border border-gray-700 rounded-xl p-6 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                   {/* Fake Dashboard UI */}
                   <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-500"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                         <Globe className="w-3 h-3" />
                         Amadeus Mainnet
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-[#161b22] rounded border border-gray-800">
                         <div className="text-xs text-gray-500 mb-1">Total Value Locked</div>
                         <div className="text-2xl font-mono text-emerald-400 font-bold">45.2M AMA</div>
                      </div>
                      <div className="p-4 bg-[#161b22] rounded border border-gray-800">
                         <div className="text-xs text-gray-500 mb-1">Incentive Pool</div>
                         <div className="text-2xl font-mono text-indigo-400 font-bold">2.4M SENT</div>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
                         <span>Sentia Agents</span>
                         <span>24h Rewards</span>
                      </div>
                      {[
                        {name: 'Liquid Velocity', val: '+1,200 SENT'},
                        {name: 'DAO Sentinel', val: '+850 SENT'},
                        {name: 'Curator AI', val: '+420 SENT'}
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-[#0b0e14] border border-gray-800 rounded hover:border-gray-600 transition-colors">
                           <span className="font-bold text-gray-300">{item.name}</span>
                           <span className="font-mono text-indigo-500">{item.val}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Arweave Provenance Section (NEW) */}
      <div id="provenance" className="py-24 bg-[#080c14] border-b border-gray-800 relative">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-900/5 to-transparent pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/30 border border-orange-500/30 text-orange-400 text-xs font-bold mb-6 font-mono tracking-wide">
                      <Database className="w-3 h-3" />
                      BEST PROVENANCE ARCHITECTURE
                   </div>
                   <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Immutable Provenance <br/>Pipeline.</h2>
                   <p className="text-xl text-gray-400 mb-6">
                      We connect miner simulations and agent reasoning logs directly to <strong className="text-orange-400">Arweave</strong>.
                   </p>
                   <p className="text-gray-500 mb-8 leading-relaxed">
                      This establishes a transparent, permanent audit trail for all decentralized AI work. 
                      Every inference output, every thought process, and every ZK proof is indexed and traceable forever.
                   </p>
                   
                   <div className="space-y-4">
                      <div className="flex items-start gap-4">
                         <div className="p-2 bg-[#161b22] rounded border border-gray-700">
                             <FileCode className="w-5 h-5 text-gray-400" />
                         </div>
                         <div>
                            <h4 className="font-bold text-white">Log & Index</h4>
                            <p className="text-sm text-gray-500">Automatic logging of Thinking outputs to Permaweb.</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="p-2 bg-[#161b22] rounded border border-gray-700">
                             <ShieldCheck className="w-5 h-5 text-gray-400" />
                         </div>
                         <div>
                            <h4 className="font-bold text-white">Verify & Attribute</h4>
                            <p className="text-sm text-gray-500">On-chain verification of agent performance for reward distribution.</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-[#0b0e14] border border-gray-700 rounded-xl p-6 font-mono text-xs overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-4">
                       <img src="https://arweave.net/logo.svg" className="w-8 h-8 opacity-20" alt="Arweave" />
                    </div>
                    <div className="space-y-2">
                       <div className="text-gray-500"># Initializing Arweave Uplink...</div>
                       <div className="text-emerald-500">>> Uplink Established. Gateway: arweave.net</div>
                       <div className="text-gray-500"># Compressing Inference Log (Agent #420)...</div>
                       <div className="text-gray-300">Payload: 2.4MB JSON</div>
                       <div className="text-gray-500"># Signing Transaction (Wallet: 0x8f...2a)</div>
                       <div className="text-orange-400">>> Transaction ID: Pk_...9xL</div>
                       <div className="text-gray-500 mt-4"># Status: MINED (Block 129402)</div>
                       <div className="p-3 bg-gray-900 rounded border border-gray-800 mt-2 text-gray-400 break-all">
                          https://viewblock.io/arweave/tx/Pk_s1Kj39_sLa0x...
                       </div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Economic Engine Section */}
      <div id="economics" className="py-24 bg-[#030712] border-b border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">The Engine of Wealth</h2>
               <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                 We leverage the <span className="text-emerald-400 font-bold">$AMA</span> gas token for staking, 
                 but distribute value through our native <span className="text-indigo-400 font-bold">$SENT</span> protocol token.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {/* Card 1 */}
               <div className="p-8 bg-[#0d1117] border border-gray-800 hover:border-emerald-500/50 transition-all rounded-xl group cursor-pointer" onClick={() => onEnterApp('economy')}>
                  <TrendingUp className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-2">Stake AMA</h3>
                  <p className="text-gray-400 mb-4">Users stake $AMA to secure the network. This TVL backs the intrinsic value of the agent economy.</p>
                  <div className="text-emerald-500 font-bold text-sm flex items-center gap-1">Start Staking <ArrowRight className="w-4 h-4"/></div>
               </div>

               {/* Card 2 */}
               <div className="p-8 bg-[#0d1117] border border-gray-800 hover:border-indigo-500/50 transition-all rounded-xl group cursor-pointer" onClick={() => onEnterApp('economy')}>
                  <PieChart className="w-10 h-10 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-2">Earn $SENT</h3>
                  <p className="text-gray-400 mb-4">The protocol mints $SENT tokens based on agent utility and performance. Rewards are distributed to active stakers.</p>
                  <div className="text-indigo-500 font-bold text-sm flex items-center gap-1">View Pool <ArrowRight className="w-4 h-4"/></div>
               </div>

               {/* Card 3 */}
               <div className="p-8 bg-[#0d1117] border border-gray-800 hover:border-purple-500/50 transition-all rounded-xl group cursor-pointer" onClick={() => onEnterApp('marketplace')}>
                  <GitFork className="w-10 h-10 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-2">Viral Forks</h3>
                  <p className="text-gray-400 mb-4">Agents that get forked gain more weight in the $SENT incentive pool. Virality = Revenue.</p>
                  <div className="text-purple-500 font-bold text-sm flex items-center gap-1">Explore Marketplace <ArrowRight className="w-4 h-4"/></div>
               </div>
            </div>
         </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 text-center bg-[#030712]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
           <div className="mb-4 md:mb-0 font-mono text-left">
             <span className="font-bold text-gray-300 block">Sentia Network</span>
             <span className="text-xs text-gray-600">Built on Amadeus Protocol</span>
           </div>
           <div className="flex gap-6">
              <a href="https://github.com/Euraxluo/Sentia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">GitHub</a>
              {/* Coming Soon
              <span className="hover:text-white transition-colors cursor-pointer opacity-50 cursor-not-allowed">Twitter</span>
              <span className="hover:text-white transition-colors cursor-pointer opacity-50 cursor-not-allowed">Discord</span>
              <span className="hover:text-white transition-colors cursor-pointer opacity-50 cursor-not-allowed">Status</span>
              */}
           </div>
        </div>
      </footer>
    </div>
  );
};