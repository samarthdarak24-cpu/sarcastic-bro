import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { memoryUpload } from '../../middleware/upload.middleware';
import * as controller from './quality-certificate.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Upload certificate (Farmer/FPO)
router.post('/upload', memoryUpload.single('certificate'), controller.uploadCertificate);

// Get my certificates (uploaded by current user) - MUST be before /:id
router.get('/my/certificates', controller.getMyCertificates);

// Get certificates for a crop
router.get('/crop/:cropId', controller.getCertificatesForCrop);

// Get certificates for an aggregated lot
router.get('/lot/:lotId', controller.getCertificatesForLot);

// Verify certificate (FPO only)
router.post('/verify/:id', controller.verifyCertificate);

// Delete certificate
router.delete('/:id', controller.deleteCertificate);

// Generate AI quality score
router.post('/ai-score', memoryUpload.array('images', 5), controller.generateAIScore);

// Get certificate by ID - MUST be last to avoid conflicts
router.get('/:id', controller.getCertificateById);

export default router;
