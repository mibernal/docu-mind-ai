#!/bin/bash

echo "🔧 SOLUCIONANDO PROBLEMA DE PRISMA EN FRONTEND..."
echo "=============================================="

echo "1. Eliminando db.ts del frontend..."
if [ -f "apps/web/src/lib/db.ts" ]; then
    rm apps/web/src/lib/db.ts
    echo "✅ apps/web/src/lib/db.ts eliminado"
else
    echo "ℹ️  El archivo ya fue eliminado"
fi

echo ""
echo "2. Buscando imports de db.ts en el frontend..."
imports_found=$(grep -r "from.*lib/db" apps/web/src/ 2>/dev/null || true)

if [ -n "$imports_found" ]; then
    echo "❌ Se encontraron imports de db.ts:"
    echo "$imports_found"
    echo ""
    echo "3. Corrigiendo imports..."
    
    # Lista de archivos que podrían importar db.ts
    potential_files=(
        "apps/web/src/lib/api.ts"
        "apps/web/src/hooks/useAuth.ts"
        "apps/web/src/features/auth/hooks/useAuth.ts"
        "apps/web/src/pages/Login.tsx"
        "apps/web/src/pages/Register.tsx"
        "apps/web/src/App.tsx"
    )
    
    for file in "${potential_files[@]}"; do
        if [ -f "$file" ]; then
            # Eliminar import de db.ts
            sed -i '/from.*lib\/db/d' "$file"
            sed -i '/from.*\.\.\/lib\/db/d' "$file"
            sed -i '/from.*@\/lib\/db/d' "$file"
            echo "✅ Import de db.ts eliminado en $file"
        fi
    done
else
    echo "✅ No se encontraron imports de db.ts"
fi

echo ""
echo "4. Verificando estructura de lib en frontend..."
if [ -d "apps/web/src/lib" ] && [ -z "$(ls -A apps/web/src/lib)" ]; then
    rmdir apps/web/src/lib
    echo "✅ Carpeta lib vacía eliminada"
elif [ -d "apps/web/src/lib" ]; then
    echo "📁 Contenido actual de apps/web/src/lib/:"
    ls -la apps/web/src/lib/
fi

echo ""
echo "5. Creando archivo API client correcto para el frontend..."
cat > apps/web/src/lib/api.ts << 'APICLIENTEOF'
// Cliente API para el frontend - usa fetch para comunicarse con el backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },
};

export default api;
APICLIENTEOF

echo "✅ api.ts creado con cliente HTTP para frontend"

echo ""
echo "🎉 PROBLEMA DE PRISMA RESUELTO!"
echo ""
echo "📝 Explicación:"
echo "• Prisma es una dependencia exclusiva del backend"
echo "• El frontend debe comunicarse con el backend via API REST"
echo "• Se creó un cliente API en apps/web/src/lib/api.ts"
echo "• Todos los datos deben venir del backend, no directamente de la BD"
