const express = require('express');
const { calculateClinicalMetrics } = require('../middleware/metricsInstrumentation');

const router = express.Router();

/**
 * GET /api/metrics/health
 * Returns measured, defensible HealthTech KPIs:
 * 1. Field extraction precision & recall on labeled 32-sample synthetic test set
 * 2. Time to retrieve a fact vs documented manual baseline
 * 3. Duplicate tests caught & cost savings calculation
 * 4. OCR confidence distribution across digital vs scanned phone photos
 */
router.get('/metrics/health', async (req, res) => {
  try {
    const metrics = await calculateClinicalMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('[metrics.js] Error calculating clinical metrics:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Alias for backwards compatibility with existing UI callers
router.get('/metrics/sih', async (req, res) => {
  try {
    const metrics = await calculateClinicalMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
