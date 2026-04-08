import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
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
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'audio/wav',
      'audio/mpeg',
      'audio/ogg',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

export const chatUploadRouter = Router();

/**
 * Upload file for chat
 * POST /api/chat/upload
 */
chatUploadRouter.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
      uploadedAt: new Date(),
    };

    res.json({
      success: true,
      file: fileInfo,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Upload multiple files for chat
 * POST /api/chat/upload-multiple
 */
chatUploadRouter.post('/upload-multiple', upload.array('files', 10), (req: Request, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = (req.files as Express.Multer.File[]).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
      uploadedAt: new Date(),
    }));

    res.json({
      success: true,
      files: files,
      count: files.length,
      message: 'Files uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to upload files',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Delete uploaded file
 * DELETE /api/chat/upload/:filename
 */
chatUploadRouter.delete('/upload/:filename', (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    // Security check - prevent directory traversal
    if (!filepath.startsWith(uploadDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Failed to delete file',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get file info
 * GET /api/chat/upload/:filename
 */
chatUploadRouter.get('/upload/:filename', (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    // Security check
    if (!filepath.startsWith(uploadDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      res.json({
        filename: filename,
        size: stats.size,
        uploadedAt: stats.birthtime,
        modifiedAt: stats.mtime,
      });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      error: 'Failed to get file info',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
