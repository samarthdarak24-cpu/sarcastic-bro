import QRCode from "qrcode";

export class QrService {
  /**
   * Generates a QR Code as a Data URI (base64 image)
   * @param data The string payload to encode
   */
  static async generateQrCode(data: string): Promise<string> {
    try {
      const qrDataUri = await QRCode.toDataURL(data, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 300,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      return qrDataUri;
    } catch (error) {
      throw new Error("Failed to generate QR Code");
    }
  }
}
