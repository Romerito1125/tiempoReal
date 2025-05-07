// src/routes/simulationRoutes.ts

import { Router } from "express";
import {
  startSimulationHandler,
  stopSimulationHandler,
  getBusesByRouteHandler,
  getRecorridoHandler,
} from "../controller/simulationController";

const router = Router();

router.post('/inicio', startSimulationHandler);
router.post('/fin', stopSimulationHandler);
router.get('/buses/:idRuta', getBusesByRouteHandler);
router.get("/recorrido/:idruta", getRecorridoHandler);

export default router;
