import { Router } from 'express';
import * as controller from '../controllers/accounts';

const router = Router();

// Nuevas rutas
router.get('/predeterminadas', controller.getCuentasPredeterminadas);
router.get('/personalizadas/:usuario_id', controller.getCuentasPersonalizadas);

// Rutas estándar
router.get('/:id', controller.getCuentaById);
router.post('/', controller.createCuenta);
router.put('/:id', controller.updateCuenta);
router.delete('/:id', controller.deleteCuenta);
router.get('/balance/:usuario_id/:cuenta_id', controller.getBalanceCuentaById);



export default router;

