import { PrismaClient } from '@prisma/client';
import { logger } from '../shared/logger.js';
const prisma = new PrismaClient();
async function main() {
    logger.info('🌱 Iniciando seed de la base de datos...');
    try {
        // Crear organización por defecto si no existe
        const organization = await prisma.organization.upsert({
            where: { id: 'default-org' },
            update: {},
            create: {
                id: 'default-org',
                name: 'Default Organization',
            },
        });
        logger.info(`✅ Organización creada: ${organization.name}`);
        // Crear template por defecto
        const template = await prisma.extractionTemplate.upsert({
            where: { id: 'default-contract-template' },
            update: {},
            create: {
                id: 'default-contract-template',
                name: 'Contract Certification Template',
                description: 'Default template for contract certification',
                category: 'contract_certification',
                isDefault: true,
                organizationId: organization.id,
                fields: JSON.stringify([
                    { name: 'contractNumber', type: 'text', required: true, label: 'Contract Number' },
                    { name: 'contractDate', type: 'date', required: true, label: 'Contract Date' },
                    { name: 'parties', type: 'text', required: true, label: 'Contracting Parties' },
                    { name: 'totalAmount', type: 'number', required: true, label: 'Total Amount' },
                    { name: 'certificationDate', type: 'date', required: true, label: 'Certification Date' }
                ])
            },
        });
        logger.info(`✅ Template creado: ${template.name}`);
        logger.info('🎉 Seed completado exitosamente');
    }
    catch (error) {
        logger.error('❌ Error durante el seed:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    logger.error('❌ Error fatal en seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
