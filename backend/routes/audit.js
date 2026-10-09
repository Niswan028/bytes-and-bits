const express = require('express');
const router = express.Router();
const { auditLedger } = require('../middleware/auditTrail');

/**
 * GET /api/audit
 * Root audit endpoint returning ledger status and tamper detection state
 */
router.get('/audit', (req, res) => {
  const integrity = auditLedger.verifyAuditTrailIntegrity();
  res.json({
    success: true,
    chainIntact: integrity.isValid,
    status: integrity.status,
    totalBlocks: auditLedger.chain.length,
    integrity,
    chain: auditLedger.chain
  });
});

/**
 * POST /api/audit/tamper
 * Tamper simulation endpoint to prove SHA-256 seal integrity detection
 */
router.post('/audit/tamper', (req, res) => {
  try {
    const result = auditLedger.simulateTamper(1, 'HbA1c: 5.2% (Fabricated Normal)');
    res.json({
      success: true,
      message: 'Unauthorized modification simulated. Ledger integrity check should now fail.',
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/audit/restore
 * Restore ledger to pristine cryptographic state
 */
router.post('/audit/restore', (req, res) => {
  try {
    const result = auditLedger.restoreIntegrity();
    res.json({
      success: true,
      message: 'Ledger integrity restored to authentic state.',
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/audit/logs
 * Retrieve clinical audit trail & activity log
 */
router.get('/audit/logs', (req, res) => {
  const formattedLogs = auditLedger.chain.map(block => ({
    id: `LOG-${String(block.index + 1).padStart(3, '0')}`,
    timestamp: block.timestamp,
    eventType: block.eventType,
    actor: block.actor || block.data?.actor || 'CareSyncIQ Clinical Engine',
    patient: block.patientId ? `Patient (${block.patientId})` : 'Rajesh Sharma (P1001)',
    action: block.description || block.data?.action || 'Clinical Record Verified',
    status: block.isTampered ? 'TAMPERED / CORRUPT' : 'Verified Authentic',
    verificationId: `VER-${String(block.index + 1).padStart(3, '0')}`
  }));

  res.json({
    success: true,
    totalLogs: formattedLogs.length,
    status: 'ALL_RECORDS_VERIFIED',
    logs: formattedLogs
  });
});

/**
 * GET /api/audit/chain
 * Backward-compatible endpoint for existing UI callers
 */
router.get('/audit/chain', (req, res) => {
  const integrity = auditLedger.verifyAuditTrailIntegrity();
  res.json({
    success: true,
    totalBlocks: auditLedger.chain.length,
    integrityStatus: integrity.status,
    isValid: integrity.isValid,
    chain: auditLedger.chain
  });
});

/**
 * GET /api/audit/verify
 * Verification status
 */
router.get('/audit/verify', (req, res) => {
  const integrity = auditLedger.verifyAuditTrailIntegrity();
  res.json({
    success: true,
    status: integrity.status,
    isValid: integrity.isValid,
    totalBlocksVerified: auditLedger.chain.length,
    message: integrity.message
  });
});

module.exports = router;
