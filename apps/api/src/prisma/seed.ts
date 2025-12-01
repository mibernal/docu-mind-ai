import { PrismaClient } from "@prisma/client";
import { BetterSqlite3Adapter } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

const prisma = new PrismaClient({
  adapter: new BetterSqlite3Adapter(new Database("dev.db")),
});

async function main() {
  console.log("🌱 Seeding database...");

  const organization = await prisma.organization.upsert({
    where: { id: "default-org" },
    update: {},
    create: {
      id: "default-org",
      name: "Default Organization",
    },
  });

  await prisma.extractionTemplate.upsert({
    where: { id: "default-contract-template" },
    update: {},
    create: {
      id: "default-contract-template",
      name: "Contract Certification Template",
      description: "Default template for contract certification",
      category: "contract_certification",
      isDefault: true,
      organizationId: organization.id,
      fields: JSON.stringify([
        { name: "contractNumber", type: "text", required: true, label: "Contract Number" },
        { name: "contractDate", type: "date", required: true, label: "Contract Date" },
        { name: "parties", type: "text", required: true, label: "Contracting Parties" },
        { name: "totalAmount", type: "number", required: true, label: "Total Amount" },
        { name: "certificationDate", type: "date", required: true, label: "Certification Date" }
      ])
    },
  });

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
