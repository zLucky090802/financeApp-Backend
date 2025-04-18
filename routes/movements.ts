import { Router } from 'express';
import { actualizarTransaccion, crearTransaccion, eliminarTransaccion, obtenerTransaccionesPorUsuario } from '../controllers/movements';

const router = Router();

router.post('/', crearTransaccion);
router.get('/:usuario_id', obtenerTransaccionesPorUsuario);
router.put('/:id', actualizarTransaccion);
router.delete('/:id', eliminarTransaccion);

export default router;
