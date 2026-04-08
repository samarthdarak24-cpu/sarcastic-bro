/**
 * Chat Routes - ChatGPT-like AI endpoints with file upload support
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ChatController } from './chat.controller';

const router = Router();
const controller = new ChatController();

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
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

/**
 * POST /api/chat
 * Send message with optional file attachments and get AI response
 * 
 * Request body (multipart/form-data):
 * {
 *   "message": "Your question",
 *   "sessionId": "optional-session-id",
 *   "userRole": "farmer|buyer|general",
 *   "file": <binary file data> (optional, can be multiple)
 * }
 * 
 * Response:
 * {
 *   "response": "AI response",
 *   "sessionId": "session-id",
 *   "model": "mistral",
 *   "filesProcessed": 0
 * }
 */
router.post('/', upload.any(), (req, res) => controller.sendMessage(req, res));

/**
 * GET /api/chat/health
 * Check if Ollama is running
 */
router.get('/health', (req, res) => controller.health(req, res));

/**
 * GET /api/chat/history/:sessionId
 * Get conversation history
 */
router.get('/history/:sessionId', (req, res) => controller.getHistory(req, res));

/**
 * DELETE /api/chat/session/:sessionId
 * Clear session
 */
router.delete('/session/:sessionId', (req, res) =>
  controller.clearSession(req, res)
);

export default router;
