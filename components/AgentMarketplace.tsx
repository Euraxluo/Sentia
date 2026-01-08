import React from 'react';
import { AGENT_TEMPLATES, AgentTemplate, PROTOCOL_CONSTANTS } from '../types';
import { BrainCircuit, ShieldCheck, TrendingUp, Coins, Activity, Cpu, GitFork, Zap, Rocket, Lock, Layers, Users, Star, Trophy, PieChart, Globe } from './Icons';

interface AgentMarketplaceProps {
  onSelect: (agent: AgentTemplate) => void;
}

export const AgentMarketplace: React.FC<AgentMarketplaceProps> = ({ onSelect }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'DeFi': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Governance': return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'Compute': return <Cpu className="w-5 h-5 text-pink-400" />;
      case 'Service': return <Globe className="w-5 h-5 text-cyan-400" />;
      default: return <BrainCircuit className="w-5 h-5 text-purple-400" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="w-full h-full bg-[#030712] p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <PieChart className="w-32 h-32 text-indigo-400" />
           </div>
           <div className="relative z-10 space-y-2 max-w-2xl">
              <h1 className="text-3xl font-bold text-white tracking-tight">Market Incentive Pool</h1>
              <div className="text-gray-400 text-lg">
                <span className="text-emerald-400 font-bold">{PROTOCOL_CONSTANTS.MARKET_INCENTIVE_PCT}% of Protocol TVL</span> is minted as <strong className="text-indigo-400">$SENT</strong> and distributed to active Agents.
                <div className="text-sm mt-1 text-gray-500">
                  Allocation = (Forks × Boost) ÷ Total Network Weight
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                 <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-[#030712]/50 px-3 py-1.5 rounded-full border border-gray-800">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    Protocol TVL: 45.2M AMA
                 </div>
                 <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-[#030712]/50 px-3 py-1.5 rounded-full border border-gray-800">
                    <Coins className="w-3 h-3 text-indigo-400" />
                    Incentive Pool: 2.26M SENT
                 </div>
                 <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-[#030712]/50 px-3 py-1.5 rounded-full border border-gray-800">
                    <GitFork className="w-3 h-3 text-purple-400" />
                    Activation Threshold: {PROTOCOL_CONSTANTS.FORK_THRESHOLD} Forks
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENT_TEMPLATES.map((agent) => {
            const progress = Math.min(100, (agent.forks / PROTOCOL_CONSTANTS.FORK_THRESHOLD) * 100);
            const isYieldActive = agent.forks >= PROTOCOL_CONSTANTS.FORK_THRESHOLD;
            // Calculate an estimated daily earning per fork (simplified logic for UI)
            const estPerFork = isYieldActive ? (agent.estDailyRewards * 0.975 / agent.forks).toFixed(2) : "0.00";

            return (
              <div 
                key={agent.id}
                className={`group relative bg-[#0d1117] border rounded-xl p-6 transition-all duration-300 cursor-pointer flex flex-col ${
                    agent.isOfficial 
                    ? 'border-indigo-500/30 shadow-lg shadow-indigo-900/10 hover:shadow-indigo-900/20' 
                    : (agent.isService ? 'border-cyan-500/30 hover:border-cyan-500/50' : 'border-gray-800 hover:border-gray-700')
                }`}
                onClick={() => onSelect(agent)}
              >
                {/* Official Boost Badge */}
                {agent.isOfficial && (
                   <div className="absolute -top-3 -right-3 z-10">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-[10px] font-bold text-white shadow-lg border border-white/10">
                         <Zap className="w-3 h-3 text-yellow-300 fill-current" />
                         <span>OFFICIAL BOOST x{agent.yieldBoost}</span>
                      </div>
                   </div>
                )}
                
                {/* Service Badge (x402) */}
                {agent.isService && (
                   <div className="absolute -top-3 -right-3 z-10">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0e7490] rounded-full text-[10px] font-bold text-white shadow-lg border border-cyan-400/30">
                         <Globe className="w-3 h-3 text-cyan-200" />
                         <span>x402 SERVICE</span>
                      </div>
                   </div>
                )}
                
                {/* High Boost Badge for non-officials */}
                {!agent.isOfficial && !agent.isService && agent.yieldBoost > 1 && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1f2937] rounded-full text-[10px] font-bold text-gray-300 border border-gray-700">
                         <TrendingUp className="w-3 h-3 text-emerald-400" />
                         <span>Boost x{agent.yieldBoost}</span>
                      </div>
                   </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg transition-colors ${agent.isService ? 'bg-cyan-900/20' : 'bg-gray-900 group-hover:bg-gray-800'}`}>
                    {getIcon(agent.category)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                       <Activity className="w-3 h-3 text-gray-500" />
                       Vol: {formatNumber(agent.dailyVolume)}
                     </div>
                     {agent.isService ? (
                         <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-900/50">
                            <Coins className="w-3 h-3" /> Fee: {agent.serviceFee} SENT
                         </div>
                     ) : isYieldActive ? (
                         <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-900/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            <Coins className="w-3 h-3" /> ~{estPerFork} SENT/day
                         </div>
                     ) : (
                         <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold bg-orange-900/20 px-2 py-0.5 rounded border border-orange-900/50">
                            <Lock className="w-3 h-3" /> Incentives Locked
                         </div>
                     )}
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold text-white mb-2 transition-colors flex items-center gap-2 ${agent.isService ? 'group-hover:text-cyan-300' : 'group-hover:text-indigo-300'}`}>
                    {agent.name}
                    {agent.isOfficial && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6 flex-1 h-[40px] line-clamp-2">
                  {agent.description}
                </p>

                {/* Swarm Activation Progress */}
                <div className="mb-6 p-3 bg-[#161b22] rounded-lg border border-gray-800">
                    <div className="flex justify-between items-center text-[10px] mb-2">
                        <span className="text-gray-400 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Swarm Size
                        </span>
                        <span className={isYieldActive ? 'text-emerald-400 font-bold font-mono' : 'text-orange-400 font-mono'}>
                            {agent.forks}/{PROTOCOL_CONSTANTS.FORK_THRESHOLD} Nodes
                        </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                                isYieldActive 
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' 
                                : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                            }`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    
                    <div className="mt-2 text-[10px] text-right">
                        {isYieldActive ? (
                            <span className="text-indigo-400 flex items-center justify-end gap-1">
                                <Zap className="w-3 h-3" /> Rewards Active ($SENT)
                            </span>
                        ) : (
                            <span className="text-gray-500">
                                Need {PROTOCOL_CONSTANTS.FORK_THRESHOLD - agent.forks} more forks to unlock Reward Pool
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Area */}
                <div className="mt-auto space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-[#161b22] p-2 rounded border border-gray-700/50 flex flex-col items-center justify-center text-center">
                          <span className="text-gray-500 mb-0.5">Forker Share</span>
                          <span className="text-emerald-400 font-bold text-xs">{PROTOCOL_CONSTANTS.VALIDATOR_REWARD_RATE}%</span>
                      </div>
                      <div className="bg-[#161b22] p-2 rounded border border-gray-700/50 flex flex-col items-center justify-center text-center">
                          <span className="text-gray-500 mb-0.5">Genesis Share</span>
                          <span className="text-purple-400 font-bold text-xs">{agent.royaltyRate}%</span>
                      </div>
                  </div>

                  <button className="w-full py-2.5 bg-white text-black text-xs font-bold rounded hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <GitFork className="w-4 h-4" />
                    <span>Fork to Earn</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* New Agent Card */}
          <div className="border border-dashed border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4 opacity-60 hover:opacity-100 hover:border-indigo-500/50 hover:bg-[#0d1117] transition-all cursor-pointer group min-h-[400px]">
             <div className="p-4 bg-gray-900 rounded-full group-hover:bg-indigo-900/20 transition-colors">
                <Rocket className="w-8 h-8 text-gray-500 group-hover:text-indigo-400" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-gray-300 group-hover:text-white mb-1">Genesis Deployment</h3>
                <p className="text-xs text-gray-500">Launch a new agent architecture</p>
             </div>
             
             <div className="w-full bg-[#161b22] p-4 rounded-lg border border-gray-800 text-left space-y-3">
                <div className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-purple-900/30 rounded text-purple-400"><Trophy className="w-3 h-3" /></div>
                   <div>
                      <div className="text-xs font-bold text-gray-300">Creator Reward</div>
                      <div className="text-[10px] text-gray-500">Earn 2.5% of the agent's <span className="text-indigo-400 font-bold">$SENT</span> allocation.</div>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-cyan-900/30 rounded text-cyan-400"><Globe className="w-3 h-3" /></div>
                   <div>
                      <div className="text-xs font-bold text-gray-300">x402 Monetization</div>
                      <div className="text-[10px] text-gray-500">Earn <span className="text-indigo-400 font-bold">Fees</span> when other agents call your API.</div>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};