/**
 * fix-imports.js
 *
 * jscodeshift transform para convertir paths que apuntan a:
 *  - server/  (o ../../server/ or ../server/)
 *  - server/src/ (o ../../server/src/)
 *  - src/     (o ../../src/ or ../src/)
 *
 * en aliases:
 *  - @backend/<rest>
 *  - @frontend/<rest>
 *
 * Uso recomendado (dry-run primero):
 * npx jscodeshift -t fix-imports.js packages -d --extensions=ts,tsx,js,jsx --parser=tsx
 *
 * WARNING: revisar cambios con git diff / git add -p antes de commitear.
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // función auxiliar: transforma un specifier 'path' si coincide con patrones
  function transformPath(p) {
    if (typeof p !== 'string') return null;

    // Normalize slashes
    const raw = p;

    // Patterns:
    // 1) relative like ../../server/src/whatever  OR  ../../server/whatever
    // 2) absolute-like 'server/src/whatever' or 'server/whatever'
    // 3) relative to src: ../../src/whatever  OR  src/whatever
    // We capture the trailing part (rest) to append to alias.

    // server (maybe with src)
    const m1 = raw.match(/^(?:\.\/|\.\.\/)*server(?:\/src)?\/?(.*)/);
    if (m1 && m1[1] !== undefined) {
      const rest = m1[1] || '';
      const out = rest.length ? `@backend/${rest}` : `@backend`;
      return out;
    }

    // src (frontend)
    const m2 = raw.match(/^(?:\.\/|\.\.\/)*src\/?(.*)/);
    if (m2 && m2[1] !== undefined) {
      const rest = m2[1] || '';
      const out = rest.length ? `@frontend/${rest}` : `@frontend`;
      return out;
    }

    // Also handle top-level 'server' without slash
    const m3 = raw.match(/^server$/);
    if (m3) return '@backend';

    // no match
    return null;
  }

  // process ImportDeclaration and ExportAllDeclaration / ExportNamedDeclaration with source
  root.find(j.ImportDeclaration).forEach(path => {
    const spec = path.node.source && path.node.source.value;
    if (!spec || typeof spec !== 'string') return;
    const updated = transformPath(spec);
    if (updated && updated !== spec) {
      path.node.source = j.literal(updated);
    }
  });

  root.find(j.ExportNamedDeclaration).forEach(path => {
    if (path.node.source && path.node.source.value) {
      const spec = path.node.source.value;
      const updated = transformPath(spec);
      if (updated && updated !== spec) {
        path.node.source = j.literal(updated);
      }
    }
  });

  root.find(j.ExportAllDeclaration).forEach(path => {
    if (path.node.source && path.node.source.value) {
      const spec = path.node.source.value;
      const updated = transformPath(spec);
      if (updated && updated !== spec) {
        path.node.source = j.literal(updated);
      }
    }
  });

  // process require('...') calls
  root.find(j.CallExpression, {
    callee: { name: 'require' }
  }).forEach(path => {
    const args = path.node.arguments;
    if (!args || !args.length) return;
    const first = args[0];
    if (first.type === 'Literal' && typeof first.value === 'string') {
      const spec = first.value;
      const updated = transformPath(spec);
      if (updated && updated !== spec) {
        path.node.arguments[0] = j.literal(updated);
      }
    }
  });

  // Also process dynamic imports: import('...')
  root.find(j.ImportExpression).forEach(path => {
    const arg = path.node.source || path.node.arguments && path.node.arguments[0];
    if (!arg) return;
    if (arg.type === 'Literal' && typeof arg.value === 'string') {
      const spec = arg.value;
      const updated = transformPath(spec);
      if (updated && updated !== spec) {
        // Replace expression with import('updated')
        path.node.source = j.literal(updated);
      }
    }
  });

  return root.toSource({ quote: 'single' });
};
