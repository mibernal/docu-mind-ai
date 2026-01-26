import os
import re

OUTPUT_FILE = "exported_code.txt"

# ==============================
# Archivos CLAVE para depuración
# ==============================
FILES_TO_EXPORT = {

    "BACKEND": [
        "apps/api/src/index.ts",

        "apps/api/src/modules/auth/auth.routes.ts",
        "apps/api/src/modules/auth/auth.controller.ts",

        "apps/api/src/modules/users/user.routes.ts",
        "apps/api/src/modules/users/user.controller.ts",

        "apps/api/src/modules/users/preferences.routes.ts",
        "apps/api/src/modules/users/onboarding.controller.ts",

        "apps/api/src/core/middleware/auth.middleware.ts",
        "apps/api/src/shared/jwt.ts",

        "apps/api/src/prisma/schema.prisma",
    ],

    "FRONTEND": [
        "apps/web/src/lib/api.ts",
        "apps/web/src/contexts/AuthContext.tsx",
        "apps/web/src/pages/Register.tsx",
        "apps/web/src/features/settings/hooks/usePreferences.ts",
        "apps/web/src/pages/Onboarding.tsx",
    ]
}


def clean_content(text: str) -> str:
    """
    Limpia caracteres basura y exceso de líneas vacías.
    """
    # Normalizar saltos de línea
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Eliminar caracteres invisibles raros
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7E]", "", text)

    # Reducir líneas vacías múltiples
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def export_file(path: str, output):
    output.write("\n---\n")
    output.write(f"FILE: {path}\n")
    output.write("---\n")

    if not os.path.exists(path):
        output.write("❌ FILE NOT FOUND\n")
        return

    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            cleaned = clean_content(content)
            output.write(cleaned + "\n")
    except Exception as e:
        output.write(f"❌ ERROR READING FILE: {e}\n")


def main():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as output:
        output.write("# PROJECT CODE EXPORT\n")
        output.write("# Purpose: Debugging & AI Analysis\n")
        output.write("# ---------------------------------\n\n")

        for section, files in FILES_TO_EXPORT.items():
            output.write(f"\n==============================\n")
            output.write(f"SECTION: {section}\n")
            output.write(f"==============================\n")

            for file_path in files:
                export_file(file_path, output)

    print("\n✔ Exportación completada correctamente.")
    print(f"→ Archivo generado: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
