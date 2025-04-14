import { Router } from 'express';
import { crearUsuario, loginUsuario } from '../controllers/auth';

const router = Router();

// Ruta para crear un nuevo usuario
router.post('/new', crearUsuario);

router.post('/', loginUsuario)

export default router;
