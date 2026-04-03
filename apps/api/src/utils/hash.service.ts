import { createHash } from "crypto";

export class HashService {
  /**
   * Generates a SHA-256 cryptographic hash from a string
   */
  static generateSHA256(data: string): string {
    return createHash("sha256").update(data).digest("hex");
  }

  /**
   * Mocks a Blockchain Transaction Verification Hash for Contracts
   */
  static generateContractBlockchainHash(contractId: string, terms: string): string {
    const payload = `${contractId}-${terms}-${Date.now()}`;
    return `0x${this.generateSHA256(payload)}`;
  }
}
