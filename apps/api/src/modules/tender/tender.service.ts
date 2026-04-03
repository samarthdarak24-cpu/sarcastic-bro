import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { z } from "zod";

export const createTenderSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().default("kg"),
  maxPrice: z.number().positive(),
  deadline: z.string().datetime(),
});

export const applyTenderSchema = z.object({
  priceOffer: z.number().positive(),
  message: z.string().optional(),
});

export class TenderService {
  static async createTender(creatorId: string, data: z.infer<typeof createTenderSchema>) {
    return prisma.tender.create({
      data: {
        creatorId,
        title: data.title,
        description: data.description,
        category: data.category,
        quantity: data.quantity,
        unit: data.unit,
        maxPrice: data.maxPrice,
        deadline: new Date(data.deadline),
      },
    });
  }

  static async listTenders(status: string = "OPEN") {
    return prisma.tender.findMany({
      where: { status, deadline: { gt: new Date() } },
      include: { creator: { select: { id: true, name: true, district: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  static async applyToTender(tenderId: string, applicantId: string, data: z.infer<typeof applyTenderSchema>) {
    const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
    if (!tender) throw ApiError.notFound("Tender not found");
    if (tender.creatorId === applicantId) throw ApiError.badRequest("You cannot apply to your own tender");
    if (tender.status !== "OPEN") throw ApiError.badRequest("Tender is no longer open");

    return prisma.tenderApplication.create({
      data: {
        tenderId,
        applicantId,
        priceOffer: data.priceOffer,
        message: data.message,
      },
    });
  }

  static async getTenderApplications(tenderId: string, userId: string) {
    const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
    if (!tender) throw ApiError.notFound("Tender not found");
    if (tender.creatorId !== userId) throw ApiError.forbidden("Access denied");

    return prisma.tenderApplication.findMany({
      where: { tenderId },
      include: { applicant: { select: { id: true, name: true, district: true } } },
      orderBy: { priceOffer: "asc" },
    });
  }

  static async acceptApplication(applicationId: string, userId: string) {
    const application = await prisma.tenderApplication.findUnique({
      where: { id: applicationId },
      include: { tender: true },
    });

    if (!application) throw ApiError.notFound("Application not found");
    if (application.tender.creatorId !== userId) throw ApiError.forbidden("Only the tender creator can accept applications");
    if (application.tender.status !== "OPEN") throw ApiError.badRequest("Tender is no longer open");

    // Accept this application, reject all others, close the tender
    await prisma.$transaction([
      prisma.tenderApplication.update({
        where: { id: applicationId },
        data: { status: "ACCEPTED" },
      }),
      prisma.tenderApplication.updateMany({
        where: { tenderId: application.tenderId, id: { not: applicationId } },
        data: { status: "REJECTED" },
      }),
      prisma.tender.update({
        where: { id: application.tenderId },
        data: { status: "AWARDED" },
      }),
    ]);

    return prisma.tenderApplication.findUnique({
      where: { id: applicationId },
      include: { applicant: { select: { id: true, name: true, district: true } }, tender: true },
    });
  }

  static async listMyApplications(applicantId: string) {
    return prisma.tenderApplication.findMany({
      where: { applicantId },
      include: {
        tender: {
          include: { creator: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
