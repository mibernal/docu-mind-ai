#!/usr/bin/env python3
"""
export_tree_docu_mind.py

Exporta el árbol de archivos similar a `tree /f`,
excluyendo por defecto: node_modules y .git

Uso:
    python export_tree_docu_mind.py
    python export_tree_docu_mind.py "C:\\ruta" -o salida.txt
"""

import os
import sys
import argparse

# Carpetas excluidas por defecto
EXCLUDE_DIR_NAMES_DEFAULT = {"node_modules", ".git"}

def write_line(out, line: str):
    if out:
        out.write(line + "\n")
    else:
        print(line)

def tree_dir(path, out=None, prefix="", exclude_dirs=None, max_depth=-1, _level=0):
    if exclude_dirs is None:
        exclude_dirs = set()

    try:
        entries = sorted(os.scandir(path), key=lambda e: (not e.is_dir(), e.name.lower()))
    except PermissionError:
        write_line(out, prefix + "[ACCESS DENIED]")
        return
    except FileNotFoundError:
        write_line(out, prefix + "[NOT FOUND]")
        return

    total = len(entries)
    for idx, entry in enumerate(entries):
        connector = "└── " if idx == total - 1 else "├── "
        is_dir = entry.is_dir(follow_symlinks=False)

        # Excluir carpetas por nombre
        if is_dir and entry.name in exclude_dirs:
            write_line(out, prefix + connector + entry.name + " [excluded]")
            continue

        write_line(out, prefix + connector + entry.name)

        if is_dir:
            if max_depth >= 0 and _level >= max_depth:
                continue

            extension = "    " if idx == total - 1 else "│   "
            tree_dir(
                entry.path,
                out=out,
                prefix=prefix + extension,
                exclude_dirs=exclude_dirs,
                max_depth=max_depth,
                _level=_level + 1
            )

def parse_args():
    parser = argparse.ArgumentParser(description="Exporta árbol de directorios estilo tree /f")
    parser.add_argument("path", nargs="?", default=r"C:\Users\info\OneDrive\Documentos\Programacion\React\docu-mind-ai-2")
    parser.add_argument("-o", "--output", default=None)
    parser.add_argument("--exclude", nargs="*", default=[], help="Carpetas adicionales a excluir")
    parser.add_argument("--max-depth", type=int, default=-1)
    return parser.parse_args()

def main():
    args = parse_args()

    path = os.path.expanduser(args.path)
    if not os.path.exists(path):
        print(f"Error: ruta no existe → {path}")
        sys.exit(1)

    # Combinar exclusiones del usuario + default
    exclude = set(args.exclude) | EXCLUDE_DIR_NAMES_DEFAULT

    out_file = None
    if args.output:
        out_file = open(args.output, "w", encoding="utf-8")

    write_line(out_file, path)
    tree_dir(path, out=out_file, exclude_dirs=exclude, max_depth=args.max_depth)

    if out_file:
        out_file.close()

if __name__ == "__main__":
    main()
