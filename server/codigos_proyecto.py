import os
import pathlib

def export_project_code(base_path=".", output_file="codigos_proyecto.txt"):
    """
    Exporta el código de las carpetas src y prisma a un archivo organizado
    """
    # Carpetas que nos interesan
    target_folders = ['src', 'prisma']
    
    # Extensiones de archivos a incluir
    included_extensions = {'.ts', '.js', '.prisma', '.json', '.toml', '.cjs', '.sql'}
    
    with open(output_file, 'w', encoding='utf-8') as output:
        output.write("=== CÓDIGO DEL PROYECTO SERVER ===\n\n")
        
        for folder in target_folders:
            folder_path = os.path.join(base_path, folder)
            
            if not os.path.exists(folder_path):
                print(f"⚠️ Advertencia: No se encontró la carpeta {folder}")
                continue
                
            output.write(f"\n{'='*60}\n")
            output.write(f"CARPETA: {folder.upper()}")
            output.write(f"\n{'='*60}\n\n")
            
            # Recorrer todos los archivos recursivamente
            for file_path in pathlib.Path(folder_path).rglob('*'):
                if file_path.is_file():
                    # Verificar extensión
                    if file_path.suffix in included_extensions:
                        # Obtener ruta relativa para mejor organización
                        relative_path = file_path.relative_to(base_path)
                        
                        output.write(f"\n--- {relative_path} ---\n")
                        output.write("```\n")
                        
                        try:
                            with open(file_path, 'r', encoding='utf-8') as file:
                                content = file.read()
                                output.write(content)
                        except UnicodeDecodeError:
                            # Si hay problemas de codificación, intentar con otra
                            try:
                                with open(file_path, 'r', encoding='latin-1') as file:
                                    content = file.read()
                                    output.write(content)
                            except Exception as e:
                                output.write(f"# Error leyendo archivo: {e}\n")
                        except Exception as e:
                            output.write(f"# Error leyendo archivo: {e}\n")
                        
                        output.write("\n```\n")
                        output.write(f"\n{'─'*50}\n")

def main():
    """
    Función principal que verifica el directorio actual y exporta el código
    """
    print("🔍 Verificando estructura del proyecto...")
    
    # Verificar que estamos en la carpeta correcta
    current_dir = os.listdir('.')
    has_src = 'src' in current_dir
    has_prisma = 'prisma' in current_dir
    
    if not has_src and not has_prisma:
        print("❌ No se encuentran las carpetas 'src' y 'prisma'")
        print("💡 Asegúrate de ejecutar este script desde la carpeta 'server'")
        return
    
    print("✅ Estructura del proyecto verificada:")
    if has_src:
        print("   📁 src - Encontrado")
    if has_prisma:
        print("   📁 prisma - Encontrado")
    
    # Nombre del archivo de salida
    output_filename = "codigos_proyecto_exportados.txt"
    
    # Exportar el código
    print(f"\n📝 Exportando código a: {output_filename}")
    export_project_code(".", output_filename)
    
    print("✅ Exportación completada exitosamente!")
    print("\n📋 Resumen de archivos incluidos:")
    print("   • TypeScript (.ts)")
    print("   • JavaScript (.js)")
    print("   • Prisma (.prisma, .sql)")
    print("   • Configuración (.json, .toml, .cjs)")

if __name__ == "__main__":
    main()