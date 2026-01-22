#!/bin/bash

# Spectre Protocol Deployment Script
# Deploys smart contracts to Solana Devnet/Mainnet

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
CLUSTER=${1:-devnet}
KEYPAIR_PATH=${2:-~/.config/solana/id.json}

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Spectre Protocol Deployment${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "Cluster: ${YELLOW}$CLUSTER${NC}"
echo -e "Keypair: ${YELLOW}$KEYPAIR_PATH${NC}"
echo ""

# Verify Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Solana CLI not found. Please install it first.${NC}"
    exit 1
fi

# Verify Anchor CLI is installed
if ! command -v anchor &> /dev/null; then
    echo -e "${RED}❌ Anchor CLI not found. Please install it first.${NC}"
    exit 1
fi

# Set Solana config
echo -e "${YELLOW}⚙️  Configuring Solana CLI...${NC}"
solana config set --url $(solana-keygen pubkey $KEYPAIR_PATH > /dev/null 2>&1 && echo "$CLUSTER" || echo "https://api.$CLUSTER.solana.com")
solana config set --keypair $KEYPAIR_PATH

# Check balance
echo -e "${YELLOW}💰 Checking wallet balance...${NC}"
BALANCE=$(solana balance | awk '{print $1}')
echo -e "Balance: ${GREEN}$BALANCE SOL${NC}"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo -e "${RED}❌ Insufficient balance. Need at least 2 SOL for deployment.${NC}"
    if [ "$CLUSTER" = "devnet" ]; then
        echo -e "${YELLOW}💧 Requesting airdrop...${NC}"
        solana airdrop 2
    fi
    exit 1
fi

# Build the program
echo -e "${YELLOW}🔨 Building program...${NC}"
cd anchor
anchor build

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
anchor test --skip-local-validator

# Deploy to cluster
echo -e "${YELLOW}🚀 Deploying to $CLUSTER...${NC}"
anchor deploy --provider.cluster $CLUSTER

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/vault-keypair.json)
echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Program Details${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "Program ID: ${YELLOW}$PROGRAM_ID${NC}"
echo -e "Cluster: ${YELLOW}$CLUSTER${NC}"
echo -e "Explorer: ${YELLOW}https://explorer.solana.com/address/$PROGRAM_ID?cluster=$CLUSTER${NC}"
echo ""

# Update frontend environment
echo -e "${YELLOW}📝 Updating frontend configuration...${NC}"
cd ..
if [ -f ".env.local" ]; then
    sed -i.bak "s/NEXT_PUBLIC_PROGRAM_ID=.*/NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID/" .env.local
else
    echo "NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID" > .env.local
    echo "NEXT_PUBLIC_SOLANA_RPC_URL=https://api.$CLUSTER.solana.com" >> .env.local
fi

echo -e "${GREEN}✅ Configuration updated!${NC}"
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Next Steps${NC}"
echo -e "${GREEN}================================${NC}"
echo "1. Update lib/spectre-sdk.ts with new Program ID"
echo "2. Run: npm run dev"
echo "3. Connect wallet and test the platform"
echo ""
echo -e "${GREEN}Happy Trading! 🚀${NC}"
