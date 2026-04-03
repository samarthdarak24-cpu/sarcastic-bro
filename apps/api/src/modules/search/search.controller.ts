import { Request, Response } from "express";
import { SearchService } from "./search.service";
import { sendSuccess } from "../../utils/response";
import { z } from "zod";

const searchQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  district: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export class SearchController {
  static async search(req: Request, res: Response) {
    const filters = searchQuerySchema.parse(req.query);
    const { q, ...restFilters } = filters;

    const results = await SearchService.searchProducts(q || "", restFilters);
    return sendSuccess(res, results, "Elasticsearch Query Successful");
  }
}
