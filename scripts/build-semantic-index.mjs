import { buildSemanticIndex, modelId } from '../server/semanticSearch.js';

const count = await buildSemanticIndex();
console.log(`Built local semantic index with ${count} documents using ${modelId}.`);
