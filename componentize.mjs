import { componentize } from '@bytecodealliance/componentize-js';
import { readFile, writeFile } from 'node:fs/promises';

const jsSource = await readFile('build/index.js', 'utf8');
const witSource = await readFile('wit/uqbar.wit', 'utf8');

const { component } = await componentize(jsSource, witSource);

await writeFile('example.wasm', component);
