import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { env } from "../config/env";

export class PdfService {
  static async generateContractPdf(
    contractData: { contractNumber: string; terms: string; totalValue: number },
    qrCodeDataUri: string,
    hashValue: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const fileName = `contract-${contractData.contractNumber}.pdf`;
        const dirPath = path.join(env.UPLOAD_DIR, "general");
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, fileName);
        
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        
        doc.pipe(stream);
        
        // Header
        doc.fontSize(24).text("ODOP Connect", { align: "center" }).moveDown();
        doc.fontSize(18).text("Smart Procurement Contract", { align: "center" }).moveDown(2);
        
        // Contract Details
        doc.fontSize(12).text(`Contract Number: ${contractData.contractNumber}`);
        doc.text(`Total Value: ₹${contractData.totalValue.toLocaleString("en-IN")}`);
        doc.text(`Date Generated: ${new Date().toLocaleString()}`).moveDown(2);
        
        // Terms
        doc.fontSize(14).text("Contract Terms & Conditions", { underline: true }).moveDown();
        doc.fontSize(10).text(contractData.terms, { align: "justify" }).moveDown(3);
        
        // Hash (Blockchain Proof Mock)
        doc.fontSize(10).text("Cryptographic Hash Verification:", { underline: true });
        doc.font("Courier").text(hashValue).moveDown(2);
        
        // QR Code embedding
        if (qrCodeDataUri) {
          doc.font("Helvetica").text("Scan to Verify:", { align: "center" }).moveDown();
          // Extract base64 image data
          const base64Data = qrCodeDataUri.replace(/^data:image\/(png|jpeg);base64,/, "");
          const imgBuffer = Buffer.from(base64Data, "base64");
          
          doc.image(imgBuffer, (doc.page.width - 150) / 2, doc.y, { fit: [150, 150] });
        }
        
        doc.end();
        
        stream.on("finish", () => {
          resolve(`/uploads/general/${fileName}`);
        });
        
        stream.on("error", (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
