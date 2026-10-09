/**
 * CareSyncIQ - SHA-256 Cryptographic Hash-Chained Audit Trail
 * 
 * Provides mathematical proof of record immutability and provenance.
 * Accurately described as a cryptographic hash-chained audit ledger (not a blockchain).
 * Every patient record ingestion, clinician sign-off, and consent action is chained
 * using SHA-256 digests. Any unauthorized alteration breaks the chain immediately.
 */

const crypto = require('crypto');

function sha256(data) {
  return crypto.createHash('sha256').update(typeof data === 'string' ? data : JSON.stringify(data)).digest('hex');
}

// In-memory persistent hash chain for demo
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

class AuditTrail {
  constructor() {
    this.chain = [];
    this.initializeLedger();
  }

  initializeLedger() {
    this.chain = [];
    this.appendEntry({
      eventType: 'GENESIS_INITIALIZATION',
      patientId: 'SYSTEM',
      recordId: 'INIT-000',
      description: 'CareSyncIQ Cryptographic Audit Ledger Initialized with SHA-256 Chaining',
      actor: 'System Integrity Engine',
      payload: { system: 'CareSyncIQ', version: '2.0.0', algorithm: 'SHA-256' }
    });

    // Seed realistic audit entries for the 3 synthetic patients
    this.appendEntry({
      eventType: 'RECORD_INGESTED',
      patientId: 'P1001',
      recordId: 'dr_lal_pathlabs_lipid_panel_p1001.pdf',
      description: 'Ingested certified biochemistry report from Dr. Lal PathLabs',
      actor: 'Patient / Lab Linkage',
      payload: { tests: ['HbA1c: 7.8%', 'Total Cholesterol: 228 mg/dL', 'Fasting Blood Sugar: 148 mg/dL'] }
    });

    this.appendEntry({
      eventType: 'FIELD_VERIFIED',
      patientId: 'P1001',
      recordId: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
      description: 'Doctor sign-off: Metformin 500mg BD & Penicillin Allergy verified',
      actor: 'Dr. Arvind Rao (KMC #38192)',
      payload: { verifiedBy: 'Dr. Arvind Rao', registrationNo: 'KMC-38192', fields: ['Metformin 500mg BD', 'Penicillin Allergy'] }
    });

    this.appendEntry({
      eventType: 'CONSENT_GRANTED',
      patientId: 'P1001',
      recordId: 'CONSENT-8942',
      description: 'Patient issued 1-hour time-limited access code for Fortis Care (Dr. Sneha Roy)',
      actor: 'Patient (Rajesh Sharma)',
      payload: { scope: 'DIABETES_AND_CARDIOLOGY_RECORDS', expiryMinutes: 60, accessCode: 'DOC-8942' }
    });

    this.appendEntry({
      eventType: 'SAFETY_ALERT_LOGGED',
      patientId: 'P1001',
      recordId: 'ALERT-DUP-001',
      description: 'System flagged duplicate lipid profile test within 16-day window',
      actor: 'CareSyncIQ Safety Engine',
      payload: { test: 'Lipid Profile', intervalDays: 16, estimatedWasteINR: 1200 }
    });
  }

  appendEntry({ eventType, patientId, recordId, description, actor, payload }) {
    const index = this.chain.length;
    const timestamp = new Date().toISOString();
    const previousHash = index === 0 ? GENESIS_HASH : this.chain[index - 1].blockHash;
    const payloadHash = sha256(payload);

    const blockHeader = `${index}|${timestamp}|${eventType}|${patientId}|${recordId}|${payloadHash}|${previousHash}`;
    const blockHash = sha256(blockHeader);

    const entry = {
      index,
      timestamp,
      eventType,
      patientId,
      recordId,
      description,
      actor,
      payload,
      payloadHash,
      previousHash,
      blockHash,
      isTampered: false
    };

    this.chain.push(entry);
    return entry;
  }

  verifyAuditTrailIntegrity() {
    for (let i = 0; i < this.chain.length; i++) {
      const current = this.chain[i];

      // 1. Check previous hash linkage
      if (i > 0) {
        const previous = this.chain[i - 1];
        if (current.previousHash !== previous.blockHash) {
          return {
            isValid: false,
            status: 'TAMPER_DETECTED',
            tamperedBlockIndex: i,
            failedCheck: 'PREVIOUS_HASH_MISMATCH',
            expectedPreviousHash: previous.blockHash,
            actualPreviousHash: current.previousHash,
            tamperedRecordId: current.recordId,
            message: `CRITICAL INTEGRITY FAILURE at block #${i}: Previous hash linkage is broken!`
          };
        }
      }

      // 2. Re-compute payload hash
      const calculatedPayloadHash = sha256(current.payload);
      if (calculatedPayloadHash !== current.payloadHash) {
        return {
          isValid: false,
          status: 'TAMPER_DETECTED',
          tamperedBlockIndex: i,
          failedCheck: 'PAYLOAD_DIGEST_CORRUPTED',
          expectedPayloadHash: current.payloadHash,
          recalculatedPayloadHash: calculatedPayloadHash,
          tamperedRecordId: current.recordId,
          message: `CRITICAL TAMPER WARNING at block #${i} (${current.recordId}): Payload content was modified without authorization!`
        };
      }

      // 3. Re-compute block header hash
      const blockHeader = `${current.index}|${current.timestamp}|${current.eventType}|${current.patientId}|${current.recordId}|${current.payloadHash}|${current.previousHash}`;
      const calculatedBlockHash = sha256(blockHeader);
      if (calculatedBlockHash !== current.blockHash) {
        return {
          isValid: false,
          status: 'TAMPER_DETECTED',
          tamperedBlockIndex: i,
          failedCheck: 'BLOCK_HEADER_HASH_INVALID',
          expectedBlockHash: current.blockHash,
          recalculatedBlockHash: calculatedBlockHash,
          tamperedRecordId: current.recordId,
          message: `CRITICAL TAMPER WARNING at block #${i}: Cryptographic seal signature does not match block contents!`
        };
      }
    }

    return {
      isValid: true,
      status: 'VERIFIED_INTACT',
      totalBlocksAudited: this.chain.length,
      latestBlockHash: this.chain[this.chain.length - 1].blockHash,
      message: 'All cryptographic hash-chain signatures verified intact. Zero unauthorized tampering detected.'
    };
  }

  simulateTamper(blockIndex = 1, maliciousField = 'HbA1c: 5.2% (Fabricated Normal)') {
    if (blockIndex < 0 || blockIndex >= this.chain.length) {
      throw new Error('Invalid block index for tamper simulation');
    }

    // Save backup if not already saved
    if (!this._backupPayload) {
      this._backupPayload = JSON.parse(JSON.stringify(this.chain[blockIndex].payload));
      this._tamperedIndex = blockIndex;
    }

    // Modify payload without updating cryptographic hashes
    this.chain[blockIndex].payload.tests[0] = maliciousField;
    this.chain[blockIndex].isTampered = true;
    return {
      tamperedBlockIndex: blockIndex,
      injectedPayload: this.chain[blockIndex].payload,
      integrityAudit: this.verifyAuditTrailIntegrity()
    };
  }

  restoreIntegrity() {
    if (this._backupPayload && this._tamperedIndex !== undefined) {
      this.chain[this._tamperedIndex].payload = this._backupPayload;
      this.chain[this._tamperedIndex].isTampered = false;
      this._backupPayload = null;
      this._tamperedIndex = null;
    }
    return this.verifyAuditTrailIntegrity();
  }
}

const auditLedger = new AuditTrail();

module.exports = {
  auditLedger,
  sha256
};
