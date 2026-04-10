import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendError, sendValidationError } from '../../utils/response';
import { BankDetailsService } from './bank-details.service';

const router = Router();
const bankDetailsService = new BankDetailsService();

/**
 * Get buyer's bank details
 */
router.get('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  
  const bankDetails = await bankDetailsService.getBankDetails(userId);
  
  if (!bankDetails) {
    return sendSuccess(res, null, 'No bank details found');
  }
  
  return sendSuccess(res, bankDetails, 'Bank details retrieved successfully');
}));

/**
 * Add new bank details
 */
router.post('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const {
    accountHolderName,
    accountNumber,
    ifscCode,
    bankName,
    branchName,
    accountType,
    isPrimary,
  } = req.body;

  // Validation
  const errors = [];
  
  if (!accountHolderName?.trim()) {
    errors.push({ field: 'accountHolderName', message: 'Account holder name is required' });
  }
  
  if (!accountNumber?.trim()) {
    errors.push({ field: 'accountNumber', message: 'Account number is required' });
  } else if (!/^\d{9,18}$/.test(accountNumber)) {
    errors.push({ field: 'accountNumber', message: 'Account number must be 9-18 digits' });
  }
  
  if (!ifscCode?.trim()) {
    errors.push({ field: 'ifscCode', message: 'IFSC code is required' });
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
    errors.push({ field: 'ifscCode', message: 'Invalid IFSC code format' });
  }
  
  if (!bankName?.trim()) {
    errors.push({ field: 'bankName', message: 'Bank name is required' });
  }
  
  if (!branchName?.trim()) {
    errors.push({ field: 'branchName', message: 'Branch name is required' });
  }
  
  if (!accountType || !['SAVINGS', 'CURRENT'].includes(accountType)) {
    errors.push({ field: 'accountType', message: 'Invalid account type' });
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors, 'Validation failed');
  }

  // Check if bank details already exist
  const existing = await bankDetailsService.getBankDetails(userId);
  if (existing) {
    return sendError(res, 'Bank details already exist. Use PUT to update.', 400);
  }

  const bankDetails = await bankDetailsService.createBankDetails(userId, {
    accountHolderName,
    accountNumber,
    ifscCode,
    bankName,
    branchName,
    accountType,
    isPrimary: isPrimary ?? true,
  });

  return sendSuccess(res, bankDetails, 'Bank details added successfully', 201);
}));

/**
 * Update existing bank details
 */
router.put('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const {
    accountHolderName,
    accountNumber,
    ifscCode,
    bankName,
    branchName,
    accountType,
    isPrimary,
  } = req.body;

  // Validation
  const errors = [];
  
  if (!accountHolderName?.trim()) {
    errors.push({ field: 'accountHolderName', message: 'Account holder name is required' });
  }
  
  if (!accountNumber?.trim()) {
    errors.push({ field: 'accountNumber', message: 'Account number is required' });
  } else if (!/^\d{9,18}$/.test(accountNumber)) {
    errors.push({ field: 'accountNumber', message: 'Account number must be 9-18 digits' });
  }
  
  if (!ifscCode?.trim()) {
    errors.push({ field: 'ifscCode', message: 'IFSC code is required' });
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
    errors.push({ field: 'ifscCode', message: 'Invalid IFSC code format' });
  }
  
  if (!bankName?.trim()) {
    errors.push({ field: 'bankName', message: 'Bank name is required' });
  }
  
  if (!branchName?.trim()) {
    errors.push({ field: 'branchName', message: 'Branch name is required' });
  }
  
  if (!accountType || !['SAVINGS', 'CURRENT'].includes(accountType)) {
    errors.push({ field: 'accountType', message: 'Invalid account type' });
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors, 'Validation failed');
  }

  const bankDetails = await bankDetailsService.updateBankDetails(userId, {
    accountHolderName,
    accountNumber,
    ifscCode,
    bankName,
    branchName,
    accountType,
    isPrimary: isPrimary ?? true,
  });

  return sendSuccess(res, bankDetails, 'Bank details updated successfully');
}));

/**
 * Delete bank details
 */
router.delete('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  
  await bankDetailsService.deleteBankDetails(userId);
  
  return sendSuccess(res, null, 'Bank details deleted successfully');
}));

/**
 * Verify bank details (admin only - placeholder)
 */
router.post('/verify/:userId', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { isVerified } = req.body;
  
  // TODO: Add admin role check
  
  const bankDetails = await bankDetailsService.verifyBankDetails(userId, isVerified);
  
  return sendSuccess(res, bankDetails, 'Bank details verification status updated');
}));

export default router;
