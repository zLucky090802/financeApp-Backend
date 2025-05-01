import { Router } from 'express';
import { actualizarTransaccion, crearTransaccion, eliminarTransaccion, getBalance, obtenerTransaccionesPorUsuario } from '../controllers/movements';

const router = Router();

router.post('/', crearTransaccion);
router.get('/:usuario_id', obtenerTransaccionesPorUsuario);
router.put('/:id', actualizarTransaccion);
router.delete('/:id', eliminarTransaccion);
router.get('/balance/:usuario_id', getBalance);

export default router;
