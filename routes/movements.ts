import { Router } from 'express';
import { actualizarTransaccion, crearTransaccion, eliminarTransaccion, getBalance, getMovementByAccountName, getMovementById, obtenerTransaccionesPorUsuario } from '../controllers/movements';

const router = Router();

router.post('/', crearTransaccion);
router.get('/:usuario_id', obtenerTransaccionesPorUsuario);
router.put('/:id', actualizarTransaccion);
router.delete('/:id', eliminarTransaccion);
router.get('/balance/:usuario_id', getBalance);
router.get('/movement/:id', getMovementById);
router.get('/cuenta-nombre/:usuario_id/:nombre_cuenta', getMovementByAccountName);



export default router;
