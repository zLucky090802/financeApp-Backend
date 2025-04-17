import { Router } from 'express';
import { crearTransaccion, obtenerTransaccionesPorUsuario } from '../controllers/movements';

const router = Router();

router.post('/', crearTransaccion);
router.get('/:usuario_id', obtenerTransaccionesPorUsuario);

export default router;
