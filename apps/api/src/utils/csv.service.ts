import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { env } from "../config/env";

export class CsvService {
  static async exportToCsv(
    data: any[],
    headers: { id: string; title: string }[],
    prefix: string = "export"
  ): Promise<string> {
    const fileName = `${prefix}-${crypto.randomUUID()}.csv`;
    const dirPath = path.join(env.UPLOAD_DIR, "general");

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, fileName);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: headers,
    });

    await csvWriter.writeRecords(data);
    return `/uploads/general/${fileName}`;
  }

  static getOrderHeaders() {
    return [
      { id: "id", title: "ORDER_ID" },
      { id: "orderNumber", title: "ORDER_NUMBER" },
      { id: "quantity", title: "QUANTITY" },
      { id: "totalPrice", title: "TOTAL_PRICE" },
      { id: "status", title: "STATUS" },
      { id: "createdAt", title: "CREATED_AT" },
    ];
  }

  static getProductHeaders() {
    return [
      { id: "id", title: "PRODUCT_ID" },
      { id: "name", title: "NAME" },
      { id: "category", title: "CATEGORY" },
      { id: "price", title: "PRICE" },
      { id: "quantity", title: "STOCK" },
      { id: "isActive", title: "IS_ACTIVE" },
      { id: "createdAt", title: "CREATED_AT" },
    ];
  }
}
