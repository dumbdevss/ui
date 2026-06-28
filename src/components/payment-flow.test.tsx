import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SorokitProvider } from '../context/SorokitProvider';
import { TransactionPanel } from './TransactionPanel';

// Minimal mock client that satisfies SorokitProvider expectations
const mockClient = {
  wallet: { connect: vi.fn(), disconnect: vi.fn() },
  account: { getAccount: vi.fn(), getBalances: vi.fn() },
  network: { getNetwork: vi.fn(), switchNetwork: vi.fn() },
} as any;

describe('TransactionPanel integration', () => {
  it('renders without throwing', () => {
    render(
      <SorokitProvider client={mockClient}>
        <TransactionPanel />
      </SorokitProvider>
    );
    // If render completes, the test passes
    expect(true).toBeTruthy();
  });
});
