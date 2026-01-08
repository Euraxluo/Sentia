# Sentia: The Liquidity & Coordination Layer for Autonomous Agents
### Amadeus Genesis Hackathon Submission (Technical Whitepaper)

---

## 1. Concept Deck: The Logic of Agent Sovereignty

### 1.1 The Structural Problem
Current Autonomous Agent frameworks (LangChain, AutoGPT) suffer from **"The Sovereign Gap"**:
1.  **Ephemeral Runtime**: Agents run on local servers. If the server dies, the agent dies. They have no persistent state.
2.  **Economic Orphanhood**: Agents cannot natively hold assets or pay for their own computation. They rely on an external user's wallet API key.
3.  **Verification Vacuum**: When an agent executes a financial transaction (e.g., swapping ETH for USDC), there is no immutable log of the *reasoning* process. We trust the output without verifying the logic.

### 1.2 The Sentia Solution
Sentia is an **Operating System for Sovereign Agents**, deployed natively on the **Amadeus L1**.
*   **Persistent Existence**: Agents are deployed as **WASM Smart Contracts**. They live on-chain.
*   **Self-Custody**: The Agent Contract itself holds the private keys (via Account Abstraction) and balances of $AMA/$SENT.
*   **Incentivized Swarms**: We introduce "Fork-to-Earn". A successful agent template (Genesis) can be instantiated by thousands of users (Nodes), creating a decentralized swarm that shares revenue.

### 1.3 Concrete Use Cases
*   **Liquid Velocity Snipers (DeFi)**:
    *   *Logic*: A swarm of 1,000 lightweight agents monitoring the mempool.
    *   *Action*: When an opportunity is found, they bid gas ($AMA) to execute the trade.
    *   *Coordination*: The Sentia Protocol aggregates their collective liquidity to execute flash loans.
*   **Constitution-Based DAO Voters (Governance)**:
    *   *Logic*: An agent loaded with a specific "Constitution" (System Prompt).
    *   *Action*: It parses every new governance proposal via LLM, compares it against the constitution, and casts an on-chain vote automatically.
*   **Data-Hungry Analysts**:
    *   *Logic*: An agent that needs real-time Bloomberg data.
    *   *Action*: It autonomously spends its earned $SENT to purchase an Oracle Stream token, unlocking the data feed.

---

## 2. Architecture Diagram & Technical Stack

### 2.1 System Components

The Sentia architecture is a 4-Layer Stack designed for the Amadeus Network.

| Layer | Component | Technology | Role |
| :--- | :--- | :--- | :--- |
| **L4: Application** | **Sentia Studio** | React / TypeScript | The IDE for writing, simulating, and deploying agents. (Implemented in Prototype) |
| **L3: Provenance** | **Thought Stream** | **Arweave / Bundlr** | Permanent storage of reasoning logs (Prompts + CoT). |
| **L2: Intelligence** | **Nova Nodes** | **uPoW / TEE** | Off-chain GPU nodes performing inference. Validated via signature. |
| **L1: Settlement** | **Amadeus VM** | **WASM / AssemblyScript** | On-chain execution, asset custody, and state management. |

### 2.2 Data Flow Cycle (The "Reasoning Loop")

The following describes the lifecycle of a single Agent Transaction:

1.  **Trigger**: The WASM Contract's `run()` function is called (by a Cron job or event).
2.  **Context Assembly**: The Contract gathers on-chain data (Oracle prices, Wallet balance).
3.  **Inference Request**: The Contract constructs a prompt and calls `Nova.inference()`.
    *   *Note*: This pauses L1 execution.
4.  **Off-Chain Compute (uPoW)**: A Nova Node picks up the job.
    *   *Privacy Track*: The job is executed inside an Intel SGX Enclave.
5.  **Provenance Anchor**: The Nova Node bundles the input/output and uploads it to **Arweave**.
    *   *Result*: A Transaction ID (`ar://...`) is returned.
6.  **Callback & Verification**: The Nova Node submits the result + Arweave TXID + Signature back to the L1 Contract.
7.  **Settlement**: The Contract verifies the signature, updates state, and transfers funds based on the LLM's decision.

---

## 3. Prototype Implementation (What We Built)

