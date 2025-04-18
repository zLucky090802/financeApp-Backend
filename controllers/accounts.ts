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

export const deleteCuenta = async (req: any, res: any) => {
  const id = Number(req.params.id);

  // Verificar si el id es un número válido
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    // Verificar si la cuenta existe antes de intentar eliminarla
    const cuentaExistente = await prisma.cuentas.findUnique({ where: { id } });

    if (!cuentaExistente) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    // Eliminar la cuenta si existe
    await prisma.cuentas.delete({ where: { id } });

    // Responder con un mensaje de éxito
    res.status(200).json({
      ok: true,
      msg: 'Cuenta eliminada',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar la cuenta', error });
  }
};

