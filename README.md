# 🧠 DocuMind AI

**Plataforma SaaS de Automatización Inteligente de Documentos con IA**

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 📘 Descripción

**DocuMind AI** es una plataforma **SaaS** que combina **RPA (Automatización Robótica de Procesos)** con **Inteligencia Artificial** para automatizar la gestión y procesamiento de documentos empresariales.

Sube facturas, contratos o recibos y deja que la plataforma **extraiga, clasifique y organice automáticamente** la información, reduciendo errores humanos y tiempos de procesamiento.

---

## 💡 Propuesta de Valor

- ⏱️ Ahorra **10+ horas semanales** en procesamiento manual  
- 🤖 **98% de precisión** en extracción de datos con IA  
- ⚡ Procesamiento en segundos  
- 🔌 Integración fluida con flujos y APIs empresariales

---

## ✨ Características Principales

### 🔐 Autenticación y Usuarios
- Registro/Login con **JWT**
- Perfiles y roles multiusuario
- Planes Free / Pro / Business
- Soporte multi-organización

### 📄 Procesamiento de Documentos
- Subida por drag & drop  
- Soporte **PDF, PNG, JPG, TIFF**
- Clasificación automática  
- Extracción con **IA (OpenAI + Vision API)**
- Validación/corrección de campos

### 📊 Dashboard y Analítica
- Métricas de uso y rendimiento
- Gráficos en tiempo real
- Historial de documentos procesados

### 🧩 Integraciones y API
- API REST documentada
- Sistema de colas con Redis
- Exportación de datos (JSON, CSV, XLSX)
- SDK y endpoints para integraciones empresariales

---

## 🏗️ Arquitectura Técnica

### 🖥️ Frontend
- **React 18 + TypeScript**
- **Vite** (bundler rápido)
- **TailwindCSS** + **Shadcn/UI**
- **TanStack Query** (estado remoto)
- **React Router DOM**

### ⚙️ Backend
- **Node.js 20+** + **Express**
- **TypeScript** full-stack
- **Prisma ORM** + **PostgreSQL**
- **JWT** + **bcryptjs** (autenticación segura)

### ☁️ Infraestructura
- **Docker** y **Docker Compose**
- **Redis** (colas asíncronas)
- **AWS S3** (archivos)
- **Railway / Render / Vercel** (despliegue rápido)

### 🧠 IA y Procesamiento
- **FastAPI (Python)** para microservicios IA  
- **Google Vision API** (OCR)  
- **OpenAI GPT-4** (análisis y normalización de texto)  
- **LangChain** (orquestación IA)

---

## ⚙️ Instalación y Configuración

### 🔧 Prerrequisitos

| Requisito | Versión Recomendada |
|------------|---------------------|
| Node.js | 20+ |
| npm / yarn / pnpm | Última |
| PostgreSQL | 15+ |
| Docker / Docker Compose | Opcional |
| Git | Última |

---

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/documind-ai.git
cd documind-ai
2️⃣ Configurar variables de entorno (Backend)
bash
Copiar código
cd server
cp .env.example .env
Edita .env con tus credenciales:

env
Copiar código
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/documind_ai"

# Autenticación
JWT_SECRET="clave-secreta-segura"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3001
CLIENT_URL="http://localhost:5173"

# IA
OPENAI_API_KEY="tu-openai-key"
GOOGLE_VISION_API_KEY="tu-google-key"
3️⃣ Instalar dependencias
Backend
bash
Copiar código
cd server
npm install
Frontend
bash
Copiar código
cd ..
npm install
4️⃣ Inicializar base de datos
bash
Copiar código
cd server
npx prisma generate
npx prisma db push
npx prisma db seed
5️⃣ Ejecutar en modo desarrollo
Terminal 1 – Backend
bash
Copiar código
cd server
npm run dev
Terminal 2 – Frontend
bash
Copiar código
cd ..
npm run dev
Accesos locales:

🌐 Frontend → http://localhost:5173

⚙️ Backend → http://localhost:3001

🧩 Prisma Studio → http://localhost:5555

🧱 Estructura del Proyecto
text
Copiar código
documind-ai/
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── middleware/    # Autenticación y validación
│   │   ├── routes/        # Endpoints API
│   │   ├── lib/           # Configuración y utilidades
│   │   └── index.ts
│   ├── prisma/            # Esquema y migraciones
│   └── package.json
├── src/                   # Frontend React
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── main.tsx
├── packages/              # Módulos compartidos (si aplica)
└── docs/                  # Documentación y capturas
🧪 Testing
bash
Copiar código
# Backend
cd server
npm test

# Frontend
cd ..
npm test

# End-to-end
npm run test:e2e
🚀 Despliegue
🐳 Opción 1: Docker (Recomendada)
Asegúrate de tener Docker y Docker Compose instalados, luego ejecuta:

bash
Copiar código
docker-compose up -d
docker-compose logs -f
Esto levantará:

Node.js (backend)

React (frontend)

PostgreSQL

Redis

☁️ Opción 2: Despliegue Manual
Backend en Railway / Render
bash
Copiar código
npm install -g @railway/cli
railway login
railway up
Frontend en Vercel / Netlify
bash
Copiar código
npm run build
npx vercel --prod
Variables de entorno de producción
env
Copiar código
NODE_ENV=production
DATABASE_URL="postgresql://user:password@prod-db:5432/documind_ai"
JWT_SECRET="clave-super-segura"
CLIENT_URL="https://tu-dominio.com"
OPENAI_API_KEY="..."
GOOGLE_VISION_API_KEY="..."
🧰 Comandos Útiles
Comando	Descripción
npm run dev	Ejecuta entorno de desarrollo
npm run build	Compila frontend y backend
npm run start	Ejecuta versión productiva
npm run lint	Analiza el código
npx prisma studio	Abre el dashboard de Prisma
npx prisma migrate dev	Ejecuta migraciones locales
npx prisma db seed	Pobla la base de datos

🗺️ Roadmap
Fase	Estado	Objetivo
1.	✅ Completado	Autenticación, dashboard, IA básica
2.	🚧 En curso	Integraciones OpenAI/Vision, plantillas, Redis
3.	📅 Próximamente	App móvil, ERP, análisis ML, marketplace

🤝 Contribución
Fork del repositorio

Crear rama de feature:

bash
Copiar código
git checkout -b feature/nueva-funcionalidad
Commit siguiendo Conventional Commits:

bash
Copiar código
git commit -m "feat: agrega validación de documentos"
Push y Pull Request

Guía de estilo
Código 100% en TypeScript

Tests > 80% de cobertura

Lint y formateo antes del push

Documentar toda nueva feature

🧩 Integración CI/CD (opcional)
Ejemplo básico de workflow con GitHub Actions (.github/workflows/deploy.yml):

yaml
Copiar código
name: Deploy DocuMind AI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
🐛 Troubleshooting
Error: “Cannot connect to database”

bash
Copiar código
sudo service postgresql status
psql -h localhost -U usuario -d documind_ai
Error: “Module not found”

bash
Copiar código
rm -rf node_modules package-lock.json
npm install
Error con Prisma

bash
Copiar código
npx prisma generate
npx prisma migrate reset
📄 Licencia
Proyecto bajo licencia MIT.
Consulta el archivo LICENSE para más detalles.

👥 Equipo
Miguel Bernal – Desarrollador Full Stack
🔗 GitHub

🙏 Agradecimientos
Shadcn/UI

Prisma

Vite

Tailwind CSS

OpenAI

<div align="center">
📬 ¿Preguntas o sugerencias?
👉 Abre un Issue

</div> ```