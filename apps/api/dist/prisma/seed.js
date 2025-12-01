// apps/api/src/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    // Crear organización por defecto
    const organization = await prisma.organization.upsert({
        where: { id: 'default-org' },
        update: {},
        create: {
            id: 'default-org',
            name: 'Default Organization',
        },
    });
    // Crear template por defecto para contract certification
    const defaultTemplate = await prisma.extractionTemplate.upsert({
        where: { id: 'default-contract-template' },
        update: {},
        create: {
            id: 'default-contract-template',
            name: 'Contract Certification Template',
            description: 'Default template for contract certification documents',
            category: 'contract_certification',
            isDefault: true,
            organizationId: organization.id,
            fields: JSON.stringify([
                {
                    name: 'contractNumber',
                    type: 'text',
                    required: true,
                    label: 'Contract Number'
                },
                {
                    name: 'contractDate',
                    type: 'date',
                    required: true,
                    label: 'Contract Date'
                },
                {
                    name: 'parties',
                    type: 'text',
                    required: true,
                    label: 'Contracting Parties'
                },
                {
                    name: 'totalAmount',
                    type: 'number',
                    required: true,
                    label: 'Total Amount'
                },
                {
                    name: 'certificationDate',
                    type: 'date',
                    required: true,
                    label: 'Certification Date'
                }
            ])
        }
    });
    console.log('✅ Database seeded successfully');
    console.log(`📁 Organization created: ${organization.name}`);
    console.log(`📄 Default template created: ${defaultTemplate.name}`);
}
main()
    .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
