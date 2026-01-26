#!/usr/bin/env python3
"""
export_tree_docu_mind.py

Exporta el árbol de archivos similar a `tree /f`,
excluyendo por defecto: node_modules y .git

Uso:
    python3 export_tree_docu_mind.py
    python3 export_tree_docu_mind.py "/ruta" -o salida.txt
"""

import os
import sys
import argparse

# Carpetas excluidas por defecto
EXCLUDE_DIR_NAMES_DEFAULT = {"node_modules", ".git"}

# Directorio por defecto (macOS)
DEFAULT_BASE_PATH = "/Users/MiguelBernal/APPS/REACT/miguel-bernal-developer"

def write_line(out, line: str):
    if out:
        out.write(line + "\n")
    else:
        print(line)

def tree_dir(path, out=None, prefix="", exclude_dirs=None, max_depth=-1, _level=0):
    if exclude_dirs is None:
        exclude_dirs = set()

    try:
        entries = sorted(
            os.scandir(path),
            key=lambda e: (not e.is_dir(), e.name.lower())
        )
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
    parser = argparse.ArgumentParser(
        description="Exporta árbol de directorios estilo tree /f"
    )
    parser.add_argument(
        "path",
        nargs="?",
        default=os.getcwd(),
        help="Ruta a exportar (por defecto, directorio actual)"
    )
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Archivo de salida (ej: tree.txt)"
    )
    parser.add_argument(
        "--exclude",
        nargs="*",
        default=[],
        help="Carpetas adicionales a excluir"
    )
    parser.add_argument(
        "--max-depth",
        type=int,
        default=-1,
        help="Profundidad máxima (-1 sin límite)"
    )
    return parser.parse_args()


def main():
    args = parse_args()

    path = os.path.abspath(os.path.expanduser(args.path))
    if not os.path.exists(path):
        print(f"❌ Error: la ruta no existe → {path}")
        sys.exit(1)

    exclude = set(args.exclude) | EXCLUDE_DIR_NAMES_DEFAULT

    out_file = None
    if args.output:
        output_path = os.path.abspath(os.path.expanduser(args.output))
        output_dir = os.path.dirname(output_path)

        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)

        out_file = open(output_path, "w", encoding="utf-8")

    write_line(out_file, path)
    tree_dir(path, out=out_file, exclude_dirs=exclude, max_depth=args.max_depth)

    if out_file:
        out_file.close()
        print(f"✅ Árbol exportado en: {args.output}")

if __name__ == "__main__":
    main()
