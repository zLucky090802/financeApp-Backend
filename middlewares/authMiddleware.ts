import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'clave-secreta';

export interface AuthRequest extends Request {
  usuario_id?: number;
}

export const verificarToken = (req: any, res: any, next: any) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'No hay token en la petición' });
    }
  
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      req.usuario = payload;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token no válido' });
    }
  };
