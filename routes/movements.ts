import { Router } from 'express';
import { actualizarTransaccion, crearTransaccion, eliminarTransaccion, getBalance, getMovementsById, obtenerTransaccionesPorUsuario } from '../controllers/movements';

const router = Router();

router.post('/', crearTransaccion);
router.get('/:usuario_id', obtenerTransaccionesPorUsuario);
router.put('/:id', actualizarTransaccion);
router.delete('/:id', eliminarTransaccion);
router.get('/balance/:usuario_id', getBalance);
router.get('/transaccion/:id', getMovementsById);


export default router;
