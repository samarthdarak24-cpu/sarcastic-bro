import type { Request, Response } from "express";
import { SampleRequestService } from "./sampleRequest.service";
import {
  createSampleRequestSchema,
  updateSampleStatusSchema,
  submitFeedbackSchema,
  listSampleSchema,
} from "./sampleRequest.validation";
import { sendCreated, sendSuccess, sendPaginated } from "../../utils/response";

export class SampleRequestController {
  static async createSampleRequest(req: Request, res: Response) {
    const data = createSampleRequestSchema.parse(req.body);
    const sample = await SampleRequestService.createSampleRequest(req.user!.userId, data);
    return sendCreated(res, sample, "Sample request created successfully");
  }

  static async getSampleRequests(req: Request, res: Response) {
    const filters = listSampleSchema.parse(req.query);
    const { samples, pagination } = await SampleRequestService.getSampleRequests(req.user!.userId, filters);
    return sendPaginated(res, samples, pagination.total, pagination.page, pagination.limit);
  }

  static async getSampleRequestById(req: Request, res: Response) {
    const sample = await SampleRequestService.getSampleRequestById(req.user!.userId, req.params.id);
    return sendSuccess(res, sample, "Sample request retrieved");
  }

  static async updateSampleStatus(req: Request, res: Response) {
    const data = updateSampleStatusSchema.parse(req.body);
    const sample = await SampleRequestService.updateSampleStatus(req.user!.userId, req.params.id, data);
    return sendSuccess(res, sample, "Sample status updated successfully");
  }

  static async submitFeedback(req: Request, res: Response) {
    const data = submitFeedbackSchema.parse(req.body);
    const sample = await SampleRequestService.submitFeedback(req.user!.userId, req.params.id, data);
    return sendSuccess(res, sample, "Feedback submitted successfully");
  }
}
