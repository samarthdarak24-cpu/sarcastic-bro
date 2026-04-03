/* ========================================================================
   Upload Middleware — Multer config for image/KYC/voice uploads
   ======================================================================== */

import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

// Ensure upload directories exist
const dirs = ["images", "kyc", "voice", "general"];
dirs.forEach((dir) => {
  const fullPath = path.join(env.UPLOAD_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(env.UPLOAD_DIR, "general"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "application/pdf",
    "audio/webm", "audio/mpeg", "audio/wav",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest(`Invalid file type: ${file.mimetype}. Allowed: ${allowedMimes.join(", ")}`));
  }
};

// Base upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.MAX_FILE_SIZE },
});

// Specialized upload middleware for images
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(env.UPLOAD_DIR, "images")),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `img-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const uploadImages = multer({
  storage: imageStorage,
  fileFilter: (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(ApiError.badRequest("Only image files are allowed"));
  },
  limits: { fileSize: env.MAX_FILE_SIZE },
});

// KYC document upload
const kycStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(env.UPLOAD_DIR, "kyc")),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `kyc-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const uploadKYC = multer({
  storage: kycStorage,
  limits: { fileSize: env.MAX_FILE_SIZE },
});

// Voice message upload
const voiceStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(env.UPLOAD_DIR, "voice")),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `voice-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const uploadVoice = multer({
  storage: voiceStorage,
  limits: { fileSize: env.MAX_FILE_SIZE },
});
