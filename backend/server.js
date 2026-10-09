const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caresynciq';

mongoose.set('bufferCommands', false);
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1000 })
  .then(() => console.log('[MongoDB] Connected successfully to caresynciq store'))
  .catch(err => {
    console.warn(`[MongoDB Notice] Operating with in-memory clinical vector cache & filesystem ingestion: ${err.message}`);
  });

// Core Clinical API Routes
app.use('/api', require('./routes/patients'));
app.use('/api', require('./routes/safety'));
app.use('/api', require('./routes/consent'));
app.use('/api', require('./routes/audit'));
app.use('/api', require('./routes/verification'));
app.use('/api', require('./routes/fhir'));
app.use('/api', require('./routes/reports'));
app.use('/api', require('./routes/chat'));
app.use('/api', require('./routes/metrics'));
app.use('/api', require('./routes/upload'));

app.get('/', (req, res) => {
  res.json({
    project: 'CareSyncIQ',
    description: 'Patient-Owned Longitudinal Health Records, Multimodal Ingestion & Safety Engine',
    version: '2.0.0',
    hackathonTrack: 'HealthTech - Lost in Transit: Fragmented Medical Records Across Providers',
    status: 'ONLINE'
  });
});

async function bootstrapClinicalCorpus() {
  try {
    const fs = require('fs');
    const { extractDocument } = require('./middleware/textExtractor');
    const { chunkAndEmbed } = require('./middleware/embedder');
    const { compilePatientDossier } = require('./middleware/reportCompiler');
    const { getInMemoryChunks, registerInMemoryDocument } = require('./middleware/memoryStore');
    const { SEED_DOCUMENTS } = require('./data/seedCorpus');
    const { detectRisks } = require('./middleware/riskDetector');

    if (getInMemoryChunks().length > 0) return;

    console.log('[Bootstrap] Ingesting baseline clinical seed corpus...');
    for (const doc of SEED_DOCUMENTS) {
      registerInMemoryDocument({
        _id: doc._id,
        originalName: doc.originalName,
        documentType: doc.documentType,
        status: doc.status || 'verified',
        uploadDate: new Date(),
        pageCount: doc.pageCount || doc.pages?.length || 1,
        processingMethod: doc.processingMethod || 'digital',
        fileHash: doc.fileHash
      });

      await chunkAndEmbed(doc._id, doc.pages, doc.originalName);
    }
    console.log(`[Bootstrap] Successfully indexed ${SEED_DOCUMENTS.length} baseline medical documents.`);

    // Pre-compile patient dossier for instant access
    await compilePatientDossier('P1001', 'patient_longitudinal_health_record');
    console.log('[Bootstrap] Pre-compiled P1001 longitudinal health record dossier with SHA-256 seal.');

    // Run clinical risk detector
    await detectRisks();
  } catch (err) {
    console.warn('[Bootstrap Notice]', err.message);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CareSyncIQ Backend server running on port ${PORT}`);
  bootstrapClinicalCorpus();
});