// apps/api/src/shared/db.ts
import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js'; // CORREGIDO: .js extension for ES modules

// Singleton pattern para Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Crear instancia con configuración específica
function createPrismaClient(): PrismaClient {
  logger.info('🔧 Creando cliente de Prisma...');
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  });
}

// Exportar la instancia única
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Guardar en global para desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Función para probar conexión con reintentos
export async function testConnection(maxRetries = 3): Promise<boolean> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      logger.info(`Intentando conectar a la base de datos (intento ${retries + 1}/${maxRetries})...`);
      
      await prisma.$connect();
      
      // Verificar conexión con una consulta simple
      await prisma.$queryRaw`SELECT 1 as connection_test`;
      
      logger.info('✅ Conexión a la base de datos establecida correctamente');
      return true;
    } catch (error) {
      retries++;
      logger.error(`❌ Error de conexión (intento ${retries}/${maxRetries}):`, error);
      
      if (retries < maxRetries) {
        logger.info(`Esperando 2 segundos antes de reintentar...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        logger.error('❌ No se pudo establecer conexión después de todos los intentos');
        return false;
      }
    }
  }
  
  return false;
}

// Manejo de cierre limpio
process.on('beforeExit', async () => {
  logger.info('Cerrando conexión de Prisma...');
  await prisma.$disconnect();
});