/** Resolves the `@/*` tsconfig path alias for `node --test`. */
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), '..');

export function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    let p = resolvePath(ROOT, specifier.slice(2));
    if (!existsSync(p)) {
      for (const ext of ['.ts', '.tsx', '/index.ts']) {
        if (existsSync(p + ext)) {
          p += ext;
          break;
        }
      }
    }
    return next(pathToFileURL(p).href, context);
  }
  return next(specifier, context);
}
