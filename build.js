const esbuild = require('esbuild');

esbuild.build({
  target: 'esnext',
  format: 'esm',
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'build/index.js',
  external: ["print-to-terminal", "get-payload", "receive", "send-request", "send-requests", "send-response", "send-and-await-response", "save-capabilities"],
}).catch(() => process.exit(1));
