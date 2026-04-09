import { Router } from "express";
import { FavoritesController } from "./favorites.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Add farmer to favorites
router.post("/", FavoritesController.addFavorite);

// Get all favorites
router.get("/", FavoritesController.getFavorites);

// Update favorite notes
router.patch("/:farmerId", FavoritesController.updateFavorite);

// Remove from favorites
router.delete("/:farmerId", FavoritesController.removeFavorite);

// Check if favorited
router.get("/check/:farmerId", FavoritesController.checkFavorite);

// Get favorite count (public)
router.get("/count/:farmerId", FavoritesController.getFavoriteCount);

// Get top farmers by favorites (public)
router.get("/top", FavoritesController.getTopFarmers);

export default router;
