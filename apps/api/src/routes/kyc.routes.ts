import { Router } from 'express';
import { 
  getKYCProfile, 
  submitKYC, 
  uploadKYCDocuments, 
  verifyKYCAdmin,
  getAllKYCProfiles
} from '../controllers/kyc.controller';
import { authenticate, authorize } from '../middleware/auth';
import { memoryUpload } from '../middleware/upload.middleware';

const router = Router();

// Retrieve current user's KYC profile
router.get('/', authenticate, getKYCProfile);

// Submit KYC details (text fields)
router.post('/submit', authenticate, submitKYC);

// Upload KYC documents (up to 5 files)
router.post('/upload', 
  authenticate, 
  memoryUpload.array('documents', 5), 
  uploadKYCDocuments
);

// Admin / System verification (for prototype simulation)
router.patch('/verify/:userId', authenticate, verifyKYCAdmin);
router.get('/admin/profiles', authenticate, getAllKYCProfiles);

export default router;
