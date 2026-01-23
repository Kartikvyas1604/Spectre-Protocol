# SPECTRE Protocol - Deployment Guide

## Current Status

**Program is NOT deployed to devnet yet.** The errors you're seeing are because the program needs to be deployed first.

## Solution Options

### Option 1: Deploy the Program (Recommended)

The devnet faucet has rate limits. Here are alternative ways to get SOL for deployment:

#### A. Use QuickNode Faucet (No Rate Limit)
1. Go to: https://faucet.quicknode.com/solana/devnet
2. Enter your wallet address: `4ZFbddCv2tsir73522ti3F4Bm8gbfA6ZB8DtPrBvqzrP`
3. Get 5 SOL instantly

#### B. Use SolFaucet (No Rate Limit)
1. Go to: https://solfaucet.com/
2. Select "Devnet"
3. Enter address: `4ZFbddCv2tsir73522ti3F4Bm8gbfA6ZB8DtPrBvqzrP`
4. Get 1 SOL

#### C. Wait for Rate Limit Reset
Wait 1-2 hours and try:
```bash
cd anchor
solana airdrop 2 --url devnet
```

### Then Deploy:
```bash
cd anchor
anchor deploy --provider.cluster devnet
```

---

### Option 2: Use Localnet (Development)

Run a local validator for instant testing:

```bash
# Terminal 1: Start local validator
solana-test-validator

# Terminal 2: Deploy to localnet
cd anchor
anchor deploy --provider.cluster localnet

# Terminal 3: Update RPC in your app
# Change endpoint in lib/spectre-sdk.ts or use env var
```

Update your app to connect to localnet:
```typescript
// In components or wherever you initialize connection
const endpoint = 'http://localhost:8899'; // Localnet
```

---

### Option 3: Use Existing Devnet Program (Quick Test)

If you just want to test the UI without deploying, you can connect to an existing program or wait for the deployment.

---

## After Deployment

Once deployed, the program will be available at:
- **Program ID**: `4mog8e82CLaqu6YxuSgoyZQsnLWHhTLR9aQvPHg8sXfk`
- **Network**: Devnet
- **Cluster**: https://api.devnet.solana.com

Your app will work automatically once the program is deployed!

## Current Build Status

✅ Program compiled successfully: `vault.so` (288KB)  
✅ Program ID matches in all files: `4mog8e82CLaqu6YxuSgoyZQsnLWHhTLR9aQvPHg8sXfk`  
✅ IDL generated correctly  
⏳ Waiting for deployment (need more devnet SOL)

## Deployment Requirements

- **Cost**: ~2.5 SOL (one-time deployment fee)
- **Current Balance**: 2.00 SOL
- **Needed**: 0.5 SOL more

## Next Steps

1. Get SOL from alternative faucet (QuickNode or SolFaucet)
2. Run: `cd anchor && anchor deploy --provider.cluster devnet`
3. Test your app!

---

**Note**: The TypeScript compile errors are now fixed:
- ✅ Fixed `refresh` → `refreshPositions` 
- ✅ Added wallet rejection error handling
- ✅ Added program not found error message
