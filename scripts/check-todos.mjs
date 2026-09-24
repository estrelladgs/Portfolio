// Lists every TODO_ marker (missing real data) and fails if any remain.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src', 'index.html'];
const PATTERN = /TODO_[A-Z0-9_]+/g;

function walk(path) {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).flatMap((name) => walk(join(path, name)));
}

const hits = [];
for (const file of ROOTS.flatMap(walk)) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const match of line.matchAll(PATTERN)) hits.push(`${file}:${i + 1}  ${match[0]}`);
    });
}

if (hits.length) {
  console.log(`${hits.length} TODO_ pendiente(s):\n${hits.join('\n')}`);
  process.exit(1);
}
console.log('Sin TODO_ pendientes.');
