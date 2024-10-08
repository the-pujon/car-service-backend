"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotRoutes = void 0;
const express_1 = require("express");
const slot_controller_1 = require("./slot.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)("admin"), slot_controller_1.SlotControllers.createSlotController);
router.get("/availability", slot_controller_1.SlotControllers.getSlotController);
router.get("/:id", slot_controller_1.SlotControllers.getSlotByIdController);
router.patch("/:id", (0, auth_1.auth)("admin"), slot_controller_1.SlotControllers.updateSlotStatusController);
exports.SlotRoutes = router;
