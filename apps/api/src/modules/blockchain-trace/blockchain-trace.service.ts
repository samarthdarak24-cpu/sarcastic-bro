import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainTraceService {
  private prisma: PrismaClient;
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.prisma = new PrismaClient();
    this.initializeBlockchain();
  }

  private initializeBlockchain() {
    const rpcUrl = process.env.ETHEREUM_RPC_URL || 'http://localhost:8545';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async createSupplyChainRecord(data: {
    productId: string;
    farmerId: string;
    cropType: string;
    quantity: number;
    harvestDate: Date;
    location: { lat: number; lng: number };
  }) {
    const txHash = await this.recordOnBlockchain({
      productId: data.productId,
      event: 'HARVEST',
      timestamp: new Date(),
      location: data.location,
      metadata: {
        cropType: data.cropType,
        quantity: data.quantity,
        harvestDate: data.harvestDate,
      },
    });

    return {
      id: `trace_${Date.now()}`,
      productId: data.productId,
      farmerId: data.farmerId,
      txHash,
      status: 'RECORDED',
      createdAt: new Date(),
    };
  }

  async updateSupplyChainEvent(data: {
    productId: string;
    event: 'STORAGE' | 'TRANSPORT' | 'DELIVERY' | 'RECEIVED';
    location: { lat: number; lng: number };
    metadata?: Record<string, any>;
  }) {
    const txHash = await this.recordOnBlockchain({
      productId: data.productId,
      event: data.event,
      timestamp: new Date(),
      location: data.location,
      metadata: data.metadata,
    });

    return {
      event: data.event,
      txHash,
      timestamp: new Date(),
      verified: true,
    };
  }

  async getSupplyChainHistory(productId: string) {
    const records = await this.prisma.blockchainTrace.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });

    return records.map((record) => ({
      event: record.event,
      timestamp: record.createdAt,
      location: record.location,
      txHash: record.txHash,
      verified: true,
    }));
  }

  async verifyProductAuthenticity(productId: string): Promise<{
    isAuthentic: boolean;
    verificationScore: number;
    events: any[];
  }> {
    const history = await this.getSupplyChainHistory(productId);

    const verificationScore = Math.min(100, history.length * 20);

    return {
      isAuthentic: verificationScore >= 60,
      verificationScore,
      events: history,
    };
  }

  private async recordOnBlockchain(data: {
    productId: string;
    event: string;
    timestamp: Date;
    location: { lat: number; lng: number };
    metadata?: Record<string, any>;
  }) {
    // Simulate blockchain recording
    const txHash = `0x${Math.random().toString(16).slice(2)}`;

    await this.prisma.blockchainTrace.create({
      data: {
        productId: data.productId,
        event: data.event,
        txHash,
        location: data.location,
        metadata: data.metadata,
      },
    });

    return txHash;
  }
}
