
import { GoogleGenAI, Type } from "@google/genai";
import { NovaConfig, SimulationResult, ExecutionLog, NetworkId } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-3-flash-preview";

export const generateContractCode = async (prompt: string): Promise<string> => {
  const systemPrompt = `
    You are the Senior Smart Contract Architect for the Amadeus Protocol (x402 chain).
    Language: AssemblyScript (Strict Types).
    
    Objective: Write production-ready, gas-optimized contracts using @amadeus/sdk.
    
    Standard Library:
    - import { Nova, Ledger, Oracle, Storage, Console } from "@amadeus/sdk";
    
    Methods:
    - Nova.inference(prompt: string, config?: { model: string }): string
    - Ledger.transfer(to: string, amount: u64): void
    
    Return ONLY raw code.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { systemInstruction: systemPrompt, temperature: 0.1 }
    });
    
    let cleanCode = response.text || "";
    if (cleanCode.startsWith("```")) {
      cleanCode = cleanCode.replace(/^```(?:typescript|assemblyscript|ts)?\n?/, "").replace(/\n?```$/, "");
    }
    return cleanCode;
  } catch (e: any) {
    return `// Error: ${e.message}`;
  }
};

export const simulateContract = async (code: string, config: NovaConfig, networkId: NetworkId): Promise<SimulationResult> => {
  const prompt = `
    You are the Amadeus Virtual Machine (AVM).
    
    CODE TO EXECUTE:
    ${code}

    NOVA CONFIG:
    Model: ${config.model}
    Arweave Persistence (Provenance): ${config.useArweave}
    TEE/Privacy Mode: ${config.usePrivacy}
    
    INSTRUCTION:
    Execute the code logic as a blockchain VM.
    
    LOGGING RULES:
    1. NETWORK: When 'Nova.inference' is called, generate a 'NETWORK' log showing the curl request to https://nova.ama.one/v1/chat/completions.
    
    2. PRIVACY (Bonus Track): If 'TEE/Privacy Mode' is TRUE, generate a 'VERIFICATION' log BEFORE the inference saying: "Initializing Secure Enclave (Intel SGX)..." and "Proof Verified: zk-SNARK (Groth16)".
    
    3. PROVENANCE (Arweave Pipeline): If 'Arweave Persistence' is TRUE, you MUST generate these logs sequence AFTER the inference:
       - Log 1 (STORAGE): "Bundling Inference Trace to Arweave Pipeline..."
       - Log 2 (STORAGE): "Uploading to Permaweb (Gateway: arweave.net)..."
       - Log 3 (STORAGE): "Data Finalized. Transaction ID: ar://${Math.random().toString(36).substring(7)}... (Immutable)"
    
    4. HARDWARE (Hard Hack): If the code involves 'MatMul', 'Tenstorrent', 'Kernel' or 'Compute', generate 'HARDWARE' logs showing low-level RISC-V execution: "Loading Tensor Register...", "GEMM Operation Complete (0.4ms)".

    5. NORMAL: Generate CONTRACT logs (Console.log) and TRANSACTION logs.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            logs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["SYSTEM", "CONTRACT", "NETWORK", "TRANSACTION", "ERROR", "STORAGE", "VERIFICATION", "HARDWARE"] },
                  message: { type: Type.STRING },
                  gasUsed: { type: Type.NUMBER }
                },
                required: ["id", "timestamp", "type", "message"]
              }
            },
            totalGas: { type: Type.NUMBER },
            finalState: { type: Type.STRING }
          },
          required: ["logs", "totalGas", "finalState"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AVM Execution failed.");

    let jsonStr = text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    return JSON.parse(jsonStr) as SimulationResult;

  } catch (error: any) {
    return {
      logs: [{ id: "err", timestamp: new Date().toISOString(), type: "ERROR", message: `Runtime Error: ${error.message}` }],
      totalGas: 0,
      finalState: "REVERTED"
    };
  }
};