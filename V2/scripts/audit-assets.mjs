import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(repoRoot, 'src');
const publicGameRoot = path.join(repoRoot, 'public/assets/game');
const finalAssetPrefix = 'images-finales-gpt-image/';
const moduleCache = new Map();
const markdown = process.argv.includes('--markdown');

function normalizeModulePath(fromFile, specifier) {
  if (!specifier.startsWith('.')) {
    throw new Error(`Unsupported import in audit: ${specifier}`);
  }

  const fromDir = path.dirname(fromFile);
  const absolute = path.resolve(fromDir, specifier);
  const withExtension = absolute.endsWith('.ts') ? absolute : `${absolute}.ts`;
  return withExtension;
}

function loadTsModule(fileName) {
  const absoluteFileName = path.resolve(srcRoot, fileName);
  if (moduleCache.has(absoluteFileName)) return moduleCache.get(absoluteFileName).exports;

  const source = fs.readFileSync(absoluteFileName, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(absoluteFileName, module);

  const context = {
    exports: module.exports,
    module,
    require: (specifier) => loadTsModule(path.relative(srcRoot, normalizeModulePath(absoluteFileName, specifier))),
  };

  vm.createContext(context);
  vm.runInContext(compiled, context, { filename: absoluteFileName });
  return module.exports;
}

function cleanAssetFile(assetFile) {
  return assetFile.split('?')[0];
}

function assetStatus(assetFile) {
  const cleanFile = cleanAssetFile(assetFile);
  const status = [];

  if (!cleanFile.startsWith(finalAssetPrefix)) {
    status.push('not-final-folder');
  }

  if (cleanFile.includes('islands-gpt-image') || cleanFile.includes('/islands/')) {
    status.push('old-folder');
  }

  const absoluteFile = path.join(publicGameRoot, cleanFile);
  if (!fs.existsSync(absoluteFile)) {
    status.push('missing-file');
  }

  return {
    cleanFile,
    ok: status.length === 0,
    status: status.length ? status.join(', ') : 'ok',
  };
}

function sourceForTechnology(technology, purchases) {
  return technology.sourceId ?? purchases.find((purchase) => purchase.id === technology.targetPurchaseId)?.sourceId ?? '';
}

function rowsFromData(data) {
  const { purchases, technologies } = data;

  return [
    ...purchases
      .filter((purchase) => Boolean(purchase.assetFile))
      .map((purchase) => ({
        kind: 'achat',
        id: purchase.id,
        label: purchase.label,
        age: purchase.ageId,
        source: purchase.sourceId,
        assetFile: purchase.assetFile,
      })),
    ...technologies
      .filter((technology) => Boolean(technology.assetFile))
      .map((technology) => ({
        kind: 'tech',
        id: technology.id,
        label: technology.label,
        age: technology.ageId,
        source: sourceForTechnology(technology, purchases),
        assetFile: technology.assetFile,
      })),
  ].map((row) => ({
    ...row,
    ...assetStatus(row.assetFile),
  }));
}

function escapeCell(value) {
  return String(value).replaceAll('|', '\\|');
}

function printMarkdown(rows, duplicateRows) {
  console.log('| Type | Id | Age | Source | Image | Statut |');
  console.log('| --- | --- | --- | --- | --- | --- |');
  for (const row of rows) {
    console.log(
      `| ${escapeCell(row.kind)} | ${escapeCell(row.id)} | ${escapeCell(row.age)} | ${escapeCell(row.source)} | ${escapeCell(row.cleanFile)} | ${escapeCell(row.status)} |`,
    );
  }

  if (!duplicateRows.length) return;

  console.log('\n### Images reutilisees');
  console.log('| Image | Usages |');
  console.log('| --- | --- |');
  for (const duplicate of duplicateRows) {
    console.log(
      `| ${escapeCell(duplicate.file)} | ${escapeCell(duplicate.usages.join(', '))} |`,
    );
  }
}

function printPlain(rows, duplicateRows) {
  console.log(`Asset audit: ${rows.length} runtime mappings checked.`);
  const errors = rows.filter((row) => !row.ok);

  if (errors.length) {
    console.table(
      errors.map((row) => ({
        type: row.kind,
        id: row.id,
        status: row.status,
        file: row.cleanFile,
      })),
    );
  }

  if (duplicateRows.length) {
    console.log(`Image reuse warnings: ${duplicateRows.length}`);
    console.table(
      duplicateRows.map((row) => ({
        file: row.file,
        usages: row.usages.join(', '),
      })),
    );
  }

  if (!errors.length) {
    console.log('Asset audit passed: no missing or old runtime asset path.');
  }
}

const data = loadTsModule('game/data.ts');
const rows = rowsFromData(data);
const duplicates = Array.from(
  rows.reduce((map, row) => {
    const items = map.get(row.cleanFile) ?? [];
    items.push(`${row.kind}:${row.id}`);
    map.set(row.cleanFile, items);
    return map;
  }, new Map()),
)
  .filter(([, usages]) => usages.length > 1)
  .map(([file, usages]) => ({ file, usages }));

if (markdown) {
  printMarkdown(rows, duplicates);
} else {
  printPlain(rows, duplicates);
}

const hasErrors = rows.some((row) => !row.ok);
if (hasErrors) process.exit(1);
