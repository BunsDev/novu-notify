import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// More precise path resolution
const projectRoot = path.resolve(__dirname, '..', '..');
const apiRoot = path.resolve(projectRoot, 'api');
const srcPath = path.resolve(apiRoot, 'src');
const metadataPath = path.resolve(srcPath, 'metadata.ts');

// Ensure directories exist
fs.mkdirSync(path.dirname(metadataPath), { recursive: true });

/*
 * We create an empty metadata file to ensure that files importing `metadata.ts`
 * will compile successfully before the metadata generation occurs.
 */
const defaultContent = `export default async () => { return {}; };`;

fs.writeFileSync(metadataPath, defaultContent, 'utf8');
console.log('metadata.ts file has been generated with default content.');

// Wrap in try-catch for better error handling
try {
  const generator = new PluginMetadataGenerator();
  generator.generate({
    visitors: [new ReadonlyVisitor({ introspectComments: true, pathToSource: srcPath })],
    outputDir: srcPath,
    tsconfigPath: 'tsconfig.build.json',
  });
} catch (error) {
  console.error('Error generating metadata:', error);
  process.exit(1);
}
