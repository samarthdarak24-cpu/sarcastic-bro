import prisma from '../../prisma/client';

interface BankDetailsInput {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: 'SAVINGS' | 'CURRENT';
  isPrimary: boolean;
}

export class BankDetailsService {
  /**
   * Get bank details for a user
   */
  async getBankDetails(userId: string) {
    const bankDetails = await prisma.bankDetails.findFirst({
      where: { userId },
      select: {
        id: true,
        accountHolderName: true,
        accountNumber: true,
        ifscCode: true,
        bankName: true,
        branchName: true,
        accountType: true,
        isVerified: true,
        isPrimary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return bankDetails;
  }

  /**
   * Create new bank details
   */
  async createBankDetails(userId: string, data: BankDetailsInput) {
    // Encrypt account number before storing (in production, use proper encryption)
    const encryptedAccountNumber = this.encryptAccountNumber(data.accountNumber);

    const bankDetails = await prisma.bankDetails.create({
      data: {
        userId,
        accountHolderName: data.accountHolderName,
        accountNumber: encryptedAccountNumber,
        ifscCode: data.ifscCode.toUpperCase(),
        bankName: data.bankName,
        branchName: data.branchName,
        accountType: data.accountType,
        isPrimary: data.isPrimary,
        isVerified: false,
      },
      select: {
        id: true,
        accountHolderName: true,
        accountNumber: true,
        ifscCode: true,
        bankName: true,
        branchName: true,
        accountType: true,
        isVerified: true,
        isPrimary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Decrypt for response
    return {
      ...bankDetails,
      accountNumber: this.decryptAccountNumber(bankDetails.accountNumber),
    };
  }

  /**
   * Update existing bank details
   */
  async updateBankDetails(userId: string, data: BankDetailsInput) {
    const existing = await prisma.bankDetails.findFirst({
      where: { userId },
    });

    if (!existing) {
      throw new Error('Bank details not found');
    }

    // Encrypt account number before storing
    const encryptedAccountNumber = this.encryptAccountNumber(data.accountNumber);

    const bankDetails = await prisma.bankDetails.update({
      where: { id: existing.id },
      data: {
        accountHolderName: data.accountHolderName,
        accountNumber: encryptedAccountNumber,
        ifscCode: data.ifscCode.toUpperCase(),
        bankName: data.bankName,
        branchName: data.branchName,
        accountType: data.accountType,
        isPrimary: data.isPrimary,
        // Reset verification when details are updated
        isVerified: false,
      },
      select: {
        id: true,
        accountHolderName: true,
        accountNumber: true,
        ifscCode: true,
        bankName: true,
        branchName: true,
        accountType: true,
        isVerified: true,
        isPrimary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Decrypt for response
    return {
      ...bankDetails,
      accountNumber: this.decryptAccountNumber(bankDetails.accountNumber),
    };
  }

  /**
   * Delete bank details
   */
  async deleteBankDetails(userId: string) {
    const existing = await prisma.bankDetails.findFirst({
      where: { userId },
    });

    if (!existing) {
      throw new Error('Bank details not found');
    }

    await prisma.bankDetails.delete({
      where: { id: existing.id },
    });

    return true;
  }

  /**
   * Verify bank details (admin function)
   */
  async verifyBankDetails(userId: string, isVerified: boolean) {
    const existing = await prisma.bankDetails.findFirst({
      where: { userId },
    });

    if (!existing) {
      throw new Error('Bank details not found');
    }

    const bankDetails = await prisma.bankDetails.update({
      where: { id: existing.id },
      data: {
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
      },
      select: {
        id: true,
        accountHolderName: true,
        accountNumber: true,
        ifscCode: true,
        bankName: true,
        branchName: true,
        accountType: true,
        isVerified: true,
        isPrimary: true,
        verifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Decrypt for response
    return {
      ...bankDetails,
      accountNumber: this.decryptAccountNumber(bankDetails.accountNumber),
    };
  }

  /**
   * Simple encryption (use proper encryption library in production)
   */
  private encryptAccountNumber(accountNumber: string): string {
    // In production, use crypto library with proper encryption
    // This is a placeholder - DO NOT use in production
    return Buffer.from(accountNumber).toString('base64');
  }

  /**
   * Simple decryption (use proper decryption library in production)
   */
  private decryptAccountNumber(encryptedAccountNumber: string): string {
    // In production, use crypto library with proper decryption
    // This is a placeholder - DO NOT use in production
    try {
      return Buffer.from(encryptedAccountNumber, 'base64').toString('utf-8');
    } catch {
      return encryptedAccountNumber;
    }
  }
}
