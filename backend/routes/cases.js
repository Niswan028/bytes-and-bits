const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { FORENSIC_CASES } = require('../data/forensicCasesData');
const { correlateDocumentPacket } = require('../middleware/crossDocCorrelator');

// In-memory cases store initialized from FORENSIC_CASES
let casesStore = JSON.parse(JSON.stringify(FORENSIC_CASES));

/**
 * GET /api/cases
 * List all active forensic cases with high-level metrics
 */
router.get('/cases', (req, res) => {
  const summaryList = casesStore.map(c => ({
    id: c.id,
    caseNumber: c.caseNumber,
    title: c.title,
    targetEntity: c.targetEntity,
    sector: c.sector,
    status: c.status,
    riskScore: c.riskScore,
    severity: c.severity,
    verdict: c.verdict,
    verdictSummary: c.verdictSummary,
    documentCount: c.documents.length,
    correlationConflictCount: c.crossDocCorrelations.length,
    createdDate: c.createdDate,
    assignedInvestigator: c.assignedInvestigator
  }));

  res.json({
    success: true,
    count: summaryList.length,
    cases: summaryList
  });
});

/**
 * GET /api/cases/:id
 * Retrieve comprehensive forensic case file
 */
router.get('/cases/:id', (req, res) => {
  const { id } = req.params;
  const caseItem = casesStore.find(c => c.id.toLowerCase() === id.toLowerCase() || c.caseNumber.toLowerCase() === id.toLowerCase());

  if (!caseItem) {
    return res.status(404).json({ success: false, error: `Case ${id} not found.` });
  }

  res.json({
    success: true,
    case: caseItem
  });
});

/**
 * POST /api/cases/:id/verify
 * Investigator triage decision update & chain of custody recording
 */
router.post('/cases/:id/verify', (req, res) => {
  const { id } = req.params;
  const { decision, notes, investigatorName } = req.body;

  const caseItem = casesStore.find(c => c.id.toLowerCase() === id.toLowerCase());
  if (!caseItem) {
    return res.status(404).json({ success: false, error: `Case ${id} not found.` });
  }

  const timestamp = new Date().toISOString();
  const actor = investigatorName || 'SOC Senior Analyst';
  const sha256Seal = crypto.createHash('sha256').update(`${caseItem.id}-${timestamp}-${decision}-${actor}`).digest('hex');

  caseItem.status = decision || 'TRIAGE_CONFIRMED';
  caseItem.chainOfCustody.push({
    timestamp,
    actor,
    action: `INVESTIGATOR_${decision.toUpperCase()}`,
    details: notes || `Investigator affirmed forensic triage status: ${decision}`,
    sha256Seal
  });

  res.json({
    success: true,
    message: 'Triage decision recorded to tamper-evident audit ledger',
    case: caseItem
  });
});

/**
 * POST /api/cases
 * Ingest or create a new forensic case
 */
router.post('/cases', (req, res) => {
  const { title, targetEntity, sector, documents } = req.body;

  const newId = `CASE-2026-${String(casesStore.length + 106).padStart(3, '0')}`;
  const caseNumber = `DFIR-2026-${String(casesStore.length + 106).padStart(3, '0')}-AUTO`;

  const newCase = {
    id: newId,
    caseNumber,
    title: title || 'New Forensics Investigation Case',
    targetEntity: targetEntity || 'Unknown Entity',
    sector: sector || 'Corporate SOC / DFIR',
    status: 'INGESTED',
    riskScore: 65,
    severity: 'MEDIUM',
    verdict: 'PENDING_TRIAGE',
    verdictSummary: 'Case documents ingested into automated DFIR pipeline. Correlation and visual forensics in progress.',
    createdDate: new Date().toISOString(),
    assignedInvestigator: 'Unassigned (Queue Triage)',
    documents: documents || [],
    crossDocCorrelations: documents ? correlateDocumentPacket(documents) : [],
    chainOfCustody: [
      {
        timestamp: new Date().toISOString(),
        actor: 'Case Intake API Gateway',
        action: 'CASE_INITIALIZED',
        details: 'Initial case dossier registered with automated baseline hashing.',
        sha256Seal: crypto.createHash('sha256').update(newId + Date.now()).digest('hex')
      }
    ]
  };

  casesStore.unshift(newCase);
  res.status(201).json({ success: true, case: newCase });
});

module.exports = router;
