import { Router } from "express";
import { SlotControllers } from "./slot.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth("admin"), SlotControllers.createSlotController);

router.get("/availability", SlotControllers.getSlotController);

router.get("/:id", SlotControllers.getSlotByIdController);

router.patch("/:id", auth("admin"), SlotControllers.updateSlotStatusController);

export const SlotRoutes = router;
