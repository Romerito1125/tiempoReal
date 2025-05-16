// src/routes/simulationRoutes.ts
import { Router } from "express";
import {
  startSimulationHandler,
  stopSimulationHandler,
  getBusesByRouteHandler,
  getRecorridoHandler,
  getTiempoLlegadaHandler
} from "../controller/simulationController";

const router = Router();

router.post('/inicio', startSimulationHandler);
router.post('/fin', stopSimulationHandler);
router.get('/buses/:idRuta', getBusesByRouteHandler);
router.get("/recorrido/:idruta", getRecorridoHandler);
router.get("/tiempo-llegada/:idestacion", getTiempoLlegadaHandler);

export default router;
