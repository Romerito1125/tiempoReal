import { Router } from 'express';
import {
  getAllRutas,
  getRutaById,
  createRuta,
  updateRuta,
  deleteRuta
} from '../controller/rutasController';

const router = Router();

router.get('/', getAllRutas);
router.get('/:idruta', getRutaById);
router.post('/', createRuta);
router.put('/:idruta', updateRuta);
router.delete('/:idruta', deleteRuta);

export default router;
