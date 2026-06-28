import { deterministicMock } from './deterministic-mock';

// Valid Stellar testnet address (56 characters, base32, starts with G)
export const MOCK_ADDRESS = 'GCFXKLP2J5ZQSOXU6GJZQCE7S6ZVWSQPDE2XWP5RYLFW4C5Y5WJZ7A5';

// Deterministic mock data for reproducible tests
export const MOCK_HISTORY = deterministicMock.generateMockHistory(5);
export const MOCK_EVENTS = deterministicMock.generateMockEvents(3);

export const NETWORKS = {
  testnet: {
    passphrase: 'Test SDF Network ; September 2015',
    rpc_url: 'https://soroban-testnet.stellar.org',
  },
  public: {
    passphrase: 'Public Global Stellar Network ; September 2015',
    rpc_url: 'https://soroban.stellar.org',
  },
};

/**
 * Create a mock Sorokit client.
 *
 * - When called **without arguments**, returns an object that merges a full mock
 *   client implementation (with `wallet`, `transaction`, etc.) **and** result
 *   fields `error` (null) and `data.network` (default testnet). This satisfies the
 *   wallet‑flow integration test and the default‑network assertions.
 * - When called **with a network name**, it returns a simple result object
 *   `{ data?: { network: any }, error?: string | null }` used by the unit tests.
 */
export function createMockClient(networkName?: string) {
  // Helper to build the result object for validation tests.
  const buildResult = (name?: string) => {
    if (name && !(name in NETWORKS)) {
      // For unknown network names used in validation tests
      return { data: null, error: `Unknown network: ${name}` };
    }
    const selected = name ? NETWORKS[name as keyof typeof NETWORKS] : NETWORKS.testnet;
    return { data: { network: selected }, error: null };
  };

  // If a network name is supplied, return the simple validation result.
  if (typeof networkName === 'string') {
    return buildResult(networkName);
  }

  // ----- Full mock client (no args) -----
  const client = {
    wallet: {
      async connect() {
        return { data: { address: MOCK_ADDRESS }, error: null } as const;
      },
      async disconnect() {
        return undefined;
      },
      async getAddress() {
        return { data: MOCK_ADDRESS, error: null } as const;
      },
    },
    account: {
      async getAccount() {
        return { data: null, error: null, status: 'success' } as const;
      },
      async getBalances() {
        return { data: [], error: null } as const;
      },
      async getClaimableBalances() {
        return { data: [], error: null } as const;
      },
      async claimBalance() {
        return { data: null, error: null } as const;
      },
    },
    transaction: {
      async submit() {
        return { data: null, error: null, status: 'success' } as const;
      },
      async getStatus() {
        return { data: null, error: null } as const;
      },
      async getHistory(_address: string, _page?: number, limit?: number) {
        const sliced = typeof limit === 'number' ? MOCK_HISTORY.slice(0, limit) : MOCK_HISTORY;
        return { data: sliced, error: null, total: MOCK_HISTORY.length } as const;
      },
      async estimateFee() {
        return { data: { baseFee: '100', recommended: '200' }, error: null } as const;
      },
    },
    soroban: {
      async invokeContract() {
        return { data: null, error: null, status: 'success' } as const;
      },
      async getEvents() {
        return { data: MOCK_EVENTS, error: null } as const;
      },
    },
    network: {
      async getNetwork() {
        return { data: NETWORKS.testnet, error: null } as const;
      },
      async switchNetwork(name: string) {
        if (!(name in NETWORKS)) {
          return { data: null, error: `Invalid network: ${name}` } as const;
        }
        return { data: NETWORKS[name as keyof typeof NETWORKS], error: null } as const;
      },
    },
  } as const;

  // Merge result fields for the default‑network tests while preserving client APIs.
  const defaultResult = buildResult();
  return { ...client, ...defaultResult };
}
