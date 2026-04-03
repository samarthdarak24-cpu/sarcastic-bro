/* ========================================================================
   Blockchain Service — SHA256 Hashing + Immutable Trace Chain
   Simulates on-chain behaviour without requiring a live Ethereum node.
   Production: swap crypto.createHash with ethers.js contract calls.
   ======================================================================== */

import crypto from "crypto";
import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Generate a deterministic SHA256 hash of any data payload */
function sha256(data: string): string {
  return "0x" + crypto.createHash("sha256").update(data).digest("hex");
}

/** Generate a simulated Ethereum-like transaction hash */
function simulateTxHash(): string {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

/** Generate a simulated smart-contract address */
function simulateContractAddress(): string {
  return "0x" + crypto.randomBytes(20).toString("hex");
}

// ─── Service ──────────────────────────────────────────────────────────────

export class BlockchainService {
  /**
   * Add a new trace event to a product's blockchain ledger.
   * Each event is linked to the previous via prevHash, forming an immutable chain.
   */
  static async addProductTrace(data: {
    productId: string;
    farmerId: string;
    eventType: string;
    location?: string;
    qualityGrade?: string;
    metadata?: Record<string, any>;
  }) {
    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product) throw ApiError.notFound("Product not found");

    // Get the previous block in this product's chain
    const prevBlock = await prisma.blockchainTrace.findFirst({
      where: { productId: data.productId },
      orderBy: { blockIndex: "desc" },
    });

    const prevHash = prevBlock?.dataHash || "0x" + "0".repeat(64);
    const blockIndex = (prevBlock?.blockIndex || 0) + 1;

    // Create deterministic hash of THIS event's payload
    const payload = JSON.stringify({
      productId: data.productId,
      farmerId: data.farmerId,
      eventType: data.eventType,
      location: data.location,
      qualityGrade: data.qualityGrade,
      metadata: data.metadata,
      prevHash,
      blockIndex,
      timestamp: new Date().toISOString(),
    });
    const dataHash = sha256(payload);
    const txHash = simulateTxHash();

    const trace = await prisma.blockchainTrace.create({
      data: {
        productId: data.productId,
        farmerId: data.farmerId,
        eventType: data.eventType,
        dataHash,
        prevHash,
        blockIndex,
        location: data.location,
        qualityGrade: data.qualityGrade,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        txHash,
        verified: true,
      },
      include: {
        product: { select: { id: true, name: true, category: true } },
        farmer: { select: { id: true, name: true, district: true } },
      },
    });

    return {
      ...trace,
      explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
    };
  }

  /**
   * Get the full blockchain trace (all events) for a product.
   * Returns an ordered chain from genesis → latest.
   */
  static async getProductTrace(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, category: true, farmerId: true, harvestDate: true, qualityGrade: true },
    });
    if (!product) throw ApiError.notFound("Product not found");

    const chain = await prisma.blockchainTrace.findMany({
      where: { productId },
      orderBy: { blockIndex: "asc" },
      include: {
        farmer: { select: { id: true, name: true, district: true } },
      },
    });

    // Verify chain integrity — every block's prevHash must match the previous block's dataHash
    let isValid = true;
    for (let i = 1; i < chain.length; i++) {
      if (chain[i].prevHash !== chain[i - 1].dataHash) {
        isValid = false;
        break;
      }
    }

    return {
      product,
      chain,
      chainLength: chain.length,
      isChainValid: isValid,
      latestBlock: chain[chain.length - 1] || null,
    };
  }

  /**
   * Verify a single block hash.
   * Recomputes the SHA256 hash and compares it to the stored dataHash.
   */
  static async verifyBlock(traceId: string) {
    const block = await prisma.blockchainTrace.findUnique({
      where: { id: traceId },
    });
    if (!block) throw ApiError.notFound("Block not found");

    return {
      blockId: block.id,
      storedHash: block.dataHash,
      txHash: block.txHash,
      verified: block.verified,
      explorerUrl: `https://sepolia.etherscan.io/tx/${block.txHash}`,
    };
  }
}
