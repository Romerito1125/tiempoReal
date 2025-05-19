import express from "express";
import { planearViajeController } from "../controller/viajeController";

const router = express.Router();
router.post("/planear", planearViajeController);

export default router;
