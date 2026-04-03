import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import type { CreateContractInput, UpdateContractInput, SignContractInput, ListContractInput } from "./contract.validation";

export class ContractService {
  static async createContract(userId: string, data: CreateContractInput) {
    if (userId !== data.farmerId && userId !== data.buyerId) {
      throw ApiError.forbidden("You can only create contracts as a participant");
    }

    const [farmer, buyer] = await Promise.all([
      prisma.user.findUnique({ where: { id: data.farmerId } }),
      prisma.user.findUnique({ where: { id: data.buyerId } }),
    ]);

    if (!farmer || !buyer) throw ApiError.notFound("One or both users not found");

    const contract = await prisma.contract.create({
      data: {
        contractNumber: `CTR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        farmerId: data.farmerId,
        buyerId: data.buyerId,
        terms: data.terms,
        totalValue: data.totalValue,
        status: "DRAFT",
        isPreBooking: data.isPreBooking || false,
        productName: data.productName || "Agri Product",
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: {
        farmer: { select: { id: true, name: true, email: true } },
        buyer: { select: { id: true, name: true, email: true } },
      },
    });

    await Promise.all([
      prisma.notification.create({
        data: {
          userId: data.farmerId,
          type: "CONTRACT",
          title: "New Contract",
          message: `${buyer.name} created a contract with you`,
          metadata: JSON.stringify({ contractId: contract.id }),
        },
      }),
      prisma.notification.create({
        data: {
          userId: data.buyerId,
          type: "CONTRACT",
          title: "New Contract",
          message: `Contract created with ${farmer.name}`,
          metadata: JSON.stringify({ contractId: contract.id }),
        },
      }),
    ]);

    return contract;
  }

  static async getContractById(userId: string, contractId: string) {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        farmer: { select: { id: true, name: true, email: true, phone: true } },
        buyer: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!contract) throw ApiError.notFound("Contract not found");
    if (userId !== contract.buyerId && userId !== contract.farmerId) {
      throw ApiError.forbidden("You don't have access to this contract");
    }
    return contract;
  }

  static async listContracts(userId: string, filters: ListContractInput) {
    const { page, limit, status, sort, order } = filters;
    const skip = (page - 1) * limit;

    const where: any = { OR: [{ buyerId: userId }, { farmerId: userId }] };
    if (status) where.status = status;
    if (filters.isPreBooking !== undefined) where.isPreBooking = filters.isPreBooking === 'true' || filters.isPreBooking === true;

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          farmer: { select: { id: true, name: true } },
          buyer: { select: { id: true, name: true } },
        },
      }),
      prisma.contract.count({ where }),
    ]);

    return { contracts, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async updateContract(userId: string, contractId: string, data: UpdateContractInput) {
    const contract = await this.getContractById(userId, contractId);
    if (contract.status !== "DRAFT") {
      throw ApiError.badRequest("Can only update contracts in DRAFT status");
    }

    const updated = await prisma.contract.update({
      where: { id: contractId },
      data: {
        ...(data.terms && { terms: data.terms }),
        ...(data.totalValue && { totalValue: data.totalValue }),
        ...(data.expiresAt && { expiresAt: new Date(data.expiresAt) }),
        updatedAt: new Date(),
      },
      include: {
        farmer: { select: { id: true, name: true } },
        buyer: { select: { id: true, name: true } },
      },
    });

    return updated;
  }

  static async signContract(userId: string, contractId: string) {
    const contract = await this.getContractById(userId, contractId);
    
    const isUserFarmer = userId === contract.farmerId;
    const isUserBuyer = userId === contract.buyerId;

    if (!isUserFarmer && !isUserBuyer) {
      throw ApiError.forbidden("You cannot sign this contract");
    }

    const updateData: any = { updatedAt: new Date() };
    if (isUserFarmer) updateData.signedByFarmer = true;
    if (isUserBuyer) updateData.signedByBuyer = true;

    const bothSigned = (contract.signedByFarmer || isUserFarmer) && (contract.signedByBuyer || isUserBuyer);
    if (bothSigned) updateData.status = "ACTIVE";

    const updated = await prisma.contract.update({
      where: { id: contractId },
      data: updateData,
      include: {
        farmer: { select: { id: true, name: true } },
        buyer: { select: { id: true, name: true } },
      },
    });

    const otherUserId = isUserFarmer ? contract.buyerId : contract.farmerId;
    const signerName = isUserFarmer ? contract.farmer?.name : contract.buyer?.name;

    await prisma.notification.create({
      data: {
        userId: otherUserId,
        type: "CONTRACT",
        title: "Contract Signed",
        message: `${signerName} signed the contract`,
        metadata: JSON.stringify({ contractId, action: "SIGNED" }),
      },
    });

    return updated;
  }

  static async deleteContract(userId: string, contractId: string) {
    const contract = await this.getContractById(userId, contractId);
    if (contract.status !== "DRAFT") {
      throw ApiError.badRequest("Can only delete contracts in DRAFT status");
    }

    await prisma.contract.delete({ where: { id: contractId } });
    return { message: "Contract deleted successfully" };
  }
}
