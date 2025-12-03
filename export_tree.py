#!/usr/bin/env python3
"""
Script para exportar los 4 archivos clave de docu-mind-ai.
"""

import os
import sys
from datetime import datetime
from typing import List, Tuple

class DocuMindExporter:
    def __init__(self, base_path: str = None):
        self.base_path = base_path or os.getcwd()
        self.export_file = os.path.join(self.base_path, "docu_mind_key_codes.txt")
        
    def read_file(self, filepath: str) -> str:
        """Leer contenido de archivo"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return f"// Error reading file: {str(e)}\n"
    
    def format_file_content(self, relative_path: str, content: str, description: str) -> str:
        """Formatear contenido de archivo para exportación"""
        border = "=" * 80
        header = f"ARCHIVO: {relative_path}"
        
        formatted = f"\n{border}\n"
        formatted += f"{header}\n"
        formatted += f"DESCRIPCIÓN: {description}\n"
        formatted += f"{border}\n\n"
        formatted += content
        
        # Asegurarnos de que termina con línea nueva
        if not content.endswith('\n'):
            formatted += '\n'
            
        return formatted
    
    def get_specific_files(self) -> List[Tuple[str, str, str]]:
        """Obtener lista específica de archivos solicitados"""
        return [
            # 1. Auth Context
            (
                "apps/web/src/contexts/AuthContext.tsx",
                "Auth Context - Manejo de autenticación en el frontend (React Context)",
                "Contexto de autenticación para manejar estado de usuario y sesiones"
            ),
            
            # 2. API Config
            (
                "apps/web/src/lib/api.ts", 
                "API Config - Configuración de llamadas API desde el frontend",
                "Configuración de Axios/fetch y funciones para comunicación con el backend"
            ),
            
            # 3. Database config
            (
                "apps/api/src/shared/db.ts",
                "Database Config - Configuración de base de datos (Prisma)",
                "Configuración de conexión a base de datos y cliente Prisma"
            ),
            
            # 4. Routes imports
            (
                "apps/api/src/index.ts",
                "Routes Imports - Punto de entrada y configuración de rutas del API",
                "Archivo principal del backend que configura Express y las rutas"
            ),
        ]
    
    def create_codes_file(self):
        """Crear archivo con los 4 códigos específicos"""
        print(f"📝 Creando archivo con los 4 códigos clave: {self.export_file}")
        print("=" * 60)
        
        # Contadores
        processed = 0
        missing = 0
        
        with open(self.export_file, 'w', encoding='utf-8') as outfile:
            # Encabezado
            outfile.write("=" * 80 + "\n")
            outfile.write("DOCU-MIND-AI - 4 ARCHIVOS CLAVE PARA DIAGNÓSTICO\n")
            outfile.write("=" * 80 + "\n\n")
            outfile.write(f"Fecha de exportación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            outfile.write(f"Directorio raíz: {self.base_path}\n\n")
            
            outfile.write("ARCHIVOS SOLICITADOS:\n")
            outfile.write("1. Auth Context - apps/web/src/contexts/AuthContext.tsx\n")
            outfile.write("2. API Config - apps/web/src/lib/api.ts\n")
            outfile.write("3. Database config - apps/api/src/shared/db.ts\n")
            outfile.write("4. Routes imports - apps/api/src/index.ts\n\n")
            outfile.write("=" * 80 + "\n\n")
            
            # Procesar cada archivo específico
            files = self.get_specific_files()
            
            for i, (rel_path, title, description) in enumerate(files, 1):
                full_path = os.path.join(self.base_path, rel_path)
                
                print(f"\n{i}. {title}")
                print(f"   Ruta: {rel_path}")
                
                if os.path.exists(full_path):
                    # Leer contenido
                    content = self.read_file(full_path)
                    
                    # Formatear y escribir
                    formatted = self.format_file_content(rel_path, content, description)
                    outfile.write(formatted)
                    
                    # Estadísticas
                    lines = len(content.split('\n'))
                    print(f"   ✅ ENCONTRADO ({lines} líneas)")
                    processed += 1
                else:
                    # Archivo no encontrado
                    outfile.write(f"\n{'='*80}\n")
                    outfile.write(f"ARCHIVO NO ENCONTRADO: {rel_path}\n")
                    outfile.write(f"{'='*80}\n\n")
                    outfile.write(f"// El archivo {rel_path} no existe en la ruta especificada.\n")
                    outfile.write(f"// Ruta buscada: {full_path}\n\n")
                    
                    print(f"   ❌ NO ENCONTRADO")
                    print(f"   ⚠  Ruta buscada: {full_path}")
                    missing += 1
                    
                    # Buscar archivos similares
                    self.find_similar_files(rel_path, outfile)
            
            # Resumen
            outfile.write("\n" + "=" * 80 + "\n")
            outfile.write("RESUMEN DE EXPORTACIÓN\n")
            outfile.write("=" * 80 + "\n\n")
            outfile.write(f"Total archivos solicitados: {len(files)}\n")
            outfile.write(f"Archivos encontrados: {processed}\n")
            outfile.write(f"Archivos no encontrados: {missing}\n")
            outfile.write(f"Fecha de finalización: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        print(f"\n{'='*60}")
        print(f"✅ ARCHIVO CREADO: {self.export_file}")
        print(f"📊 Resumen: {processed} encontrados, {missing} faltantes")
        
        if missing > 0:
            print("\n⚠  ARCHIVOS FALTANTES:")
            for rel_path, title, _ in files:
                full_path = os.path.join(self.base_path, rel_path)
                if not os.path.exists(full_path):
                    print(f"   • {rel_path}")
    
    def find_similar_files(self, target_path: str, outfile):
        """Buscar archivos similares o alternativos"""
        target_filename = os.path.basename(target_path)
        target_dir = os.path.dirname(target_path)
        
        outfile.write(f"\n// Búsqueda de archivos similares para: {target_filename}\n")
        
        # Buscar en el directorio objetivo
        search_dir = os.path.join(self.base_path, target_dir)
        if os.path.exists(search_dir):
            similar_files = []
            for root, dirs, files in os.walk(search_dir):
                for file in files:
                    if target_filename.lower() in file.lower() or file.lower() in target_filename.lower():
                        rel_path = os.path.relpath(os.path.join(root, file), self.base_path)
                        similar_files.append(rel_path)
            
            if similar_files:
                outfile.write(f"// Archivos similares encontrados en {target_dir}:\n")
                for similar in similar_files[:5]:  # Mostrar máximo 5
                    outfile.write(f"//   • {similar}\n")
            else:
                outfile.write(f"// No se encontraron archivos similares en {target_dir}\n")
        else:
            outfile.write(f"// El directorio {target_dir} no existe\n")
        
        outfile.write("\n")
    
    def show_project_info(self):
        """Mostrar información del proyecto"""
        print("\n📋 INFORMACIÓN DEL PROYECTO:")
        print(f"   Directorio: {self.base_path}")
        
        # Verificar estructura básica
        essential_dirs = [
            ("apps/api", "Backend API"),
            ("apps/web", "Frontend React"),
            ("packages", "Paquetes compartidos")
        ]
        
        print("\n📁 ESTRUCTURA VERIFICADA:")
        for dir_name, description in essential_dirs:
            dir_path = os.path.join(self.base_path, dir_name)
            if os.path.exists(dir_path):
                print(f"   ✓ {dir_name}/ - {description}")
            else:
                print(f"   ✗ {dir_name}/ - {description} (FALTANTE)")
    
    def copy_to_clipboard_windows(self):
        """Copiar contenido a portapapeles (Windows)"""
        try:
            if os.path.exists(self.export_file):
                # Leer contenido
                with open(self.export_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Limitar tamaño para portapapeles (primeros 15000 caracteres)
                if len(content) > 15000:
                    content = content[:15000] + "\n\n... [CONTENIDO TRUNCADO - VER ARCHIVO COMPLETO]"
                
                # Usar PowerShell para copiar al portapapeles
                import subprocess
                process = subprocess.Popen(
                    ['powershell', '-Command', 'Set-Clipboard'],
                    stdin=subprocess.PIPE,
                    text=True
                )
                process.communicate(input=content)
                
                print("📋 Contenido copiado al portapapeles (primeros 15,000 caracteres)")
                print("   Puedes pegarlo directamente en el chat")
                return True
        except Exception as e:
            print(f"⚠  No se pudo copiar al portapapeles: {e}")
        
        return False
    
    def open_in_editor(self):
        """Abrir archivo en editor de texto"""
        try:
            if os.name == 'nt':  # Windows
                os.system(f'notepad "{self.export_file}"')
                print("📝 Abriendo en Bloc de Notas...")
            else:  # Linux/Mac
                os.system(f'xdg-open "{self.export_file}"')
                print("📝 Abriendo en editor por defecto...")
        except Exception as e:
            print(f"⚠  Error al abrir el archivo: {e}")
            print(f"   Puedes abrirlo manualmente: {self.export_file}")
    
    def show_preview(self):
        """Mostrar vista previa del contenido"""
        if not os.path.exists(self.export_file):
            print("⚠  Primero debes exportar los códigos")
            return
        
        print("\n👁 VISTA PREVIA (primeras 30 líneas):")
        print("-" * 60)
        
        try:
            with open(self.export_file, 'r', encoding='utf-8') as f:
                lines = []
                for i, line in enumerate(f):
                    if i >= 30:  # Mostrar solo 30 líneas
                        lines.append("... [CONTINÚA EN EL ARCHIVO]")
                        break
                    lines.append(line.rstrip())
            
            for line in lines:
                print(line)
        except Exception as e:
            print(f"Error al leer archivo: {e}")

def main():
    """Función principal"""
    print("🚀 DOCU-MIND-AI - EXPORTADOR DE 4 ARCHIVOS CLAVE")
    print("=" * 60)
    print("Este script exportará específicamente:")
    print("1. Auth Context - apps/web/src/contexts/AuthContext.tsx")
    print("2. API Config - apps/web/src/lib/api.ts")
    print("3. Database config - apps/api/src/shared/db.ts")
    print("4. Routes imports - apps/api/src/index.ts")
    print("=" * 60)
    
    # Verificar directorio
    current_dir = os.getcwd()
    print(f"\n📂 Directorio actual: {current_dir}")
    
    # Verificar si parece ser el proyecto correcto
    expected_items = ["apps", "packages", "package.json"]
    missing_items = [item for item in expected_items if not os.path.exists(os.path.join(current_dir, item))]
    
    if missing_items:
        print(f"\n⚠  Advertencia: No se encontraron algunos elementos:")
        for item in missing_items:
            print(f"   • {item}")
        
        response = input("\n¿Continuar de todos modos? (s/n): ").lower().strip()
        if response != 's':
            print("\nPor favor, ejecuta desde la raíz del proyecto docu-mind-ai-2")
            sys.exit(1)
    
    # Crear exporter
    exporter = DocuMindExporter(current_dir)
    
    while True:
        print("\n" + "=" * 60)
        print("MENÚ PRINCIPAL:")
        print("1. 📝 Exportar los 4 archivos clave (recomendado)")
        print("2. 👁 Mostrar vista previa del archivo exportado")
        print("3. 📋 Copiar al portapapeles (Windows)")
        print("4. 📝 Abrir en Bloc de Notas")
        print("5. 📊 Mostrar información del proyecto")
        print("6. 🚪 Salir")
        
        choice = input("\nSelecciona una opción (1-6): ").strip()
        
        if choice == "1":
            print("\n" + "=" * 60)
            print("EXPORTANDO LOS 4 ARCHIVOS CLAVE...")
            print("=" * 60)
            
            exporter.show_project_info()
            print("\n" + "-" * 60)
            
            exporter.create_codes_file()
            
            # Preguntar si abrir
            open_now = input("\n¿Abrir archivo ahora? (s/n): ").lower().strip()
            if open_now == 's':
                exporter.open_in_editor()
        
        elif choice == "2":
            if os.path.exists(exporter.export_file):
                exporter.show_preview()
            else:
                print("⚠  Primero debes exportar los códigos (opción 1)")
        
        elif choice == "3":
            if os.path.exists(exporter.export_file):
                exporter.copy_to_clipboard_windows()
            else:
                print("⚠  Primero debes exportar los códigos (opción 1)")
        
        elif choice == "4":
            if os.path.exists(exporter.export_file):
                exporter.open_in_editor()
            else:
                print("⚠  Primero debes exportar los códigos (opción 1)")
        
        elif choice == "5":
            exporter.show_project_info()
        
        elif choice == "6":
            print("\n👋 ¡Hasta luego!")
            if os.path.exists(exporter.export_file):
                print(f"\n📄 Archivo creado: {exporter.export_file}")
                print("   Puedes compartir este archivo o copiar su contenido")
            break
        
        else:
            print("❌ Opción inválida. Intenta nuevamente.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠  Operación cancelada por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        print("   Asegúrate de tener permisos de escritura en el directorio")
        sys.exit(1)