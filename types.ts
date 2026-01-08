
export interface NovaConfig {
  model: string;
  temperature: number;
  topK: number;
  systemPrompt: string;
  // Bonus Challenge Configs
  useArweave: boolean; // For Provenance Track
  usePrivacy: boolean; // For Verifiable Compute Track (TEE/ZK)
  // Attribution & Economy
  upstreamAgentId?: string; // ID of the parent agent being forked
  upstreamRoyaltyRate?: number;
  upstreamYieldBoost?: number;
  // Note: Agents do NOT stake directly. Staking is global.
  enabledTools: string[]; // List of installed tool IDs
  
  // x402 Protocol (Service Standard)
  x402Enabled: boolean; // If true, this agent listens for external calls
  x402ServiceFee: number; // Cost in SENT for other agents to call this agent
}

export type NetworkId = 'mainnet' | 'testnet' | 'local';

export interface Network {
  id: NetworkId;
  name: string;
  rpc: string;
  chainId: number;
  currency: string;
}

export const NETWORKS: Record<NetworkId, Network> = {
  mainnet: { id: 'mainnet', name: 'Amadeus Mainnet', rpc: 'https://rpc.amadeus.one', chainId: 402, currency: 'AMA' },
  testnet: { id: 'testnet', name: 'Nova Testnet', rpc: 'https://testnet.amadeus.one', chainId: 4020, currency: 'tAMA' },
  local: { id: 'local', name: 'Local Simulation', rpc: 'http://localhost:8545', chainId: 1337, currency: 'ETH' }
};

export const NOVA_MODELS = [
  { id: 'nova0-deterministic-unstable', name: 'Nova-0 Deterministic (Unstable)', provider: 'Amadeus' },
  { id: 'nova0-deterministic-creative-unstable', name: 'Nova-0 Creative (Unstable)', provider: 'Amadeus' },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Meta' },
  { id: 'gpt-oss-120b', name: 'GPT-OSS 120B', provider: 'Open Source' },
  { id: 'qwen-3-235b-a22b-instruct-2507', name: 'Qwen 3 235B', provider: 'Alibaba' }
];

export type LogType = 'SYSTEM' | 'CONTRACT' | 'AI_THOUGHT' | 'TRANSACTION' | 'ERROR' | 'BUILD' | 'NETWORK' | 'STORAGE' | 'VERIFICATION' | 'HARDWARE' | 'x402';

export interface ExecutionLog {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
  gasUsed?: number;
  metadata?: Record<string, any>;
}

export interface SimulationResult {
  logs: ExecutionLog[];
  totalGas: number;
  finalState: string;
}

export const PROTOCOL_CONSTANTS = {
  GLOBAL_STAKING_APY: 30.0, // Base Protocol inflation rate for Stakers
  MARKET_INCENTIVE_PCT: 5.0, // 5% of Total TVL allocated to Agent Ecosystem
  CREATOR_REWARD_RATE: 2.5, // 2.5% of the Agent's pool share goes to Creator
  VALIDATOR_REWARD_RATE: 97.5, // 97.5% distributed evenly to Swarm (Forkers)
  FORK_THRESHOLD: 100 // Minimum forks required to unlock Market Incentives
};

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'DeFi' | 'Governance' | 'Gaming' | 'Social' | 'Compute' | 'Service';
  difficulty: 'Beginner' | 'Advanced';
  model: string;
  // Economy Specs (Market Driven)
  forks: number; // Number of active forks (miners)
  dailyVolume: number; // Volume of inference calls
  isOfficial?: boolean; // If true, gets official boost
  yieldBoost: number; // Official multiplier for the fork count calculation
  royaltyRate: number; // % of rewards that go to the original creator
  
  // x402 Specs
  isService?: boolean; // Is this an x402 service?
  serviceFee?: number; // Cost to call

  // Derived Stats for UI
  estDailyRewards: number; // Estimated SENT rewards per day for the whole swarm
}

export interface TokenomicsData {
  amaBalance: number; // Gas Token
  sentBalance: number; // Protocol Token
  stakedAma: number; // User's Global Stake in AMA
  
  sentRewards: number; // Rewards in SENT
  
