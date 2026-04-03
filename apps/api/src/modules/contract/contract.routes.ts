import { Router } from "express";
import { ContractController } from "./contract.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

/* Contract Endpoints */
router.post("/", asyncHandler(ContractController.createContract));
router.get("/", asyncHandler(ContractController.listContracts));
router.get("/:id", asyncHandler(ContractController.getContractById));
router.put("/:id", asyncHandler(ContractController.updateContract));
router.put("/:id/sign", asyncHandler(ContractController.signContract));
router.delete("/:id", asyncHandler(ContractController.deleteContract));

export default router;
