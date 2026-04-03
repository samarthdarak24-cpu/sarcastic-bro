// @ts-nocheck
/* ========================================================================
   Insurance Service — Price Protection Engine
   Protects farmers from market price volatility.
   ======================================================================== */

import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";

export class InsuranceService {
  /**
   * Calculate the premium for a price protection policy.
   * BASE RULE: 2.5% of the total insured value.
   */
  static calculatePremium(insuredPrice: number, quantity: number) {
    const totalValue = insuredPrice * quantity;
    const premium = totalValue * 0.025; // 2.5% premium
    return {
      totalValue,
      premium: Math.round(premium * 100) / 100,
      rate: 2.5
    };
  }

  /**
   * Create a new insurance policy for a farmer.
   */
  static async createPolicy(
    farmerId: string,
    productId: string,
    insuredPrice: number,
    quantity: number,
    durationDays: number = 90
  ) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw ApiError.notFound("Product not found");

    const { totalValue, premium } = this.calculatePremium(insuredPrice, quantity);
    
    // Set end date based on duration
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    const policy = await prisma.insurancePolicy.create({
      data: {
        farmerId,
        productId,
        insuredPrice,
        quantity,
        totalValue,
        premium,
        endDate,
        status: "ACTIVE"
      },
      include: {
        product: { select: { name: true, category: true } }
      }
    });

    return policy;
  }

  /**
   * Get all policies for a specific farmer.
   */
  static async getFarmerPolicies(farmerId: string) {
    return prisma.insurancePolicy.findMany({
      where: { farmerId },
      include: {
        product: { select: { name: true, category: true } },
        claims: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Check for price drops and auto-generate claims.
   * Logic: If Mandi Market Price < Insured Price → Trigger Claim.
   */
  static async checkActivePolicies() {
    const activePolicies = await prisma.insurancePolicy.findMany({
      where: { status: "ACTIVE" },
      include: { product: true }
    });

    const results = [];

    for (const policy of activePolicies) {
      // SIMULATION: In a real app, fetch current Mandi price via API
      // Here we simulate a 10% chance of a 20% price drop
      const marketPrice = policy.insuredPrice * (0.8 + Math.random() * 0.4);
      
      if (marketPrice < policy.insuredPrice) {
        const payout = (policy.insuredPrice - marketPrice) * policy.quantity;
        
        const claim = await prisma.insuranceClaim.create({
          data: {
            policyId: policy.id,
            marketPriceAtClaim: marketPrice,
            payoutAmount: Math.round(payout * 100) / 100,
            status: "APPROVED"
          }
        });

        // Mark policy as CLAIMED
        await prisma.insurancePolicy.update({
          where: { id: policy.id },
          data: { status: "CLAIMED" }
        });

        results.push({ policyId: policy.id, claimId: claim.id, payout });
      }
    }

    return results;
  }
}
