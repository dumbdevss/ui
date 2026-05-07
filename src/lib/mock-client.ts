/**
 * mock-client.ts
 *
 * Simulates sorokit-core responses for development/demo.
 * Replace with: import { createSorokitClient } from "sorokit-core"
 * when the package is published.
 */

import type {
  SorokitClient,
  Balance,
  AccountData,
  NetworkInfo,
} from "./client";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MOCK_ADDRESS = "GBAMQXTQ7IQKPZXJKZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQ";

const MOCK_BALANCES: Balance[] = [
  { asset: "XLM", balance: "1042.5000000", assetType: "native" },
  {
    asset: "USDC",
    balance: "250.0000000",
    assetType: "credit_alphanum4",
    assetCode: "USDC",
    assetIssuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
  },
  {
    asset: "yXLM",
    balance: "88.1234567",
    assetType: "credit_alphanum4",
    assetCode: "yXLM",
    assetIssuer: "GARDNV3Q7YGT4AKSDF25LT32YSCCW4EV22Y2TV3I2PU2MMXJTEDL5T55",
  },
];

const MOCK_ACCOUNT: AccountData = {
  address: MOCK_ADDRESS,
  sequence: "174792435",
  subentryCount: 3,
};

const NETWORKS: Record<string, NetworkInfo> = {
  testnet: {
    name: "testnet",
    passphrase: "Test SDF Network ; September 2015",
    rpcUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
  },
  mainnet: {
    name: "mainnet",
    passphrase: "Public Global Stellar Network ; September 2015",
    rpcUrl: "https://soroban-mainnet.stellar.org",
    horizonUrl: "https://horizon.stellar.org",
  },
  futurenet: {
    name: "futurenet",
    passphrase: "Test SDF Future Network ; October 2022",
    rpcUrl: "https://rpc-futurenet.stellar.org",
    horizonUrl: "https://horizon-futurenet.stellar.org",
  },
};

let currentNetwork = NETWORKS.testnet;
let connectedAddress: string | null = null;

export function createMockClient(): SorokitClient {
  return {
    wallet: {
      connect: async () => {
        await delay(1200);
        connectedAddress = MOCK_ADDRESS;
        return {
          data: { address: MOCK_ADDRESS },
          error: null,
          status: "success",
        };
      },
      disconnect: async () => {
        await delay(300);
        connectedAddress = null;
      },
      getAddress: async () => {
        return { data: connectedAddress, error: null };
      },
    },

    account: {
      getAccount: async (_address: string) => {
        await delay(600);
        return { data: MOCK_ACCOUNT, error: null, status: "success" };
      },
      getBalances: async (_address: string) => {
        await delay(800);
        return { data: MOCK_BALANCES, error: null };
      },
    },

    transaction: {
      submit: async (_tx: unknown) => {
        await delay(2000);
        const hash = Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16),
        ).join("");
        return {
          data: { hash, ledger: 48291034, successful: true },
          error: null,
          status: "success",
        };
      },
      getStatus: async (_txHash: string) => {
        await delay(400);
        return { data: "success", error: null };
      },
    },

    soroban: {
      invokeContract: async (params) => {
        await delay(1500);
        return {
          data: {
            result: `Invoked ${params.method} on ${params.contractId.slice(0, 12)}...`,
            ledger: 48291035,
            returnValue: "AAAABQAAAAAAAAAAAAAAAAAAAAo=",
          },
          error: null,
          status: "success",
        };
      },
    },

    network: {
      getNetwork: async () => {
        await delay(200);
        return { data: currentNetwork, error: null };
      },
      switchNetwork: async (name) => {
        await delay(600);
        currentNetwork = NETWORKS[name] ?? NETWORKS.testnet;
        return { data: currentNetwork, error: null };
      },
    },
  };
}
