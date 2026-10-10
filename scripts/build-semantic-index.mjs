import { buildSemanticIndex, modelId } from '../server/semanticSearch.js';

const count = await buildSemanticIndex();
console.log(`Built local personal semantic index with ${count} verified documents using ${modelId}.`);
