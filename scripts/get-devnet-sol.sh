#!/bin/bash

# SPECTRE Protocol - Get Devnet SOL Script

echo "🚀 SPECTRE Protocol - Devnet SOL Helper"
echo "========================================"
echo ""

# Check if solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found!"
    echo ""
    echo "Please install it first:"
    echo "  sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
    echo ""
    echo "Or use the web faucet:"
    echo "  https://faucet.solana.com/"
    exit 1
fi

echo "Enter your wallet address:"
read WALLET_ADDRESS

if [ -z "$WALLET_ADDRESS" ]; then
    echo "❌ No wallet address provided!"
    exit 1
fi

echo ""
echo "🔄 Requesting 2 SOL from Solana devnet faucet..."
echo ""

solana airdrop 2 $WALLET_ADDRESS --url devnet

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Checking balance..."
    echo ""
    solana balance $WALLET_ADDRESS --url devnet
    echo ""
    echo "🎉 You're ready to create strategies!"
else
    echo ""
    echo "⚠️  Airdrop failed. Try the web faucet:"
    echo "  https://faucet.solana.com/"
fi
