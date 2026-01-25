/**
 * Integration Tests for Privacy Payments
 * 
 * Tests the end-to-end flow of confidential transfers:
 * 1. Initialize confidential account
 * 2. Deposit funds
 * 3. Send private payment
 * 4. Withdraw funds
 */

import { describe, test, expect, beforeAll } from '@jest/globals';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Confidential } from '../lib/confidential';
import { SpectrePaymentSDK } from '../lib/payment-sdk';

describe('Privacy Payments Integration Tests', () => {
  let connection: Connection;
  let payer: Keypair;
  let recipient: Keypair;
  let mint: PublicKey;

  beforeAll(async () => {
    // Connect to local validator or devnet
    connection = new Connection('http://localhost:8899', 'confirmed');
    
    // Create test wallets
    payer = Keypair.generate();
    recipient = Keypair.generate();
    
    // Airdrop SOL for fees
    const airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      2_000_000_000 // 2 SOL
    );
    await connection.confirmTransaction(airdropSignature);
    
    console.log('✅ Test wallets created and funded');
  });

  describe('ElGamal Encryption', () => {
    test('should generate valid ElGamal keypair', async () => {
      const keypair = await Confidential.generateKeypair();
      
      expect(keypair.publicKey).toBeInstanceOf(Uint8Array);
      expect(keypair.privateKey).toBeInstanceOf(Uint8Array);
      expect(keypair.publicKey.length).toBe(32);
      expect(keypair.privateKey.length).toBe(32);
    });

    test('should encrypt and decrypt amount correctly', () => {
      const testAmount = 1000;
      const keypair = {
        publicKey: new Uint8Array(32),
        privateKey: new Uint8Array(32),
      };
      
      // Fill with test data
      for (let i = 0; i < 32; i++) {
        keypair.privateKey[i] = i;
        keypair.publicKey[i] = (i * 7 + 13) % 256;
      }

      const encrypted = Confidential.encryptAmount(testAmount, keypair.publicKey);
      expect(encrypted.length).toBe(64);

      const decrypted = Confidential.decryptBalance(encrypted, keypair.privateKey);
      expect(decrypted).toBe(testAmount);
    });

    test('should generate valid range proof', () => {
      const amount = 500;
      const balance = 1000;
      const privateKey = new Uint8Array(32);
      
      const proof = Confidential.generateRangeProof(amount, balance, privateKey);
      
      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toBe(256);
      expect(Confidential.verifyRangeProof(proof)).toBe(true);
    });

    test('should reject invalid range proof for insufficient balance', () => {
      const amount = 1500; // More than balance
      const balance = 1000;
      const privateKey = new Uint8Array(32);
      
      expect(() => {
        Confidential.generateRangeProof(amount, balance, privateKey);
      }).toThrow('Insufficient balance');
    });
  });

  describe('Key Management', () => {
    test('should store and retrieve private key', () => {
      const testWallet = Keypair.generate();
      const privateKey = new Uint8Array(32);
      crypto.getRandomValues(privateKey);

      Confidential.storePrivateKey(testWallet.publicKey, privateKey);
      
      const retrieved = Confidential.retrievePrivateKey(testWallet.publicKey);
      expect(retrieved).toEqual(privateKey);
    });

    test('should return null for non-existent private key', () => {
      const testWallet = Keypair.generate();
      const retrieved = Confidential.retrievePrivateKey(testWallet.publicKey);
      expect(retrieved).toBeNull();
    });

    test('should check if user has ElGamal keypair', () => {
      const testWallet = Keypair.generate();
      
      expect(Confidential.hasKeypair(testWallet.publicKey)).toBe(false);
      
      const privateKey = new Uint8Array(32);
      Confidential.storePrivateKey(testWallet.publicKey, privateKey);
      
      expect(Confidential.hasKeypair(testWallet.publicKey)).toBe(true);
    });
  });

  describe('Payment SDK', () => {
    test('should create SDK instance', () => {
      const mockWallet = {
        publicKey: payer.publicKey,
        signTransaction: async (tx: any) => tx,
        signAllTransactions: async (txs: any[]) => txs,
      };

      const sdk = new SpectrePaymentSDK(connection, mockWallet as any);
      expect(sdk).toBeInstanceOf(SpectrePaymentSDK);
    });

    // Note: Full integration tests would require:
    // - Deployed program on localnet/devnet
    // - Confidential mint initialized
    // - Token accounts created
    // These tests are placeholders showing the test structure

    test.skip('should initialize confidential account', async () => {
      // TODO: Implement once program is deployed
    });

    test.skip('should deposit confidential funds', async () => {
      // TODO: Implement once program is deployed
    });

    test.skip('should transfer confidential payment', async () => {
      // TODO: Implement once program is deployed
    });

    test.skip('should withdraw confidential funds', async () => {
      // TODO: Implement once program is deployed
    });
  });

  describe('Balance Formatting', () => {
    test('should format encrypted balance when decrypted', () => {
      const encrypted = {
        ciphertext: new Uint8Array(64),
        decryptedAmount: 1500.50,
      };

      const formatted = Confidential.formatBalance(encrypted);
      expect(formatted).toBe('1,500.5 USDC');
    });

    test('should format encrypted balance when not decrypted', () => {
      const encrypted = {
        ciphertext: new Uint8Array(64),
        decryptedAmount: null,
      };

      const formatted = Confidential.formatBalance(encrypted);
      expect(formatted).toBe('████████ USDC (encrypted)');
    });
  });
});

// Export for test runner
export {};