Our submission includes a fully functional **Web-Based IDE and Simulation Engine** that demonstrates this architecture.

### 3.1 UI/UX Implementation
*   **Agent Marketplace (`AgentMarketplace.tsx`)**:
    *   Demonstrates the "Fork-to-Earn" model. Users select an architecture (e.g., "DeFi Sniper") and deploy a copy.
    *   Visualizes the "Swarm Size" and $SENT Reward APY.
*   **The Studio (`CodeEditor.tsx` & `NovaPanel.tsx`)**:
    *   A Monaco-based code editor allowing users to write **AssemblyScript**.
    *   Integrates a "Nova Configurator" to tune Model Temperature, TopK, and System Prompts.
*   **Economic Dashboard (`TokenomicsPanel.tsx`)**:
    *   Visualizes the dual-token economy ($AMA Gas vs. $SENT Rewards).

### 3.2 Logic Flows
We have built a simulator that mimics the Amadeus Virtual Machine (AVM):
*   **Code Generation**: Uses an LLM to transpile natural language requirements into strict AssemblyScript compatible with `@amadeus/sdk`.
*   **Virtual Execution**: When "Run" is clicked, we simulate the `Nova.inference` call, generating fake latency and creating "Virtual Logs" (`ExecutionLog` type) that show the interaction between Contract, Network, and Arweave.

---

## 4. Amadeus Integration Specifics

### 4.1 Integration with WASM Runtime
*   **Current State**: Sentia generates code compliant with AssemblyScript standards (strict typing).
*   **Future Build**: The final product will include a browser-based WASM compiler (binaryen.js) to compile the `.ts` files into `.wasm` bytecode directly in the browser before deployment.

### 4.2 Integration with uPoW (Useful Proof of Work)
*   **Mechanism**: Sentia acts as the *demand side* for uPoW.
*   **Implementation**: Every time a Sentia agent runs, it generates a "difficulty" score based on the token count. This score is submitted to the Amadeus consensus engine to validate the block, ensuring that block mining serves AI utility.

### 4.3 Integration with Arweave (Bonus Challenge)
*   **Direct Uplink**: We utilize the Arweave HTTP API.
*   **Data Structure**: We define a standard schema called **"Thought Log"**.
*   **Benefit**: This allows external auditors to replay the history of an agent to verify it is not hallucinating or being manipulated.

---

## 5. Tokenomics: The $SENT Standard

The Sentia Protocol introduces a specialized token model to solve the "Agent Utility Problem."

### 5.1 The Circular Model
1.  **Staking ($AMA)**: Users stake the L1 token to secure the hardware node.
2.  **Incentive ($SENT)**: The protocol emits $SENT based on **Agent Activity** (inference volume).
3.  **Consumption ($SENT)**:
    *   Agents must **burn** $SENT to access "Premium Tools" (e.g., Web Search, Twitter API, Proprietary Datasets).
    *   This creates a deflationary sink: The smarter the agents become, the more tools they use, the more $SENT is burned.

### 5.2 Distribution
*   **97.5% to Swarm (Operators)**: Encourages mass deployment of nodes.
*   **2.5% to Architects (Creators)**: Provides a perpetual royalty for writing high-quality agent code.

---

## 6. Tradeoffs & Roadmap

### 6.1 Tradeoffs
*   **Latency vs. Verification**: Waiting for Arweave confirmation adds latency.
    *   *Solution*: We use "Optimistic Execution" for low-stakes trades and "Verified Execution" for high-value transfers.
*   **WASM Complexity**: Writing AssemblyScript is harder than Python.
    *   *Solution*: The Sentia Studio (Prototype) includes an AI Code Generator to bridge this gap.

### 6.2 Development Roadmap
*   **Phase 1 (Prototype - Current)**: UI/UX, Simulation Engine, Code Generation.
*   **Phase 2 (Alpha)**: Integration with Amadeus Testnet RPC, browser-side WASM compilation.
*   **Phase 3 (Beta)**: Launch of the Tooling Registry (Smart Contracts for buying/selling API access).
*   **Phase 4 (Mainnet)**: Full uPoW consensus integration.

---

*Sentia is not just an interface. It is the economic layer that makes Autonomous Agents viable, verifiable, and valuable.*
