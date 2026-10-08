import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env, pipeline } from '@huggingface/transformers';
import { portfolioKnowledge } from './semanticKnowledge.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modelId = 'Xenova/all-MiniLM-L6-v2';
const indexPath = path.join(root, 'server', 'data', 'portfolio-embeddings.json');
env.cacheDir = path.join(root, '.cache', 'transformers');

env.backends.onnx.wasm.numThreads = 1;

let extractorPromise;
let knowledgePromise;

function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', modelId, { dtype: 'q8' });
  }
  return extractorPromise;
}

async function embed(text) {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

function validRecord(record) {
  return record && typeof record.id === 'string' && typeof record.text === 'string'
    && typeof record.answer === 'string' && Array.isArray(record.embedding) && record.embedding.length > 0;
}

async function loadKnowledge() {
  if (knowledgePromise) return knowledgePromise;
  knowledgePromise = (async () => {
    try {
      const saved = JSON.parse(await fs.readFile(indexPath, 'utf8'));
      if (Array.isArray(saved) && saved.length > 0 && saved.every(validRecord)) return saved;
    } catch {
      // Build the index lazily for local development when no generated index is present.
    }
    return Promise.all(portfolioKnowledge.map(async (item) => ({ ...item, embedding: await embed(item.text) })));
  })();
  return knowledgePromise;
}

function cosineSimilarity(a, b) {
  let score = 0;
  const length = Math.min(a.length, b.length);
  for (let index = 0; index < length; index += 1) score += a[index] * b[index];
  return score;
}

export async function searchPortfolio(question, { threshold = 0.38, topK = 3 } = {}) {
  if (!String(question ?? '').trim()) return null;
  const queryEmbedding = await embed(String(question).trim());
  const knowledge = await loadKnowledge();
  const matches = knowledge
    .map((item) => ({ ...item, score: cosineSimilarity(queryEmbedding, item.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  const best = matches[0];
  if (!best || best.score < threshold) return null;
  return best;
}

export async function buildSemanticIndex() {
  const records = await Promise.all(portfolioKnowledge.map(async (item) => ({ ...item, embedding: await embed(item.text) })));
  await fs.mkdir(path.dirname(indexPath), { recursive: true });
  await fs.writeFile(indexPath, `${JSON.stringify(records)}\n`);
  return records.length;
}

export { modelId };
