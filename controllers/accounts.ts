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

export const createCuenta = async (req: Request, res: Response) => {
  const data = req.body;
  const nuevaCuenta = await prisma.cuentas.create({ data });
  res.status(201).json(nuevaCuenta);
};

export const updateCuenta = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  const cuenta = await prisma.cuentas.update({ where: { id }, data });
  res.json(cuenta);
};

export const deleteCuenta = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.cuentas.delete({ where: { id } });
  res.status(204).send();
};
