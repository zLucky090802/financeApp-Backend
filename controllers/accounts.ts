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


export const updateCuenta = async(req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID de cuenta inválido' });
    }

    const cuentaExistente = await prisma.cuentas.findUnique({ where: { id } });
    if (!cuentaExistente) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    const {
      nombre,
      tipo,
      saldo_inicial,
      cuenta_base_id,
      descripcion,
    } = req.body;

    // Validaciones básicas
    if (nombre !== undefined && typeof nombre !== 'string') {
      return res.status(400).json({ error: '`nombre` debe ser una cadena' });
    }

   

    if (saldo_inicial !== undefined && isNaN(Number(saldo_inicial))) {
      return res.status(400).json({ error: '`saldo_inicial` debe ser un número' });
    }

    if (cuenta_base_id !== undefined && cuenta_base_id !== null && isNaN(Number(cuenta_base_id))) {
      return res.status(400).json({ error: '`cuenta_base_id` debe ser numérico' });
    }


    // Armar objeto con solo los campos válidos que se recibieron
    const dataToUpdate: any = {};
    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    
    if (saldo_inicial !== undefined) dataToUpdate.saldo_inicial = Number(saldo_inicial);
    if (cuenta_base_id !== undefined) dataToUpdate.cuenta_base_id = cuenta_base_id;
   

    // Si no hay campos para actualizar, retorna error
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
    }

    const cuentaActualizada = await prisma.cuentas.update({
      where: { id },
      data: dataToUpdate,
    });

    return res.status(200).json(cuentaActualizada);
  } catch (error) {
    console.error('Error al actualizar la cuenta:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
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
    const cuenta = await prisma.cuentas.findFirst({
      where: {
        id: Number(cuenta_id),
        usuario_id: Number(usuario_id),
      },
    });

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada para este usuario' });
    }

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

    let totalIngresos = 0;
    let totalGastos = 0;

    movimientos.forEach((mov) => {
      const monto = Number(mov.monto);
      if (mov.tipo === 'ingreso') {
        totalIngresos += monto;
      } else if (mov.tipo === 'gasto') {
        totalGastos += monto;
      }
    });

    const saldoInicial = cuenta.saldo_inicial ? Number(cuenta.saldo_inicial) : 0;
    const balanceTransacciones = totalIngresos - totalGastos;
    const balanceTotal = saldoInicial + balanceTransacciones;

    const capitalTotal = saldoInicial + totalIngresos; // ✅ suma que pediste

    return res.status(200).json({
      usuarioId: Number(usuario_id),
      cuentaId: Number(cuenta_id),
      saldoInicial,
      totalIngresos,
      totalGastos,
      capitalTotal,          // ✅ nueva variable
      balanceTransacciones,
      balanceTotal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al calcular el balance de la cuenta personalizada' });
  }
};
