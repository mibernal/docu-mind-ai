import os

# Ruta base del proyecto
BASE_PATH = r"C:\Users\info\OneDrive\Documentos\Programacion\React\docu-mind-ai-2"

# Carpetas y archivos a excluir
EXCLUDE_DIRS = {"node_modules", ".git", "dist", "build", ".next", "__pycache__"}
EXCLUDE_FILES = {"package-lock.json", "yarn.lock"}

def generate_tree(start_path, prefix=""):
    items = sorted(os.listdir(start_path))
    items = [i for i in items if i not in EXCLUDE_FILES]  # excluir archivos

    count = len(items)
    for index, item in enumerate(items):
        path = os.path.join(start_path, item)
        connector = "└── " if index == count - 1 else "├── "
        
        # Si es directorio
        if os.path.isdir(path):
            if item in EXCLUDE_DIRS:
                continue
            print(prefix + connector + item + "/")
            new_prefix = prefix + ("    " if index == count - 1 else "│   ")
            generate_tree(path, new_prefix)
        else:
            print(prefix + connector + item)

if __name__ == "__main__":
    print(f"Árbol de directorios de {BASE_PATH}\n")
    generate_tree(BASE_PATH)
