import React, { useState } from 'react';
import { TokenomicsData, PROTOCOL_CONSTANTS } from '../types';
import { Wallet, TrendingUp, Coins, Lock, ArrowUpRight, Users, BarChart3, Activity, GitFork, PieChart, Trophy, ArrowRight, ArrowUpRight as ArrowUpRightIcon, AlertCircle } from './Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TokenomicsPanelProps {
  data: TokenomicsData;
  walletAddress: string | null;
  onConnectWallet: () => void;
}

export const TokenomicsPanel: React.FC<TokenomicsPanelProps> = ({ data, walletAddress, onConnectWallet }) => {
  const [stakeTab, setStakeTab] = useState<'stake' | 'unstake'>('stake');
  const [stakeAmount, setStakeAmount] = useState('');
  const [isTransacting, setIsTransacting] = useState(false);

  const handleTransaction = () => {
    if (!stakeAmount || !walletAddress) return;
    setIsTransacting(true);
    // Simulate transaction delay
    setTimeout(() => {
        setIsTransacting(false);
        setStakeAmount('');
        // In a real app, this would trigger an on-chain update
    }, 2000);
  };

  const setMax = () => {
      setStakeAmount(stakeTab === 'stake' ? data.amaBalance.toString() : data.stakedAma.toString());
  };

  return (
    <div className="w-full h-full bg-[#030712] overflow-y-auto p-4 md:p-8 font-sans custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header with Wallet Logic */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Coins className="text-yellow-500 w-8 h-8" />
              Protocol Economy
            </h1>
            <p className="text-gray-400 mt-1">
               Stake <strong className="text-emerald-400">$AMA</strong> (Gas) to earn <strong className="text-indigo-400">$SENT</strong> (Protocol Rewards).
            </p>
          </div>
          
          {!walletAddress ? (
             <button 
               onClick={onConnectWallet}
               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
             >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
             </button>
          ) : (
             <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border border-gray-700 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm text-gray-300 font-mono">Connected: {walletAddress.substring(0,6)}...{walletAddress.substring(38)}</span>
             </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Staked */}
          <div className="bg-[#0d1117] border border-gray-800 p-5 rounded-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Lock className="w-16 h-16 text-emerald-500" />
             </div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Staked</p>
             <h3 className="text-2xl font-bold text-white font-mono">{data.stakedAma.toLocaleString()} <span className="text-sm text-emerald-400">AMA</span></h3>
             <div className="mt-4 flex items-center gap-2 text-xs">
               <span className="text-emerald-400 flex items-center gap-1 font-bold">
                 <TrendingUp className="w-3 h-3" />
                 {PROTOCOL_CONSTANTS.GLOBAL_STAKING_APY}% APY
               </span>
             </div>
          </div>

          {/* Card 2: Unclaimed Rewards */}
          <div className="bg-[#0d1117] border border-gray-800 p-5 rounded-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <PieChart className="w-16 h-16 text-cyan-500" />
             </div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Unclaimed Rewards</p>
             <h3 className="text-2xl font-bold text-white font-mono">{data.sentRewards.toLocaleString()} <span className="text-sm text-indigo-400">SENT</span></h3>
             <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <button className="text-indigo-400 hover:text-white underline decoration-dashed transition-colors">Claim All Rewards</button>
             </div>
          </div>

          {/* Card 3: Available Balance */}
          <div className="bg-[#0d1117] border border-gray-800 p-5 rounded-xl relative overflow-hidden group hover:border-yellow-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Coins className="w-16 h-16 text-yellow-500" />
             </div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Wallet Balance</p>
             <h3 className="text-2xl font-bold text-white font-mono">{data.amaBalance.toLocaleString()} <span className="text-sm text-yellow-400">AMA</span></h3>
             <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
               <span>Available to Stake</span>
             </div>
          </div>

          {/* Card 4: Agent Ownership */}
          <div className="bg-[#0d1117] border border-gray-800 p-5 rounded-xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <GitFork className="w-16 h-16 text-purple-500" />
             </div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Agent Ownership</p>
             <h3 className="text-2xl font-bold text-white font-mono">{data.sentBalance.toLocaleString()} <span className="text-sm text-purple-400">SENT</span></h3>
             <span className="text-[10px] text-gray-500 font-mono mt-2 block">
                Protocol Voting Power
             </span>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
            
          {/* 1. Staking Control Panel (New Feature) */}
          <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6 flex flex-col h-[420px] shadow-2xl relative overflow-hidden">
             {/* Background decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

             <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <Lock className="w-5 h-5 text-emerald-500" />
                   Staking Vault
                </h3>
                <div className="flex bg-[#161b22] rounded p-1 border border-gray-700">
                    <button 
                        onClick={() => setStakeTab('stake')}
                        className={`px-3 py-1 text-xs font-bold rounded transition-colors ${stakeTab === 'stake' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Stake
                    </button>
                    <button 
                        onClick={() => setStakeTab('unstake')}
                        className={`px-3 py-1 text-xs font-bold rounded transition-colors ${stakeTab === 'unstake' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Unstake
                    </button>
                </div>
             </div>
             
             <div className="flex-1 flex flex-col justify-center space-y-6 relative z-10">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                        <span>Amount ({stakeTab === 'stake' ? 'AMA' : 'stAMA'})</span>
                        <span>
                            Available: {stakeTab === 'stake' ? data.amaBalance.toFixed(2) : data.stakedAma.toFixed(2)}
                        </span>
                    </div>
                    <div className="relative">
                        <input 
                            type="number" 
                            placeholder="0.00"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="w-full bg-[#161b22] border border-gray-700 rounded-lg p-4 text-lg font-mono text-white focus:border-emerald-500 focus:outline-none transition-all placeholder-gray-700"
                        />
                        <button 
                            onClick={setMax}
                            className="absolute right-3 top-3.5 text-xs bg-[#21262d] text-emerald-400 px-2 py-1 rounded border border-gray-700 hover:bg-gray-700 transition-colors font-bold"
                        >
                            MAX
                        </button>
                    </div>
                </div>

                <div className="bg-[#161b22]/50 rounded-lg p-4 space-y-3 border border-gray-800">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">APY Rate</span>
                        <span className="text-emerald-400 font-bold">{PROTOCOL_CONSTANTS.GLOBAL_STAKING_APY}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Lock-up Period</span>
                        <span className="text-white">7 Days</span>
                    </div>
                     <div className="flex justify-between text-xs pt-2 border-t border-gray-700/50">
                        <span className="text-gray-500">Est. Monthly Yield</span>
                        <span className="text-indigo-400 font-mono">
                            {stakeAmount ? (parseFloat(stakeAmount) * (PROTOCOL_CONSTANTS.GLOBAL_STAKING_APY / 100) / 12).toFixed(2) : '0.00'} SENT
                        </span>
                    </div>
                </div>

                <button 
                    onClick={handleTransaction}
                    disabled={!walletAddress || !stakeAmount || isTransacting}
                    className={`w-full py-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${
                        !walletAddress 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                        : (stakeTab === 'stake' 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                            : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600')
                    }`}
                >
                    {isTransacting ? (
                        <Activity className="w-4 h-4 animate-spin" />
                    ) : (
                        stakeTab === 'stake' ? <Lock className="w-4 h-4" /> : <ArrowUpRightIcon className="w-4 h-4" />
                    )}
                    <span>
                        {isTransacting 
                            ? 'Processing...' 
                            : (!walletAddress ? 'Connect Wallet' : (stakeTab === 'stake' ? 'Confirm Stake' : 'Confirm Unstake'))}
                    </span>
                </button>
             </div>
          </div>

          {/* 2. Revenue Chart (Modified to span 2 cols) */}
          <div className="lg:col-span-2 bg-[#0d1117] border border-gray-800 rounded-xl p-6 flex flex-col h-[420px]">
             <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Yield Analysis
                </h3>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Staking Rewards (AMA)
                   </div>
                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Protocol Rewards (SENT)
                   </div>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1 bg-[#161b22] hover:bg-gray-800 rounded text-xs text-gray-300 border border-gray-700 transition-colors">7D</button>
                 <button className="px-3 py-1 bg-[#161b22] hover:bg-gray-800 rounded text-xs text-gray-300 border border-gray-700 transition-colors">30D</button>
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyRevenue}>
                  <defs>
                    <linearGradient id="colorStaking" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="day" stroke="#6b7280" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="staking" stackId="1" stroke="#eab308" fill="url(#colorStaking)" strokeWidth={2} name="AMA Yield" />
                  <Area type="monotone" dataKey="market" stackId="1" stroke="#6366f1" fill="url(#colorMarket)" strokeWidth={2} name="SENT Rewards" />
                </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* 3. Top Agents (Moved to bottom row) */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-500" />
                    Top Performing Agents
                </h3>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                   View Full Leaderboard <ArrowUpRight className="w-3 h-3" />
                </button>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.topAgents.map((agent, i) => (
                   <div key={agent.id} className="flex items-center justify-between p-4 bg-[#161b22] border border-gray-700/50 rounded-lg hover:border-indigo-500/30 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg ${i===0 ? 'bg-yellow-500/20 text-yellow-500' : (i===1 ? 'bg-gray-500/20 text-gray-400' : 'bg-orange-700/20 text-orange-500')}`}>
                            #{i+1}
                         </div>
                         <div>
                            <div className="text-sm font-bold text-gray-200 group-hover:text-indigo-400 transition-colors">{agent.name}</div>
                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                               <Users className="w-3 h-3" /> {agent.users} Forks
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-xs font-bold text-emerald-400">{agent.marketShare}%</div>
                         <div className="text-[10px] text-gray-500">Pool Share</div>
                      </div>
                   </div>
                ))}
             </div>
        </div>

      </div>
    </div>
  );
};