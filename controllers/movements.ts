import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Crear una transacción
export const crearTransaccion:RequestHandler = async (req:any, res:any) => {
  const { usuario_id, cuenta_id, categoria_id, tipo, monto, descripcion, fecha } = req.body;

  if (!usuario_id || !cuenta_id || !tipo || !monto) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  try {
    const nuevaTransaccion = await prisma.transacciones.create({
      data: {
        usuario_id,
        cuenta_id,
        categoria_id,
        tipo,
        monto,
        descripcion,
        fecha: fecha ? new Date(fecha) : undefined,
      },
    });

    return res.status(201).json({
      message: 'Transacción creada correctamente.',
      transaccion: nuevaTransaccion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear la transacción.', error });
  }
};

// Obtener todas las transacciones de un usuario
export const obtenerTransaccionesPorUsuario:RequestHandler = async (req: any, res: any) => {
  const { usuario_id } = req.params;

  try {
    const transacciones = await prisma.transacciones.findMany({
      where: { usuario_id: Number(usuario_id) },
      orderBy: { fecha: 'desc' },
    });

    return res.status(200).json({ transacciones });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las transacciones.', error });
  }
};
