// apps/api/src/shared/db.ts
import { PrismaClient } from '@prisma/client';
const createPrismaClient = () => {
    console.log('Creating new Prisma client...');
    return new PrismaClient({
        log: ['query', 'error', 'warn'],
    });
};
export const prisma = global.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
/**
 * Función útil para verificar la conexión (uso en scripts o health-checks)
 */
export async function testConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Conectado a la base de datos correctamente');
        return true;
    }
    catch (error) {
        console.error('❌ Error conectando a la base de datos:', error);
        return false;
    }
}
