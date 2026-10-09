const Chunk = require('../models/Chunk');
const Document = require('../models/Document');
const { generateEmbedding } = require('./embedder');
const { getInMemoryChunks } = require('./memoryStore');

/**
 * Cosine similarity between two dense float vectors.
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

const MULTILINGUAL_SYNONYMS = {
  // Hindi mining terms
  'कोयला': ['coal', 'mining'],
  'उत्पादन': ['production', 'target', 'actual', 'offtake'],
  'लक्ष्य': ['target', 'satisfaction'],
  'वास्तविक': ['actual', 'production'],
  'एसईसीएल': ['secl', 'production', 'target', 'actual'],
  'बीसीसीएल': ['bccl'],
  'सीसीएल': ['ccl'],
  'एनसीएल': ['ncl'],
  'डब्ल्यूसीएल': ['wcl'],
  'एमसीएल': ['mcl'],
  'ईसीएल': ['ecl'],
  'बोरहोल': ['borehole', 'bh', 'litholog'],
  'सीम': ['seam', 'ash', 'gcv'],
  'पर्यावरण': ['environmental', 'clearance', 'caaqm'],
  'भंडार': ['reserves', 'extractable'],
  'गेवरा': ['gevra', 'secl'],
  'झरिया': ['jharia', 'cmpdi'],
  // Kannada mining terms
  'ಕಲ್ಲಿದ್ದಲು': ['coal', 'mining'],
  'ಉತ್ಪಾದನೆ': ['production', 'target', 'actual', 'offtake'],
  'ಗುರಿ': ['target'],
  'ಗಣಿ': ['mine', 'mining', 'opencast'],
  'ಗೆವ್ರ': ['gevra', 'secl'],
  'ಗೆವ್ರಾ': ['gevra', 'secl'],
  'ಪರಿಸರ': ['environmental', 'clearance'],
  'ಮಾಲಿನ್ಯ': ['pollution', 'emission', 'caaqm', 'pm10'],
  'ನಿಯಂತ್ರಣ': ['compliance', 'control'],
  'ದಾಖಲೆ': ['record', 'report', 'litholog'],
  'ಮೀಸಲು': ['reserves']
};

/**
 * Lexical / keyword scoring to boost exact mining terms, seam names, borehole IDs, and numbers.
 * Supports multi-lingual Hindi and Kannada queries via semantic token mapping.
 */
function computeLexicalScore(query, text) {
  if (!query || !text) return 0;
  let qTerms = query.toLowerCase().match(/\b[a-z0-9_-]{2,}\b/g) || [];

  // Multi-lingual expansion for Hindi and Kannada
  for (const [indicWord, englishTerms] of Object.entries(MULTILINGUAL_SYNONYMS)) {
    if (query.includes(indicWord)) {
      qTerms.push(...englishTerms);
    }
  }

  if (qTerms.length === 0) return 0;

  const targetText = text.toLowerCase();
  let hits = 0;
  let exactMatchBoost = 0;

  for (const term of qTerms) {
    if (targetText.includes(term)) {
      hits++;
      // High boost for specific entity identifiers
      if (/^(seam|bh|cmpdi|secl|mcl|bccl|ccl|ecl|ncl|wcl|\d+(\.\d+)?)/i.test(term)) {
        exactMatchBoost += 0.2;
      }
    }
  }

  const baseScore = hits / qTerms.length;
  return Math.min(1.0, baseScore + exactMatchBoost);
}

/**
 * Hybrid retrieval engine combining dense vector embeddings and lexical matching.
 * Implements filtering by subsidiary, documentType, and verified status.
 */
async function hybridRetrieve({
  query,
  filter = {},
  topK = 5,
  alpha = 0.75, // Weight on dense vector similarity (0.75 vector, 0.25 lexical)
  minScore = 0.20
}) {
  const startTime = Date.now();

  // 1. Generate local dense query embedding with fallback protection
  let queryEmbedding;
  try {
    queryEmbedding = await generateEmbedding(query);
  } catch (err) {
    console.warn('[vectorStore] Query embedding notice, using vector fallback:', err.message);
    const { generateFallbackEmbedding } = require('./embedder');
    queryEmbedding = generateFallbackEmbedding(query);
  }

  // 2. Fetch candidate chunks from MongoDB, falling back to inMemoryChunks
  let candidates = [];
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const chunkFilter = {};
      if (filter.verifiedOnly) {
        chunkFilter.verified = true;
      }
      if (filter.documentName) {
        chunkFilter.documentName = new RegExp(filter.documentName, 'i');
      }

      if (filter.documentType) {
        const matchingDocs = await Document.find({ documentType: filter.documentType }).select('_id');
        const docIds = matchingDocs.map(d => d._id);
        chunkFilter.documentId = { $in: docIds };
      }

      candidates = await Chunk.find(chunkFilter).populate('documentId', 'originalName filename documentType uploadDate verified');
    }
  } catch (err) {
    // Non-fatal if MongoDB is disconnected in standalone demo mode
  }

  if (!candidates || candidates.length === 0) {
    const memChunks = getInMemoryChunks();
    candidates = memChunks.filter(c => {
      if (filter.verifiedOnly && c.verified === false) return false;
      if (filter.documentName && !new RegExp(filter.documentName, 'i').test(c.documentName)) return false;
      if (filter.documentType && c.documentType !== filter.documentType) return false;
      return true;
    });
  }

  if (!candidates || candidates.length === 0) {
    return {
      query,
      results: [],
      totalCandidates: 0,
      elapsedMs: Date.now() - startTime
    };
  }

  // 3. Calculate hybrid scores across all candidates
  const scored = candidates
    .filter(c => c && c.chunkText)
    .map(chunk => {
      const hasVec = Array.isArray(chunk.embedding) && chunk.embedding.length > 0;
      const vecScore = hasVec ? cosineSimilarity(queryEmbedding, chunk.embedding) : 0;
      const lexScore = computeLexicalScore(query, chunk.chunkText);
      const combinedScore = hasVec
        ? ((alpha * vecScore) + ((1 - alpha) * lexScore))
        : lexScore;

      // Extract document metadata
      const docName = chunk.documentName || chunk.documentId?.originalName || chunk.documentId?.filename || 'Unknown Document';
      const docType = chunk.documentType || chunk.documentId?.documentType || 'general';

      return {
        chunkId: chunk._id,
        documentId: chunk.documentId?._id || chunk.documentId,
        sourceDocumentName: docName,
        pageNumber: chunk.pageNumber || 1,
        section: chunk.section || `Page ${chunk.pageNumber || 1}`,
        extractionTimestamp: chunk.extractionTimestamp || chunk.createdAt || new Date(),
        verified: chunk.verified !== false,
        documentType: docType,
        chunkText: chunk.chunkText,
        denseScore: Number(vecScore.toFixed(4)),
        lexicalScore: Number(lexScore.toFixed(4)),
        relevanceScore: Number(combinedScore.toFixed(4))
      };
    })
    .filter(item => item.relevanceScore >= Math.min(minScore, 0.10) || item.lexicalScore > 0.15)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, topK);

  return {
    query,
    results: scored,
    totalCandidates: candidates.length,
    elapsedMs: Date.now() - startTime
  };
}

module.exports = {
  cosineSimilarity,
  computeLexicalScore,
  hybridRetrieve
};