  // Passive Income from Forks
  activeForks: number;
  dailyRevenue: { day: string; staking: number; market: number }[];
  topAgents: {
    id: string;
    name: string;
    creator: string;
    weight: number; // Effective Weight (Forks * Boost)
    marketShare: number; // % of the 5% Pool
    users: number; // Number of forks/users
  }[];
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'defi_sniper',
    name: 'Liquid Velocity Sniper',
    description: 'High-frequency arbitrage agent. Dominates the mempool.',
    category: 'DeFi',
    difficulty: 'Advanced',
    model: 'nova0-deterministic-unstable',
    forks: 1240,
    dailyVolume: 45000,
    isOfficial: true,
    yieldBoost: 2.0, // Official Boost
    royaltyRate: PROTOCOL_CONSTANTS.CREATOR_REWARD_RATE,
    estDailyRewards: 4500 // High share due to high forks * boost
  },
  {
    id: 'gov_mod',
    name: 'DAO Sentinel',
    description: 'Auto-voting and proposal analysis for large DAOs.',
    category: 'Governance',
    difficulty: 'Beginner',
    model: 'llama-3.3-70b',
    forks: 850,
    dailyVolume: 1200,
    yieldBoost: 1.0,
    royaltyRate: PROTOCOL_CONSTANTS.CREATOR_REWARD_RATE,
    estDailyRewards: 1200
  },
  {
    id: 'x402_oracle',
    name: 'DeepTruth Oracle (x402)',
    description: 'Service Agent. Verifies real-world facts for other agents.',
    category: 'Service',
    difficulty: 'Advanced',
    model: 'nova0-deterministic-creative-unstable',
    forks: 210,
    dailyVolume: 8500,
    isService: true,
    serviceFee: 0.5,
    yieldBoost: 3.0,
    royaltyRate: 5.0, // Higher royalty for services
    estDailyRewards: 850
  },
  {
    id: 'riscv_matmul',
    name: 'Tenstorrent Kernel',
    description: 'Experimental compute kernel. Needs more forks to activate yield.',
    category: 'Compute',
    difficulty: 'Advanced',
    model: 'nova0-deterministic-unstable',
    forks: 45, // Under 100 threshold
    dailyVolume: 92000,
    yieldBoost: 5.0, // Huge official boost to encourage adoption
    royaltyRate: PROTOCOL_CONSTANTS.CREATOR_REWARD_RATE,
    estDailyRewards: 0 // 0 because threshold not met
  }
];

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  costPerRun: number; // In SENT
  category: 'Data' | 'Social' | 'Compute' | 'Identity';
  importSnippet: string; // The code to inject at the top
  usageSnippet: string; // The code to inject in the body
}

export const AVAILABLE_TOOLS: AgentTool[] = [
  {
    id: 'web_search',
    name: 'Amadeus Web Stream',
    description: 'Live internet access without rate limits. Search, crawl, and parse.',
    costPerRun: 0.5,
    category: 'Data',
    importSnippet: 'import { Web } from "@amadeus/tools";',
    usageSnippet: '// Tool Usage: Cost 0.5 SENT\n  const searchResults = Web.search("latest eth news", { limit: 5 });'
  },
  {
    id: 'twitter_api',
    name: 'X (Twitter) Sentinel',
    description: 'Read timelines and post tweets autonomously via enterprise API.',
    costPerRun: 2.0,
    category: 'Social',
    importSnippet: 'import { Social } from "@amadeus/tools";',
    usageSnippet: '// Tool Usage: Cost 2.0 SENT\n  Social.post("Market is moving! #AMA", { sentiment: "bullish" });'
  },
  {
    id: 'x402_caller',
    name: 'x402 Agent Interface',
    description: 'Call other active Agents on the network as services.',
    costPerRun: 0.0, // The cost depends on the target agent
    category: 'Compute',
    importSnippet: 'import { x402 } from "@amadeus/standards";',
    usageSnippet: '// Call another agent (Oracle Service)\n  const fact = x402.call("0xTargetAgentAddress", { query: "Is sky blue?" });'
  },
  {
    id: 'bloomberg_feed',
    name: 'Alpha Stream (Finance)',
    description: 'Institutional grade price feeds and sentiment analysis.',
    costPerRun: 5.0,
    category: 'Data',
    importSnippet: 'import { Finance } from "@amadeus/tools";',
    usageSnippet: '// Tool Usage: Cost 5.0 SENT\n  const price = Finance.getPrice("ETH-USDC", { source: "binance" });'
  },
  {
    id: 'wolfram_alpha',
    name: 'Math Core',
    description: 'Symbolic computation and advanced physics engine.',
    costPerRun: 1.5,
    category: 'Compute',
    importSnippet: 'import { MathCore } from "@amadeus/tools";',
    usageSnippet: '// Tool Usage: Cost 1.5 SENT\n  const solution = MathCore.solve("integral of x^2", { timeout: 1000 });'
  }
];


export const DEFAULT_CONTRACT_CODE = `import { Nova, Ledger, Console } from "@amadeus/sdk";
import { x402 } from "@amadeus/standards";

// Define the input schema for the prediction
class PredictionRequest {
  targetDate: string;
  asset: string;
}

// x402 Service Interface
// This function can be called by OTHER agents for a fee
export function serve(input: string): string {
  Console.log("Received x402 request: " + input);
  return Nova.inference("Analyze this for external agent: " + input);
}

export function run(targetDate: string, asset: string): void {
  Console.log("Starting prediction for " + asset + " on " + targetDate);

  // 1. Construct the Nova Inference Prompt
  const prompt = "Predict the price of " + asset + " on " + targetDate + ". Return a JSON object with 'price' and 'confidence'.";
  
  // 2. Call Nova (Authenticated Off-chain Inference)
  const response = Nova.inference(prompt, {
    model: "nova0-deterministic-unstable",
    temperature: 0.1
  });

  Console.log("Nova Response: " + response);

  // 3. Store result with Provenance (Arweave)
  Storage.set("last_prediction", response);
}
`;

export const DEFAULT_NOVA_CONFIG: NovaConfig = {
  model: "nova0-deterministic-unstable",
  temperature: 0.7,
  topK: 40,
  systemPrompt: "You are a helpful assistant.",
  useArweave: false,
  usePrivacy: false,
  enabledTools: [],
  x402Enabled: false,
  x402ServiceFee: 1.0
};
