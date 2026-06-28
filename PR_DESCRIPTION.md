closes #93, closes #94

# PR Summary

This PR resolves two related issues by fixing responsive behavior in the dashboard UI and completing the library public export surface.

## What changed

### Responsive fixes (Issue #94)
- Updated `src/screens/Dashboard.tsx` to prevent the main content area from collapsing on short viewports by adding `min-h-0` to the flex child container.
- Updated `src/components/TopBar.tsx` to prevent header overflow at 320px by allowing the right-side controls to wrap, keeping `NetworkSwitcher` and `WalletConnectButton` usable on narrow mobile screens.
- Updated `src/components/TransactionHistory.tsx` to ensure pagination buttons meet the 44px touch target minimum on mobile by applying `min-h-[44px]` to the button controls.

### Export API fixes (Issue #93)
- Added missing public exports to `src/components/index.ts`:
  - `AddressDisplay`
  - `AssetPill`
  - `FeeEstimator`
  - `ContractEventFeed`
- Re-exported missing shared type definitions from `src/lib/client.ts` through the public API:
  - `AccountData`
  - `Balance`
  - `Transaction`
  - `ClaimableBalance`
  - `ContractEvent`
  - `NetworkInfo`
  - `InvokeParams`
- Added a smoke test in `src/__tests__/exports.test.ts` verifying the public exports surface and the re-exported types.

## Why these changes were needed

- The dashboard layout previously assumed a tall viewport, causing `flex-1` to collapse on shorter devices such as landscape mobile.
- The `TopBar` header overflowed at the narrowest common mobile viewport because the controls did not wrap.
- Transaction pagination buttons were smaller than the recommended 44px mobile touch target.
- Several components and type definitions were missing from the library's public export surface, preventing consumers from importing them directly from `sorokit-ui`.

## Verification

- The public exports smoke test ensures the API surface remains intact in CI.
- The added responsive changes target the reported mobile breakpoints and touch target sizes.

## Files changed

- `src/screens/Dashboard.tsx`
- `src/components/TopBar.tsx`
- `src/components/TransactionHistory.tsx`
- `src/components/index.ts`
- `src/__tests__/exports.test.ts`
