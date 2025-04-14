import { PrismaClient } from '@prisma/client';

// Crear una instancia de PrismaClient
const prisma = new PrismaClient();

const dbConnection = async (): Promise<void> => {
  try {
    // Verificar la conexión
    await prisma.$connect();
    console.log('🟢 Conectado a la base de datos MySQL');
  } catch (error) {
    console.log('🔴 Error al conectar a la base de datos:');
    console.error(error);
    throw new Error('Error al inicializar la base de datos');
  }
};

// Exportamos tanto la función como el cliente de Prisma para usar en otros módulos
export { dbConnection, prisma };
