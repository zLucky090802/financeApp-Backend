import { AuthRequest } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ Listar cuentas predeterminadas (es_personalizada = false)
export const getCuentasPredeterminadas = async (_req: Request, res: Response) => {
  const cuentas = await prisma.cuentas.findMany({
    where: { es_personalizada: false },
  });
  res.json(cuentas);
};

// ✅ Listar cuentas personalizadas por usuario_id
export const getCuentasPersonalizadas = async (req: Request, res: Response) => {
  const usuario_id = Number(req.params.usuario_id);
  const cuentas = await prisma.cuentas.findMany({
    where: {
      usuario_id,
      es_personalizada: true,
    },
  });
  res.json(cuentas);
};

// Otros métodos existentes:
export const getCuentaById = async (req:any, res: any) => {
  const id = Number(req.params.id);
  const cuenta = await prisma.cuentas.findUnique({ where: { id } });
  if (!cuenta) return res.status(404).json({ message: 'Cuenta no encontrada' });
  res.json(cuenta);
};

export const createCuenta = async (req: any, res: any) => {
  const { es_personalizada, ...resto } = req.body; 

  const { usuario_id, nombre } = resto;

  // Validación mínima
  if (!usuario_id || !nombre) {
    return res.status(400).json({ message: 'Faltan datos requeridos.' });
  }

  try {
    const nuevaCuenta = await prisma.cuentas.create({
      data: {
        ...resto,
        es_personalizada: true, 
      },
    });

    return res.status(201).json(nuevaCuenta);
  } catch (error) {
    console.error('Error al crear la cuenta:', error);
    return res.status(500).json({ message: 'Error al crear la cuenta.', error });
  }
};


export const updateCuenta = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  const cuenta = await prisma.cuentas.update({ where: { id }, data });
  res.json(cuenta);
};

export const deleteCuenta = async (req: AuthRequest, res: any) => {
  const cuentaId = Number(req.params.id);
  const usuarioId = Number(req.params.usuario_id);
  console.log(cuentaId)

  if (isNaN(cuentaId) || !usuarioId) {
    return res.status(400).json({ message: 'ID(s) no válidos' });
  }

  try {
    const cuentaExistente = await prisma.cuentas.findFirst({
      where: {
        id: Number(cuentaId),
        usuario_id: Number(usuarioId),
      },
    });

   

    if (!cuentaExistente) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    await prisma.transacciones.deleteMany({ where: { cuenta_id: cuentaId } });

    await prisma.cuentas.delete({ where: { id: cuentaId } });

    res.status(200).json({ ok: true, msg: 'Cuenta eliminada' });
  } catch (error) {
    console.error('Error al eliminar la cuenta:', error);
    res.status(500).json({
      message: 'Error al eliminar la cuenta',
      error: error instanceof Error ? error.message : error,
    });
  }
};


export const getBalanceCuentaById = async (req: any, res: any) => {
  const { usuario_id, cuenta_id } = req.params;

  if (!usuario_id || !cuenta_id) {
    return res.status(400).json({ message: 'Usuario ID y Cuenta ID son requeridos' });
  }

  try {
    // Primero verificamos si la cuenta existe y pertenece al usuario
    const cuenta = await prisma.cuentas.findFirst({
      where: {
        id: Number(cuenta_id),
        usuario_id: Number(usuario_id),
      },
    });

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada para este usuario' });
    }

    // Luego buscamos los movimientos
    const movimientos = await prisma.transacciones.findMany({
      where: {
        cuenta_id: Number(cuenta_id),
        usuario_id: Number(usuario_id),
      },
      select: {
        tipo: true,
        monto: true,
      },
    });

    // Calculamos el balance sumando ingresos, restando gastos y agregando saldo_inicial
    const balanceTransacciones = movimientos.reduce((acc, mov) => {
      if (mov.tipo === 'ingreso') {
        return acc + Number(mov.monto);
      } else if (mov.tipo === 'gasto') {
        return acc - Number(mov.monto);
      } else {
        return acc;
      }
    }, 0);

    const saldoInicial = cuenta.saldo_inicial ? Number(cuenta.saldo_inicial) : 0;
    const balanceTotal = saldoInicial + balanceTransacciones;

    return res.status(200).json({
      usuarioId: Number(usuario_id),
      cuentaId: Number(cuenta_id),
      saldoInicial,
      balanceTransacciones,
      balanceTotal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al calcular el balance de la cuenta personalizada' });
  }
};
