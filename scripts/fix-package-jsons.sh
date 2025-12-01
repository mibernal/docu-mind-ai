#!/bin/bash

echo "🔧 Aplicando correcciones a package.json files..."

# Crear package.json raíz corregido
cat > package.json << 'ROOTPKG'
{
  "name": "docu-mind-ai",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm run dev:web\" \"npm run dev:api\"",
    "dev:web": "cd apps/web && npm run dev",
    "dev:api": "cd apps/api && npm run dev",
    "build": "npm run build:shared && npm run build:ai-processor && npm run build:api && npm run build:web",
    "build:web": "cd apps/web && npm run build",
    "build:api": "cd apps/api && npm run build",
    "build:shared": "cd packages/shared && npm run build",
    "build:ai-processor": "cd packages/ai-processor && npm run build",
    "lint": "npm run lint:web && npm run lint:api",
    "lint:web": "cd apps/web && npm run lint",
    "lint:api": "cd apps/api && npm run lint",
    "preview": "cd apps/web && npm run preview",
    "db:generate": "cd apps/api && npm run db:generate",
    "db:push": "cd apps/api && npm run db:push",
    "db:studio": "cd apps/api && npm run db:studio",
    "db:seed": "cd apps/api && npm run db:seed",
    "db:migrate": "cd apps/api && npm run db:migrate",
    "type-check": "npm run type-check:shared && npm run type-check:ai-processor && npm run type-check:web && npm run type-check:api",
    "type-check:web": "cd apps/web && npm run type-check",
    "type-check:api": "cd apps/api && npm run type-check",
    "type-check:shared": "cd packages/shared && npx tsc --noEmit",
    "type-check:ai-processor": "cd packages/ai-processor && npx tsc --noEmit",
    "install:all": "npm install && cd apps/web && npm install && cd ../api && npm install && cd packages/shared && npm install && cd ../ai-processor && npm install",
    "clean": "rm -rf node_modules apps/web/node_modules apps/api/node_modules packages/shared/node_modules packages/ai-processor/node_modules",
    "clean:install": "npm run clean && npm run install:all"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "dependencies": {
    "typescript": "^5.2.2"
  }
}
ROOTPKG

# Crear apps/api/package.json corregido
cat > apps/api/package.json << 'APIPKG'
{
  "name": "api",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "prisma": {
    "schema": "./src/prisma/schema.prisma",
    "seed": "tsx src/prisma/seed.ts"
  },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:push": "prisma db push --schema=./src/prisma/schema.prisma",
    "db:generate": "prisma generate --schema=./src/prisma/schema.prisma",
    "db:seed": "tsx src/prisma/seed.ts",
    "db:migrate": "prisma migrate dev --schema=./src/prisma/schema.prisma",
    "db:studio": "prisma studio --schema=./src/prisma/schema.prisma",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@prisma/client": "^7.0.1",
    "shared": "workspace:*",
    "ai-processor": "workspace:*",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.9",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.10.5",
    "prisma": "^7.0.1",
    "tsx": "^4.6.2",
    "typescript": "^5.2.2"
  }
}
APIPKG

# Crear packages/shared/package.json corregido
cat > packages/shared/package.json << 'SHAREDPKG'
{
  "name": "shared",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.2.2"
  }
}
SHAREDPKG

# Crear packages/ai-processor/package.json corregido
cat > packages/ai-processor/package.json << 'AIPKGG'
{
  "name": "ai-processor",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.2.2"
  }
}
AIPKGG

echo "✅ Todos los package.json han sido corregidos"
