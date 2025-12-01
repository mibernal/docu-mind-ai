#!/bin/bash

echo "📦 VERIFICANDO DEPENDENCIAS..."
echo "============================"

echo "1. Dependencias del backend (apps/api):"
cd apps/api
if grep -q "@prisma/client" package.json; then
    echo "✅ @prisma/client encontrado en backend"
else
    echo "❌ @prisma/client NO encontrado en backend"
fi
cd ../..

echo ""
echo "2. Dependencias del frontend (apps/web):"
cd apps/web
if grep -q "@prisma/client" package.json; then
    echo "❌ @prisma/client encontrado en frontend (debería eliminarse)"
else
    echo "✅ @prisma/client NO encontrado en frontend (correcto)"
fi
cd ../..

echo ""
echo "3. Verificando estructura de packages:"
if [ -d "packages/shared" ]; then
    echo "✅ Package shared existe"
    if [ -f "packages/shared/src/types/index.ts" ]; then
        echo "✅ Tipos compartidos existen"
    fi
fi

if [ -d "packages/ai-processor" ]; then
    echo "✅ Package ai-processor existe"
fi
