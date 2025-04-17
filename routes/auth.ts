import { Router } from "express";
import { crearUsuario, loginUsuario } from "../controllers/auth";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos";

const router = Router();

// Ruta para crear un nuevo usuario
router.post(
  "/new",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Email es obligatorio").isEmail(),
    check("password", "El password debe ser minimo de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  "/",
  [
    check("email", "Email es obligatorio").isEmail(),
    check("password", "El password debe ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);

export default router;
