import * as esbuild from 'esbuild';
import stylePlugin from 'esbuild-style-plugin';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const isProduction = process.argv.includes('--production');

const commonOptions = {
  entryPoints: [resolve(rootDir, 'src/index.tsx')],
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  jsxImportSource: 'react',
  entryNames: 'main',
  plugins: [
    stylePlugin({
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    }),
  ],
  define: {
    'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
  },
};

if (isProduction) {
  mkdirSync(resolve(rootDir, 'dist'), { recursive: true });

  await esbuild.build({
    ...commonOptions,
    outdir: resolve(rootDir, 'dist'),
    minify: true,
  });

  const html = readFileSync(resolve(rootDir, 'index.html'), 'utf8').replace(
    /<script>\s*new EventSource[\s\S]*?<\/script>\s*/m,
    ''
  );

  writeFileSync(resolve(rootDir, 'dist/index.html'), html);

  console.log('Build completed successfully!');
} else {
  const ctx = await esbuild.context({
    ...commonOptions,
    outdir: rootDir,
  });

  await ctx.watch();

  const { host, port } = await ctx.serve({
    servedir: rootDir,
  });

  console.log(`Dev server running at http://${host}:${port}`);
}
