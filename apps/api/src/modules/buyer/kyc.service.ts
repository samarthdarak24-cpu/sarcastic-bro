import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class KYCService {
  async getKYCStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gst: true,
        kycVerified: true,
        bankAccount: true,
        ifsc: true,
        bankName: true
      }
    });

    if (!user) throw new Error('User not found');

    return {
      verified: user.kycVerified,
      gst: user.gst,
      bankAccount: user.bankAccount ? `****${user.bankAccount.slice(-4)}` : null,
      ifsc: user.ifsc,
      bankName: user.bankName,
      completionPercentage: this.calculateCompletionPercentage(user)
    };
  }

  async submitKYC(userId: string, data: {
    gst: string;
    companyName?: string;
    companyAddress?: string;
    bankAccount: string;
    ifsc: string;
    bankName: string;
  }) {
    // Validate GST format
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(data.gst)) {
      throw new Error('Invalid GST format');
    }

    // Validate IFSC format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(data.ifsc)) {
      throw new Error('Invalid IFSC code');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        gst: data.gst,
        bankAccount: data.bankAccount,
        ifsc: data.ifsc,
        bankName: data.bankName,
        kycVerified: true // Auto-verify for now, can add manual verification later
      }
    });

    return {
      verified: updatedUser.kycVerified,
      message: 'KYC details submitted and verified successfully'
    };
  }

  async verifyGST(gst: string) {
    // Mock GST verification - In production, integrate with GST API
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    
    if (!gstRegex.test(gst)) {
      return {
        valid: false,
        message: 'Invalid GST format'
      };
    }

    // Mock company details
    return {
      valid: true,
      gst,
      companyName: 'Sample Company Pvt Ltd',
      registeredAddress: 'Mumbai, Maharashtra',
      status: 'Active',
      registrationDate: '2020-01-15'
    };
  }

  private calculateCompletionPercentage(user: any): number {
    let completed = 0;
    const total = 5;

    if (user.gst) completed++;
    if (user.bankAccount) completed++;
    if (user.ifsc) completed++;
    if (user.bankName) completed++;
    if (user.email) completed++;

    return Math.round((completed / total) * 100);
  }
}
