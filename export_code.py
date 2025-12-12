import os

# Archivo de salida
OUTPUT_FILE = "exported_code.txt"

# Rutas a extraer (en el orden exacto que pediste)
FILES_TO_EXPORT = [
    # 1. Controller del documento
    "apps/api/src/modules/documents/document.controller.ts",

    # 2. Rutas del módulo de documentos
    "apps/api/src/modules/documents/document.routes.ts",

    # 3. Middleware de autenticación
    "apps/api/src/core/middleware/auth.middleware.ts",
    "apps/api/src/shared/jwt.ts",  # si no existe no falla

    # 4. Prisma schema
    "apps/api/src/prisma/schema.prisma",

    # 5. Código que inserta/actualiza documentos (ya cubierto por controller)
    # pero por si existe otro archivo asociado:
    "apps/api/src/modules/documents/personalizedProcessor.ts",
    "apps/api/src/modules/documents/unifiedAIProcessor.ts",
    "apps/api/src/modules/documents/geminiProcessor.ts",

    # 6. Frontend: tabla/listado
    "apps/web/src/features/documents/components/DocumentsTable.tsx",

    # 7. Frontend: detalle
    "apps/web/src/pages/DocumentDetail.tsx",

    # 8. Frontend: axios / api client
    "apps/web/src/lib/api.ts",
    "apps/web/src/lib/api/index.ts",
    "apps/web/src/lib/axiosConfig.js",
]

def export_file(path, output):
    """Escribe el contenido de un archivo con encabezado y separadores."""
    if os.path.exists(path):
        output.write("\n" + "="*80 + "\n")
        output.write(f"FILE: {path}\n")
        output.write("="*80 + "\n\n")
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            output.write(f.read())
        output.write("\n\n")
    else:
        output.write("\n" + "="*80 + "\n")
        output.write(f"FILE NOT FOUND: {path}\n")
        output.write("="*80 + "\n\n")


def main():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as output:
        output.write("##### EXPORT OF PROJECT FILES #####\n")
        output.write("##### Generated automatically #####\n\n")

        for file_path in FILES_TO_EXPORT:
            export_file(file_path, output)

    print(f"\n✔ Exportación completada.")
    print(f"→ Archivo generado: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
