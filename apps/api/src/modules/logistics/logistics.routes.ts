import { Router } from "express";
import { LogisticsController } from "./logistics.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/overview", LogisticsController.getOverview);
router.get("/warehouses", LogisticsController.getWarehouses);
router.post("/warehouses", LogisticsController.createWarehouse);
router.get("/shipments", LogisticsController.getShipments);
router.patch("/shipments/:id", LogisticsController.updateShipment);
router.get("/market-prices", LogisticsController.getMarketPrices);

export default router;
