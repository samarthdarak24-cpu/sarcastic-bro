import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface BlockchainTransaction {
  id: string;
  productId: string;
  farmerId: string;
  buyerId: string;
  timestamp: Date;
  hash: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
}

interface SupplyChainRecord {
  id: string;
  productId: string;
  location: string;
  timestamp: Date;
  actor: string;
  action: string;
  blockchainHash: string;
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly blockchainUrl = process.env.BLOCKCHAIN_URL || 'http://localhost:8545';

  async recordTransaction(
    productId: string,
    farmerId: string,
    buyerId: string,
    amount: number
  ): Promise<BlockchainTransaction> {
    try {
      this.logger.log(`Recording blockchain transaction for product: ${productId}`);

      const transaction: BlockchainTransaction = {
        id: `tx-${Date.now()}`,
        productId,
        farmerId,
        buyerId,
        timestamp: new Date(),
        hash: this.generateHash(),
        status: 'PENDING',
      };

      // Send to blockchain
      await this.submitToBlockchain(transaction, amount);

      transaction.status = 'CONFIRMED';
      return transaction;
    } catch (error) {
      this.logger.error(`Blockchain transaction failed: ${error.message}`);
      throw error;
    }
  }

  async trackSupplyChain(productId: string): Promise<SupplyChainRecord[]> {
    try {
      this.logger.log(`Tracking supply chain for product: ${productId}`);

      const records: SupplyChainRecord[] = [
        {
          id: `record-1`,
          productId,
          location: 'Farm',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          actor: 'Farmer',
          action: 'Harvested',
          blockchainHash: this.generateHash(),
        },
        {
          id: `record-2`,
          productId,
          location: 'Warehouse',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          actor: 'Warehouse',
          action: 'Stored',
          blockchainHash: this.generateHash(),
        },
        {
          id: `record-3`,
          productId,
          location: 'In Transit',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          actor: 'Logistics',
          action: 'Shipped',
          blockchainHash: this.generateHash(),
        },
        {
          id: `record-4`,
          productId,
          location: 'Buyer Location',
          timestamp: new Date(),
          actor: 'Buyer',
          action: 'Received',
          blockchainHash: this.generateHash(),
        },
      ];

      return records;
    } catch (error) {
      this.logger.error(`Supply chain tracking failed: ${error.message}`);
      throw error;
    }
  }

  async verifyProductAuthenticity(productId: string): Promise<boolean> {
    try {
      this.logger.log(`Verifying product authenticity: ${productId}`);

      const records = await this.trackSupplyChain(productId);

      // Verify all records are on blockchain
      for (const record of records) {
        const isValid = await this.verifyBlockchainRecord(record.blockchainHash);
        if (!isValid) {
          return false;
        }
      }

      return true;
    } catch (error) {
      this.logger.error(`Product verification failed: ${error.message}`);
      return false;
    }
  }

  async addSupplyChainEvent(
    productId: string,
    location: string,
    actor: string,
    action: string
  ): Promise<SupplyChainRecord> {
    try {
      this.logger.log(`Adding supply chain event for product: ${productId}`);

      const record: SupplyChainRecord = {
        id: `record-${Date.now()}`,
        productId,
        location,
        timestamp: new Date(),
        actor,
        action,
        blockchainHash: this.generateHash(),
      };

      // Record on blockchain
      await this.submitSupplyChainEvent(record);

      return record;
    } catch (error) {
      this.logger.error(`Failed to add supply chain event: ${error.message}`);
      throw error;
    }
  }

  private async submitToBlockchain(transaction: BlockchainTransaction, amount: number): Promise<void> {
    try {
      await axios.post(`${this.blockchainUrl}/api/transactions`, {
        from: transaction.farmerId,
        to: transaction.buyerId,
        amount,
        productId: transaction.productId,
        timestamp: transaction.timestamp,
      });
    } catch (error) {
      this.logger.error(`Failed to submit to blockchain: ${error.message}`);
      throw error;
    }
  }

  private async submitSupplyChainEvent(record: SupplyChainRecord): Promise<void> {
    try {
      await axios.post(`${this.blockchainUrl}/api/supply-chain`, {
        productId: record.productId,
        location: record.location,
        actor: record.actor,
        action: record.action,
        timestamp: record.timestamp,
      });
    } catch (error) {
      this.logger.error(`Failed to submit supply chain event: ${error.message}`);
      throw error;
    }
  }

  private async verifyBlockchainRecord(hash: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.blockchainUrl}/api/verify/${hash}`);
      return response.data.valid === true;
    } catch (error) {
      this.logger.error(`Failed to verify blockchain record: ${error.message}`);
      return false;
    }
  }

  private generateHash(): string {
    return `0x${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
  }

  async getTransactionHistory(productId: string): Promise<BlockchainTransaction[]> {
    try {
      const response = await axios.get(`${this.blockchainUrl}/api/transactions/${productId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get transaction history: ${error.message}`);
      return [];
    }
  }
}
