import { Router } from 'express';
import multer from 'multer';
import { WhisperController } from './whisper.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Configure multer for memory storage (we'll forward to Python service)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    const allowedMimeTypes = [
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/mpeg',
      'audio/mp3',
      'audio/webm',
      'audio/ogg',
      'audio/x-m4a',
      'audio/mp4'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

/**
 * @route   POST /api/whisper/transcribe
 * @desc    Transcribe complete audio file
 * @access  Private
 */
router.post(
  '/transcribe',
  authMiddleware,
  upload.single('file'),
  WhisperController.transcribeAudio
);

/**
 * @route   POST /api/whisper/transcribe-chunk
 * @desc    Transcribe audio chunk for streaming
 * @access  Private
 */
router.post(
  '/transcribe-chunk',
  authMiddleware,
  upload.single('audio_chunk'),
  WhisperController.transcribeChunk
);

/**
 * @route   POST /api/whisper/detect-language
 * @desc    Detect language from audio
 * @access  Private
 */
router.post(
  '/detect-language',
  authMiddleware,
  upload.single('file'),
  WhisperController.detectLanguage
);

/**
 * @route   GET /api/whisper/health
 * @desc    Check Whisper service health
 * @access  Public
 */
router.get(
  '/health',
  WhisperController.getHealthStatus
);

export default router;
