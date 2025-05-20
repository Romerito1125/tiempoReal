import express from "express";
import { listarEstaciones, getEstacionById  } from "../controller/estacionesController";

const router = express.Router();

router.get("/", listarEstaciones);
router.get("/:id", getEstacionById);

export default router;
