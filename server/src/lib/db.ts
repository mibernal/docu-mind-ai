//server\src\lib\db.ts
import { PrismaClient } from '@prisma/client'

// PrismaClient está attached al global object en desarrollo para prevenir
// hot reloading de crear nuevas instancias
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

function createPrismaClient() {
  console.log('Creating new Prisma client...')
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Función de conexión para verificar que todo funciona
export async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Conectado a la base de datos correctamente')
    return true
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error)
    return false
  }
}