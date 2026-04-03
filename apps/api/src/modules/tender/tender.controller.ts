import { Request, Response } from "express";
import { TenderService, createTenderSchema, applyTenderSchema } from "./tender.service";
import { sendCreated, sendSuccess } from "../../utils/response";

export class TenderController {
  static async create(req: Request, res: Response) {
    const data = createTenderSchema.parse(req.body);
    const tender = await TenderService.createTender(req.user!.userId, data);
    return sendCreated(res, tender, "Tender created successfully");
  }

  static async list(req: Request, res: Response) {
    const status = (req.query.status as string) || "OPEN";
    const tenders = await TenderService.listTenders(status);
    return sendSuccess(res, tenders);
  }

  static async apply(req: Request, res: Response) {
    const { tenderId } = req.params;
    const data = applyTenderSchema.parse(req.body);
    const application = await TenderService.applyToTender(tenderId, req.user!.userId, data);
    return sendCreated(res, application, "Application submitted successfully");
  }

  static async getApplications(req: Request, res: Response) {
    const { tenderId } = req.params;
    const applications = await TenderService.getTenderApplications(tenderId, req.user!.userId);
    return sendSuccess(res, applications);
  }

  static async acceptApplication(req: Request, res: Response) {
    const { applicationId } = req.params;
    const result = await TenderService.acceptApplication(applicationId, req.user!.userId);
    return sendSuccess(res, result, "Application accepted and tender awarded");
  }

  static async listMyApplications(req: Request, res: Response) {
    const applications = await TenderService.listMyApplications(req.user!.userId);
    return sendSuccess(res, applications);
  }
}
