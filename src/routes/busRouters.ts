import { Router } from 'express';
import { getBuses, getBusById, getBusesByRuta } from '../controller/busController';

const router = Router();

router.get('/buses', getBuses);                      // Todos los buses
router.get('/buses/:id', getBusById);               // Bus por ID
router.get('/rutas/:idRuta/buses', getBusesByRuta); // Buses por ruta

export default router;
