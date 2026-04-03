import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/**
 * GET /user/profile — Get personal details.
 */
router.get("/profile", authMiddleware, UserController.getProfile);

/**
 * PUT /user/profile — Update personal details.
 */
router.put("/profile", authMiddleware, UserController.updateProfile);

/**
 * POST /user/upload-photo — Upload profile photo.
 */
router.post("/upload-photo", authMiddleware, upload.single("image"), UserController.uploadPhoto);

/**
 * GET /user/reputation/:id — Get reputation score & trust level.
 */
router.get("/reputation/:id", UserController.getReputation);

/**
 * POST /user/reputation/refresh/:id — Force refresh reputation stats.
 */
router.post("/reputation/refresh/:id", authMiddleware, UserController.updateReputation);

export default router;
