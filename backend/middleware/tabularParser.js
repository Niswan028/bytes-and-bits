/**
 * CareSyncIQ - Dynamic Clinical Tabular Parser
 * Extracts structured laboratory investigation matrices, active prescription lists,
 * and physiological vital sign arrays dynamically from CSV, XLSX, and clinical text layers.
 */

/**
 * Parse laboratory biochemistry/hematology/endocrine assay tables.
 */
function parseClinicalLabTable(text) {
  if (!text) return null;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const rows = [];

  const commonTests = [
    { name: 'Fasting Blood Sugar', aliases: ['fasting blood sugar', 'glucose, fasting', 'fbs'] },
    { name: 'HbA1c', aliases: ['hba1c', 'glycated hemoglobin', 'glycosylated hemoglobin'] },
    { name: 'Total Cholesterol', aliases: ['total cholesterol', 'cholesterol total'] },
    { name: 'Triglycerides', aliases: ['triglycerides', 'serum triglycerides'] },
    { name: 'HDL Cholesterol', aliases: ['hdl cholesterol', 'hdl-c'] },
    { name: 'LDL Cholesterol', aliases: ['ldl cholesterol', 'ldl-c'] },
    { name: 'Serum Creatinine', aliases: ['serum creatinine', 'creatinine'] },
    { name: 'TSH', aliases: ['thyroid stimulating hormone', 'tsh'] },
    { name: 'Free T4', aliases: ['free t4', 'ft4', 'free thyroxine'] },
    { name: 'Absolute Eosinophil Count', aliases: ['absolute eosinophil count', 'aec'] },
    { name: 'INR', aliases: ['inr', 'international normalized ratio'] },
    { name: 'Prothrombin Time', aliases: ['prothrombin time', 'pt'] }
  ];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const testDef of commonTests) {
      if (testDef.aliases.some(alias => lowerLine.includes(alias))) {
        // Extract numeric value
        const cleanLine = line.replace(/,/g, ' ');
        const numMatches = cleanLine.match(/\b\d+(?:\.\d+)?\b/g);
        if (numMatches && numMatches.length >= 1) {
          const observedVal = parseFloat(numMatches[0]);

          // Extract unit
          let unit = '';
          if (lowerLine.includes('mg/dl')) unit = 'mg/dL';
          else if (lowerLine.includes('miu/l') || lowerLine.includes('uiu/ml')) unit = 'mIU/L';
          else if (lowerLine.includes('%')) unit = '%';
          else if (lowerLine.includes('cells/mcl')) unit = 'cells/mcL';
          else if (lowerLine.includes('seconds') || lowerLine.includes('sec')) unit = 'seconds';
          else if (lowerLine.includes('ratio')) unit = 'Ratio';

          // Interpretation flag
          let flag = 'NORMAL';
          if (lowerLine.includes('high') || lowerLine.includes('elevated') || lowerLine.includes('critical')) flag = 'HIGH';
          if (lowerLine.includes('low') || lowerLine.includes('sub-optimal')) flag = 'LOW';

          if (!rows.some(r => r.testName === testDef.name)) {
            rows.push({
              testName: testDef.name,
              observedValue: observedVal,
              unit: unit || 'Standard',
              flag,
              isAbnormal: flag !== 'NORMAL'
            });
          }
        }
      }
    }
  }

  return rows.length > 0 ? rows : null;
}

/**
 * Parse structured medication rows from outpatient prescriptions or discharge lists.
 */
function parsePrescriptionTable(text) {
  if (!text) return null;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const medications = [];

  const drugRegex = /(?:Tab\.|Cap\.|Syr\.|Inhaler|Turbuhaler)\s+([A-Za-z0-9\s\+\-\/\(\)]+?)(?:\s+(\d+(?:\.\d+)?\s*(?:mg|mcg|ml|IU)))?[:\s-]+([^\n\r]+)/gi;

  for (const line of lines) {
    let match;
    while ((match = drugRegex.exec(line)) !== null) {
      const name = match[1].trim();
      const dose = match[2] ? match[2].trim() : 'Standard dose';
      const instructions = match[3] ? match[3].trim() : 'As directed';

      medications.push({
        name,
        dose,
        instructions,
        status: 'Active'
      });
    }
  }

  return medications.length > 0 ? medications : null;
}

/**
 * Parse physiological vital signs (BP, Pulse, SpO2, BMI).
 */
function parseVitalSigns(text) {
  if (!text) return null;

  const vitals = {};
  const bpMatch = text.match(/\bBP[:\s]+(\d{2,3}\s*\/\s*\d{2,3})\s*mmHg/i) || text.match(/(\d{2,3}\s*\/\s*\d{2,3})\s*mmHg/i);
  if (bpMatch) vitals.bloodPressure = bpMatch[1].replace(/\s+/g, '');

  const pulseMatch = text.match(/\b(?:Pulse|HR|Heart\s+Rate)[:\s]+(\d{2,3})\s*(?:bpm)?/i);
  if (pulseMatch) vitals.heartRate = parseInt(pulseMatch[1], 10);

  const spo2Match = text.match(/\bSpO2[:\s]+(\d{2,3})\s*%/i);
  if (spo2Match) vitals.spO2 = parseInt(spo2Match[1], 10);

  const bmiMatch = text.match(/\bBMI[:\s]+(\d+(?:\.\d+)?)\s*(?:kg\/m²)?/i);
  if (bmiMatch) vitals.bmi = parseFloat(bmiMatch[1]);

  return Object.keys(vitals).length > 0 ? vitals : null;
}

module.exports = {
  parseClinicalLabTable,
  parsePrescriptionTable,
  parseVitalSigns
};
