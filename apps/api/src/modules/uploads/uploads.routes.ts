/* ========================================================================
   File Upload Service - Handle file uploads for chat
   Supports local storage and Cloudinary integration
   ======================================================================== */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../../middleware/auth.middleware';
import { env } from '../../config/env';

const router = Router();

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), env.UPLOAD_DIR || 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'audio/mpeg',
      'audio/wav',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

/**
 * POST /api/uploads/file
 * Upload a file for chat
 */
router.post(
  '/file',
  authenticateToken,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      });
    } catch (error: any) {
      console.error('File upload error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * POST /api/uploads/image
 * Upload an image with compression info
 */
router.post(
  '/image',
  authenticateToken,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      });
    } catch (error: any) {
      console.error('Image upload error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * DELETE /api/uploads/:filename
 * Delete uploaded file
 */
router.delete('/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error: any) {
    console.error('File deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
