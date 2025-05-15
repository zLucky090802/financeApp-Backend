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

    console.log(transacciones)

    return res.status(200).json({ transacciones });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las transacciones.', error });
  }
};

export const eliminarTransaccion: RequestHandler = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    await prisma.transacciones.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: 'Transacción eliminada correctamente.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Transacción no encontrada.' });
    }

    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar la transacción.', error });
  }
};

export const actualizarTransaccion: RequestHandler = async (req: any, res: any) => {
  const { id } = req.params;
  const { usuario_id, cuenta_id, categoria_id, tipo, monto, descripcion, fecha } = req.body;

  try {
    const transaccionActualizada = await prisma.transacciones.update({
      where: { id: Number(id) },
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

    return res.status(200).json({
      message: 'Transacción actualizada correctamente.',
      transaccion: transaccionActualizada,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Transacción no encontrada.' });
    }

    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar la transacción.', error });
  }
};
export const getBalance: RequestHandler = async (req: any, res: any) => {
  const { usuario_id } = req.params;

  try {
    // Obtener transacciones del usuario
    const transacciones = await prisma.transacciones.findMany({
      where: { usuario_id: Number(usuario_id) },
    });

    // Obtener cuentas del usuario para calcular saldo inicial total
    const cuentas = await prisma.cuentas.findMany({
      where: { usuario_id: Number(usuario_id) },
      select: { saldo_inicial: true },
    });

    // Sumar saldos iniciales
    const saldoInicialTotal = cuentas.reduce((acc, cuenta) => {
      return acc + Number(cuenta.saldo_inicial ?? 0);
    }, 0);

    let ingresos = saldoInicialTotal; // Empieza con saldo inicial total
    let gastos = 0;

    // Sumar ingresos y gastos de transacciones
    transacciones.forEach((t) => {
      const monto = Number(t.monto);
      if (t.tipo === 'ingreso') {
        ingresos += monto;
      } else if (t.tipo === 'gasto') {
        gastos += monto;
      }
    });

    const balance = ingresos - gastos;

    return res.status(200).json({
      ingresos,
      gastos,
      balance,
      saldoInicialTotal, // También lo devuelvo por si lo necesitas mostrar
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al calcular el balance.', error });
  }
};

// Obtener una transacción individual por su ID
export const getMovementById: RequestHandler = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const transaccion = await prisma.transacciones.findUnique({
      where: { id: Number(id) },
    });

    if (!transaccion) {
      return res.status(404).json({ message: 'Transacción no encontrada.' });
    }

    return res.status(200).json({ transaccion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener la transacción.', error });
  }
};

export const getMovementByAccountName: RequestHandler = async (req: any, res: any) => {
  const { usuario_id, nombre_cuenta } = req.params;

  try {
    // Buscar la cuenta personalizada con ese nombre y usuario
    const cuenta = await prisma.cuentas.findFirst({
      where: {
        usuario_id: Number(usuario_id),
        nombre: nombre_cuenta,
        es_personalizada: true,
      },
    });

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta personalizada no encontrada.' });
    }

    // Obtener transacciones de esa cuenta
    const transacciones = await prisma.transacciones.findMany({
      where: {
        cuenta_id: cuenta.id,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return res.status(200).json({ transacciones });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener transacciones por nombre de cuenta.', error });
  }
};
