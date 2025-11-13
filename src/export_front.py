import os
import pathlib

def export_frontend_code(base_path=".", output_file="codigos_frontend.txt"):
    """
    Exporta el código del frontend excluyendo la carpeta components/ui
    """
    # Extensiones de archivos a incluir
    included_extensions = {'.tsx', '.ts', '.js', '.jsx', '.css', '.json', '.cjs', '.mjs'}
    
    # Carpeta a excluir
    excluded_folder = "components/ui"
    
    with open(output_file, 'w', encoding='utf-8') as output:
        output.write("=== CÓDIGO DEL FRONTEND ===\n\n")
        
        # Contador de archivos procesados
        file_count = 0
        
        # Recorrer todos los archivos recursivamente
        for file_path in pathlib.Path(base_path).rglob('*'):
            if file_path.is_file():
                # Verificar extensión
                if file_path.suffix in included_extensions:
                    # Obtener ruta relativa
                    relative_path = file_path.relative_to(base_path)
                    relative_path_str = str(relative_path)
                    
                    # Excluir la carpeta components/ui
                    if excluded_folder in relative_path_str:
                        continue
                    
                    # Obtener la categoría para organizar mejor
                    category = get_category(relative_path_str)
                    
                    # Escribir categoría si es nueva
                    if not hasattr(export_frontend_code, 'current_category') or export_frontend_code.current_category != category:
                        output.write(f"\n{'='*60}\n")
                        output.write(f"CATEGORÍA: {category}")
                        output.write(f"\n{'='*60}\n\n")
                        export_frontend_code.current_category = category
                    
                    output.write(f"\n--- {relative_path} ---\n")
                    output.write("```\n")
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as file:
                            content = file.read()
                            output.write(content)
                            file_count += 1
                    except UnicodeDecodeError:
                        try:
                            with open(file_path, 'r', encoding='latin-1') as file:
                                content = file.read()
                                output.write(content)
                                file_count += 1
                        except Exception as e:
                            output.write(f"# Error leyendo archivo: {e}\n")
                    except Exception as e:
                        output.write(f"# Error leyendo archivo: {e}\n")
                    
                    output.write("\n```\n")
                    output.write(f"\n{'─'*50}\n")
        
        return file_count

def get_category(file_path):
    """
    Determina la categoría basada en la ruta del archivo
    """
    file_path_str = str(file_path)
    
    if file_path_str.startswith('components/dashboard'):
        return 'COMPONENTES - DASHBOARD'
    elif file_path_str.startswith('components/documents'):
        return 'COMPONENTES - DOCUMENTOS'
    elif file_path_str.startswith('components/layout'):
        return 'COMPONENTES - LAYOUT'
    elif file_path_str.startswith('components/'):
        return 'COMPONENTES - GENERAL'
    elif file_path_str.startswith('hooks/'):
        return 'HOOKS PERSONALIZADOS'
    elif file_path_str.startswith('lib/'):
        return 'LIBRERÍAS Y UTILIDADES'
    elif file_path_str.startswith('pages/'):
        return 'PÁGINAS'
    elif file_path_str.startswith('types/'):
        return 'TIPOS Y DEFINICIONES'
    elif file_path_str in ['App.tsx', 'main.tsx', 'index.css', 'vite-env.d.ts']:
        return 'ARCHIVOS PRINCIPALES'
    else:
        return 'OTROS ARCHIVOS'

def main():
    """
    Función principal que verifica el directorio actual y exporta el código del frontend
    """
    print("🔍 Verificando estructura del frontend...")
    
    # Verificar que estamos en la carpeta correcta del frontend
    current_dir = os.listdir('.')
    expected_files = ['App.tsx', 'main.tsx', 'components']
    
    has_expected_files = any(file in current_dir for file in expected_files)
    
    if not has_expected_files:
        print("❌ No se encuentra la estructura esperada del frontend")
        print("💡 Asegúrate de ejecutar este script desde la carpeta raíz del frontend")
        return
    
    print("✅ Estructura del frontend verificada")
    
    # Nombre del archivo de salida
    output_filename = "codigos_frontend_exportados.txt"
    
    # Exportar el código
    print(f"\n📝 Exportando código a: {output_filename}")
    print("🚫 Excluyendo carpeta: components/ui")
    
    file_count = export_frontend_code(".", output_filename)
    
    print(f"✅ Exportación completada exitosamente!")
    print(f"📊 Archivos procesados: {file_count}")
    
    print("\n📋 Resumen de archivos incluidos:")
    print("   • React/TypeScript (.tsx, .ts)")
    print("   • JavaScript (.js, .jsx)")
    print("   • Estilos (.css)")
    print("   • Configuración (.json, .cjs, .mjs)")
    print(f"\n🚫 Carpeta excluida: components/ui")

if __name__ == "__main__":
    # Resetear la variable de categoría
    if hasattr(export_frontend_code, 'current_category'):
        delattr(export_frontend_code, 'current_category')
    main()