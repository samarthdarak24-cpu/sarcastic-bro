import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import type { CreateSampleRequestInput, UpdateSampleStatusInput, SubmitFeedbackInput, ListSampleInput } from "./sampleRequest.validation";

export class SampleRequestService {
  static async createSampleRequest(userId: string, data: CreateSampleRequestInput) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { farmer: { select: { id: true, name: true, email: true } } },
    });

    if (!product) throw ApiError.notFound("Product not found");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "BUYER") {
      throw ApiError.forbidden("Only buyers can request samples");
    }

    const sampleRequest = await prisma.sampleRequest.create({
      data: {
        sampleNumber: `SAM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: data.productId,
        buyerId: userId,
        farmerId: product.farmerId,
        quantity: data.quantity,
        unit: data.unit,
        deliveryAddress: data.deliveryAddress,
        message: data.message || "",
        status: "PENDING",
      },
      include: {
        product: { select: { name: true } },
        buyer: { select: { id: true, name: true } },
        farmer: { select: { id: true, name: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: product.farmerId,
        type: "TENDER",
        title: "Sample Request Received",
        message: `${user.name} requested a sample of ${product.name}`,
        metadata: JSON.stringify({ sampleRequestId: sampleRequest.id }),
      },
    });

    return sampleRequest;
  }

  static async getSampleRequests(userId: string, filters: ListSampleInput) {
    const { page, limit, status, sort, order } = filters;
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("User not found");

    const where: any = {};
    if (user.role === "FARMER") {
      where.farmerId = userId;
    } else if (user.role === "BUYER") {
      where.buyerId = userId;
    }
    if (status) where.status = status;

    const [samples, total] = await Promise.all([
      prisma.sampleRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          product: { select: { name: true, category: true } },
          buyer: { select: { id: true, name: true, email: true } },
          farmer: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.sampleRequest.count({ where }),
    ]);

    return { samples, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async getSampleRequestById(userId: string, sampleId: string) {
    const sample = await prisma.sampleRequest.findUnique({
      where: { id: sampleId },
      include: {
        product: true,
        buyer: { select: { id: true, name: true, email: true, phone: true } },
        farmer: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!sample) throw ApiError.notFound("Sample request not found");
    if (userId !== sample.buyerId && userId !== sample.farmerId) {
      throw ApiError.forbidden("You don't have access to this sample request");
    }
    return sample;
  }

  static async updateSampleStatus(userId: string, sampleId: string, data: UpdateSampleStatusInput) {
    const sample = await this.getSampleRequestById(userId, sampleId);
    if (userId !== sample.farmerId) {
      throw ApiError.forbidden("Only farmer can update sample status");
    }

    const updated = await prisma.sampleRequest.update({
      where: { id: sampleId },
      data: {
        status: data.status,
        notes: data.notes || sample.notes,
        updatedAt: new Date(),
      },
      include: {
        product: { select: { name: true } },
        buyer: { select: { id: true, name: true } },
        farmer: { select: { id: true, name: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: sample.buyerId,
        type: "TENDER",
        title: `Sample Request ${data.status}`,
        message: `Your sample request is now ${data.status}`,
        metadata: JSON.stringify({ sampleRequestId: sampleId }),
      },
    });

    return updated;
  }

  static async submitFeedback(userId: string, sampleId: string, data: SubmitFeedbackInput) {
    const sample = await this.getSampleRequestById(userId, sampleId);
    if (userId !== sample.buyerId) {
      throw ApiError.forbidden("Only buyer can submit feedback");
    }
    if (sample.status !== "DELIVERED") {
      throw ApiError.badRequest("Can only submit feedback for delivered samples");
    }

    const updated = await prisma.sampleRequest.update({
      where: { id: sampleId },
      data: {
        feedbackRating: data.rating,
        feedbackComment: data.comment,
        feedbackSubmittedAt: new Date(),
      },
      include: {
        product: { select: { name: true } },
        buyer: { select: { id: true, name: true } },
        farmer: { select: { id: true, name: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: sample.farmerId,
        type: "SYSTEM",
        title: "Sample Feedback",
        message: `Feedback received: ${data.rating} stars`,
        metadata: JSON.stringify({ sampleRequestId: sampleId, rating: data.rating }),
      },
    });

    return updated;
  }
}
