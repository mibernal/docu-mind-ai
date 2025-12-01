import { PrismaClient } from '@prisma/client';
declare global {
    var prisma: PrismaClient | undefined;
}
export declare const prisma: any;
/**
 * Función útil para verificar la conexión (uso en scripts o health-checks)
 */
export declare function testConnection(): Promise<boolean>;
