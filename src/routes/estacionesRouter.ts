import express from "express";
import { listarEstaciones } from "../controller/estacionesController";

const router = express.Router();

router.get("/", listarEstaciones);

export default router;
