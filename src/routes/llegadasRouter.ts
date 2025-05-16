import { Router } from "express";
import { getLlegadasGeneralesHandler } from "../controller/llegadasController";

const router = Router();

router.get("/llegadas", getLlegadasGeneralesHandler);

export default router;
