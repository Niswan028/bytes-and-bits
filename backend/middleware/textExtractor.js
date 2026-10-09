const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const mammoth = require('mammoth');
const xlsx = require('xlsx');

const PDFParse = pdfParse.PDFParse || pdfParse;
const RASTERIZER_SCRIPT = path.join(__dirname, 'pdfRasterizer.py');

/**
 * Domain-specific OCR post-corrector for clinical health records, pharmaceuticals,
 * laboratory assay abbreviations, and standard medical measurement units.
 */
function correctMedicalDomainOCR(text) {
  if (!text) return '';
  return text
    // --- Common Drug Names & Active Formulations ---
    .replace(/\b[mM]eformin\b/g, 'Metformin')
    .replace(/\b[mM]etfomin\b/g, 'Metformin')
    .replace(/\b[mM]etformn\b/g, 'Metformin')
    .replace(/\bMetformin\s+HCL\b/gi, 'Metformin HCl')
    .replace(/\b[gG]limepride\b/g, 'Glimepiride')
    .replace(/\b[gG]limepirid\b/g, 'Glimepiride')
    .replace(/\b[gG]lipzide\b/g, 'Glipizide')
    .replace(/\b[gG]lipiside\b/g, 'Glipizide')
    .replace(/\b[sS]itaglipin\b/g, 'Sitagliptin')
    .replace(/\b[sS]itagliptn\b/g, 'Sitagliptin')
    .replace(/\b[tT]elmisrtan\b/g, 'Telmisartan')
    .replace(/\b[tT]elmisarten\b/g, 'Telmisartan')
    .replace(/\b[aA]torvastin\b/g, 'Atorvastatin')
    .replace(/\b[aA]torvastatn\b/g, 'Atorvastatin')
    .replace(/\b[lL]evothyroxin\b/g, 'Levothyroxine')
    .replace(/\b[lL]evothyroxne\b/g, 'Levothyroxine')
    .replace(/\b[bB]udesonid\b/g, 'Budesonide')
    .replace(/\b[bB]udosenide\b/g, 'Budesonide')
    .replace(/\b[fF]ormotrol\b/g, 'Formoterol')
    .replace(/\b[fF]ormaterol\b/g, 'Formoterol')
    .replace(/\b[mM]ontelukst\b/g, 'Montelukast')
    .replace(/\b[mM]ontelucast\b/g, 'Montelukast')
    .replace(/\b[aA]moxicilin\b/g, 'Amoxicillin')
    .replace(/\b[aA]moxycillin\b/g, 'Amoxicillin')
    .replace(/\b[aA]ugmentn\b/g, 'Augmentin')
    .replace(/\b[wW]arfrin\b/g, 'Warfarin')
    .replace(/\b[cC]larithromycn\b/g, 'Clarithromycin')
    .replace(/\b[cC]larothromycin\b/g, 'Clarithromycin')
    .replace(/\b[pP]antaprazole\b/g, 'Pantoprazole')
    .replace(/\b[pP]aracetmol\b/g, 'Paracetamol')
    .replace(/\b[iI]buprofin\b/g, 'Ibuprofen')
    .replace(/\b[iI]buprophen\b/g, 'Ibuprofen')

    // --- Laboratory Test Abbreviations & Biomarkers ---
    .replace(/\bHb[Aa]lc\b/g, 'HbA1c')
    .replace(/\bHb[Aa]1c\b/g, 'HbA1c')
    .replace(/\bHb\s+A1c\b/g, 'HbA1c')
    .replace(/\bHb-A1c\b/g, 'HbA1c')
    .replace(/\bF\.?B\.?S\.?\b/g, 'FBS')
    .replace(/\bP\.?P\.?B\.?S\.?\b/g, 'PPBS')
    .replace(/\bT\.?S\.?H\.?\b/g, 'TSH')
    .replace(/\bF\.?T\.?4\b/g, 'FT4')
    .replace(/\bF\.?T\.?3\b/g, 'FT3')
    .replace(/\be-?GFR\b/gi, 'eGFR')
    .replace(/\bS\.\s*Creatinine\b/gi, 'Serum Creatinine')
    .replace(/\bP\.?T\.?\s*\/\s*INR\b/gi, 'PT / INR')

    // --- Units of Measure Normalization ---
    .replace(/\bmg\s*\/\s*d[lL]\b/gi, 'mg/dL')
    .replace(/\bmmol\s*\/\s*[lL]\b/gi, 'mmol/L')
    .replace(/\bm[iI][uU]\s*\/\s*[lL]\b/gi, 'mIU/L')
    .replace(/\bcells\s*\/\s*mc[lL]\b/gi, 'cells/mcL')
    .replace(/\b[uU][gG]\b(?=\s*\/\s*[mdl])/g, 'mcg')
    .replace(/\b[uU][gG]\b(?=\s*(?:morning|OD|BD|daily))/gi, 'mcg')
    .replace(/\b[uU][gG]\b(?=\s*\d)/g, 'mcg')

    // --- Clinical Direction & Dosing Frequency ---
    .replace(/\bB\.?D\.?\b/g, 'BD')
    .replace(/\bO\.?D\.?\b/g, 'OD')
    .replace(/\bT\.?D\.?S\.?\b/g, 'TDS')
    .replace(/\bQ\.?I\.?D\.?\b/g, 'QID')
    .replace(/\bH\.?S\.?\b/g, 'HS')
    .replace(/\bS\.?O\.?S\.?\b/g, 'SOS')

    // --- Comma-as-decimal OCR repair on lab results (e.g. 7,8% -> 7.8%) ---
    .replace(/(?<=\b\d{1,3}),(?=\d{1,2}\b)/g, '.');
}

/**
 * Text cleaner that preserves tabular newlines, clinical dosage syntax, and multilingual text.
 */
function cleanExtractedText(text) {
  if (!text) return '';
  const postCorrected = correctMedicalDomainOCR(text);
  return postCorrected
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Extract digital text and page structure from PDF using pdf-parse.
 */
async function parsePdfBuffer(fileBuffer) {
  if (typeof PDFParse === 'function' && PDFParse.prototype && typeof PDFParse.prototype.getText === 'function') {
    const parser = new PDFParse({ data: fileBuffer });
    try {
      const result = await parser.getText();
      const pages = (result?.pages || []).map((p, idx) => ({
        pageNumber: p.num || idx + 1,
        text: cleanExtractedText(p.text || ''),
        method: 'digital',
        confidence: 0.99
      }));
      return {
        fullText: cleanExtractedText(result?.text || ''),
        pages,
        total: result?.total || pages.length,
        confidence: 0.99
      };
    } finally {
      await parser.destroy().catch(() => {});
    }
  }

  const data = await PDFParse(fileBuffer);
  const text = cleanExtractedText(data?.text || '');
  return {
    fullText: text,
    pages: [{ pageNumber: 1, text, method: 'digital', confidence: 0.99 }],
    total: data?.numpages || 1,
    confidence: 0.99
  };
}

/**
 * Fallback rasterizer for scanned PDF pages using PyMuPDF and Tesseract.js.
 */
async function ocrPdfPages(filePath, originalFilename = 'document.pdf') {
  const tempDir = path.join(__dirname, '..', 'uploads', 'temp_ocr_' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    console.log(`[OCR Pipeline] Rasterizing scanned PDF with deskew & CLAHE: ${originalFilename}`);
    const pyOutput = execFileSync('python', [RASTERIZER_SCRIPT, filePath, tempDir, '250'], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });

    const parsed = JSON.parse(pyOutput);
    if (!parsed.success || !parsed.pages || parsed.pages.length === 0) {
      throw new Error(parsed.error || 'Failed to rasterize PDF pages');
    }

    const pages = [];
    let cumulativeConfidence = 0;

    for (const pageInfo of parsed.pages) {
      console.log(`[OCR Pipeline] Running Tesseract OCR on page ${pageInfo.page}...`);
      const ocrResult = await Tesseract.recognize(pageInfo.imagePath, 'eng');
      const pageText = cleanExtractedText(ocrResult?.data?.text || '');
      const confidence = (ocrResult?.data?.confidence || 0) / 100.0;
      cumulativeConfidence += confidence;

      pages.push({
        pageNumber: pageInfo.page,
        text: pageText,
        confidence,
        method: 'ocr'
      });
    }

    const avgConfidence = pages.length > 0 ? cumulativeConfidence / pages.length : 0.80;
    const fullText = pages.map(p => `--- [Page ${p.pageNumber}] ---\n${p.text}`).join('\n\n');
    return {
      fullText,
      pages,
      total: pages.length,
      isScanned: true,
      confidence: avgConfidence
    };
  } finally {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (e) {
      console.warn('[OCR Pipeline] Temp cleanup notice:', e.message);
    }
  }
}

/**
 * Preprocess standalone image file (deskew, CLAHE contrast, denoise) before OCR.
 */
function preprocessImage(imagePath) {
  const outPath = path.join(
    path.dirname(imagePath),
    'prep_' + Date.now() + '_' + path.basename(imagePath, path.extname(imagePath)) + '.png'
  );

  try {
    execFileSync('python', [RASTERIZER_SCRIPT, '--preprocess-single', imagePath, outPath], {
      encoding: 'utf8',
      maxBuffer: 5 * 1024 * 1024
    });
    return outPath;
  } catch (e) {
    console.warn('[OCR Pipeline] Image preprocessing fallback notice:', e.message);
    return imagePath;
  }
}

/**
 * Structured Clinical Entity Extractor
 * Extracts patient demographics, provider, date, diagnoses, allergies,
 * medications, and laboratory observations with per-field confidence scoring.
 */
function extractStructuredMedicalEntities(text, ocrConfidence = 0.95, isScanned = false) {
  if (!text) return null;

  const needsReview = ocrConfidence < 0.90 || isScanned;
  const entities = {
    patient: { name: null, uhid: null, age: null, gender: null, confidence: ocrConfidence },
    provider: { doctor: null, facility: null, confidence: ocrConfidence },
    date: null,
    diagnoses: [],
    allergies: [],
    medications: [],
    labTests: [],
    needsClinicianReview: needsReview
  };

  // 1. Patient Demographics Extraction
  const nameMatch = text.match(/Patient(?:\s+Name)?[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
  if (nameMatch) entities.patient.name = nameMatch[1].trim();

  const uhidMatch = text.match(/(?:UHID|MRN|Patient\s+ID|Hospital\s+#)[:\s]+([A-Z0-9_-]+)/i);
  if (uhidMatch) entities.patient.uhid = uhidMatch[1].trim();

  const ageGenderMatch = text.match(/Age\s*[/:\s]*Gender[:\s]+(\d+)\s*(?:Yrs|Y|Years)?\s*[/,\s]+\s*([MF]|Male|Female)/i) ||
                         text.match(/(\d+)\s*(?:Yrs|Y|Years)\s*[/,\s]+\s*([MF]|Male|Female)/i);
  if (ageGenderMatch) {
    entities.patient.age = parseInt(ageGenderMatch[1], 10);
    entities.patient.gender = ageGenderMatch[2].toUpperCase().startsWith('M') ? 'Male' : 'Female';
  }

  // 2. Doctor / Facility Extraction
  const doctorMatch = text.match(/(?:Dr\.|Doctor)[:\s]+([A-Z][a-zA-Z\s\.,]+?(?:MD|MBBS|MS|DM|DNB|Ortho|Endo|Pulm|Cardio)?)(?=\n|\||\s{3,}|$)/i);
  if (doctorMatch) entities.provider.doctor = doctorMatch[0].trim();

  const clinicMatch = text.match(/(?:APOLLO|METROPOLIS|DR\.?\s*LAL|ASTER|ST\.?\s*JOHN|CITY\s+FAMILY|QUICKCARE|BONE\s*&\s*JOINT)[A-Za-z0-9\s,\.]+/i);
  if (clinicMatch) entities.provider.facility = clinicMatch[0].trim();

  // 3. Date Extraction
  const dateMatch = text.match(/\b(\d{1,2}[-/][A-Za-z]{3}[-/]\d{2,4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b/);
  if (dateMatch) entities.date = dateMatch[1];

  // 4. Allergy Extraction
  const allergyMatches = text.match(/(?:ALLERG(?:Y|IES)|CONTRAINDICATION)[:\s]+([^\n\r.]+)/gi);
  if (allergyMatches) {
    allergyMatches.forEach(am => {
      const cleanAllergy = am.replace(/ALLERG(?:Y|IES)[:\s]+/i, '').trim();
      if (cleanAllergy && !entities.allergies.includes(cleanAllergy)) {
        entities.allergies.push({
          substance: cleanAllergy,
          severity: cleanAllergy.toLowerCase().includes('anaphylaxis') || cleanAllergy.toLowerCase().includes('bronchospasm') ? 'Life-Threatening' : 'Moderate',
          confidence: ocrConfidence
        });
      }
    });
  }

  // 5. Medication Extraction
  const medRegex = /(?:Tab\.|Cap\.|Syr\.|Inhaler|Turbuhaler)\s+([A-Za-z0-9\s\+\-\/\(\)]+?)(?:\s+(\d+(?:\.\d+)?\s*(?:mg|mcg|ml|IU)))?[:\s-]+([^\n\r]+)/gi;
  let mMatch;
  while ((mMatch = medRegex.exec(text)) !== null) {
    const medName = mMatch[1].trim();
    const dose = mMatch[2] ? mMatch[2].trim() : 'Standard dose';
    const instructions = mMatch[3] ? mMatch[3].trim() : 'As directed';
    
    // Tesseract handwriting check: if confidence < 75% mark needs review
    const needsReview = ocrConfidence < 0.75 || medName.length < 3;
    entities.medications.push({
      drugName: medName,
      dose,
      instructions,
      needsReview,
      confidence: ocrConfidence
    });
    if (needsReview) entities.needsClinicianReview = true;
  }

  // 6. Lab Tests Extraction
  const labPatterns = [
    { name: 'HbA1c', regex: /HbA1c[^\d]+(\d+(?:\.\d+)?)\s*%/i, unit: '%', ref: '< 5.7%' },
    { name: 'Fasting Blood Sugar', regex: /Fasting Blood Sugar[^\d]+(\d+(?:\.\d+)?)\s*mg\/dL/i, unit: 'mg/dL', ref: '70 - 99 mg/dL' },
    { name: 'Total Cholesterol', regex: /Total Cholesterol[^\d]+(\d+(?:\.\d+)?)\s*mg\/dL/i, unit: 'mg/dL', ref: '< 200 mg/dL' },
    { name: 'Triglycerides', regex: /Triglycerides[^\d]+(\d+(?:\.\d+)?)\s*mg\/dL/i, unit: 'mg/dL', ref: '< 150 mg/dL' },
    { name: 'HDL Cholesterol', regex: /HDL Cholesterol[^\d]+(\d+(?:\.\d+)?)\s*mg\/dL/i, unit: 'mg/dL', ref: '> 40 mg/dL' },
    { name: 'LDL Cholesterol', regex: /LDL Cholesterol[^\d]+(\d+(?:\.\d+)?)\s*mg\/dL/i, unit: 'mg/dL', ref: '< 100 mg/dL' },
    { name: 'Serum Creatinine', regex: /Serum Creatinine[^\d]+(\d+(?:\.\d+)?)\s*mg\/dL/i, unit: 'mg/dL', ref: '0.70 - 1.20 mg/dL' },
    { name: 'TSH', regex: /Thyroid Stimulating Hormone[^\d]+(\d+(?:\.\d+)?)\s*mIU\/L|TSH[^\d]+(\d+(?:\.\d+)?)\s*mIU\/L/i, unit: 'mIU/L', ref: '0.40 - 4.20 mIU/L' },
    { name: 'INR', regex: /International Normalized Ratio[^\d]+(\d+(?:\.\d+)?)|INR[^\d]+(\d+(?:\.\d+)?)/i, unit: 'Ratio', ref: '2.00 - 3.00' }
  ];

  for (const lp of labPatterns) {
    const lMatch = text.match(lp.regex);
    if (lMatch) {
      const val = parseFloat(lMatch[1] || lMatch[2]);
      if (!isNaN(val)) {
        entities.labTests.push({
          test: lp.name,
          value: val,
          unit: lp.unit,
          referenceRange: lp.ref,
          confidence: ocrConfidence,
          needsReview: ocrConfidence < 0.75
        });
      }
    }
  }

  return entities;
}

/**
 * Universal multimodal document text extraction pipeline for HealthTech records.
 * Supports: PDFs (digital + OCR), Scanned photos/PNG/JPG (preprocessed), DOCX, CSV/XLSX.
 */
async function extractDocument(filePath, originalFilename, mimeType) {
  const ext = path.extname(originalFilename || filePath).toLowerCase();
  console.log(`[extractDocument] Processing medical record: ${originalFilename} (ext: ${ext})`);

  let text = '';
  let pages = [];
  let isScanned = false;
  let ocrConfidence = 0.99;

  try {
    if (ext === '.pdf') {
      const buffer = fs.readFileSync(filePath);
      const pdfResult = await parsePdfBuffer(buffer);

      if (pdfResult.fullText && pdfResult.fullText.length > 50) {
        text = pdfResult.fullText;
        pages = pdfResult.pages;
        ocrConfidence = 0.99;
      } else {
        // Scanned PDF fallback
        console.log(`[extractDocument] PDF has minimal digital text (${pdfResult.fullText.length} chars). Invoking OCR pipeline...`);
        const ocrResult = await ocrPdfPages(filePath, originalFilename);
        text = ocrResult.fullText;
        pages = ocrResult.pages;
        isScanned = true;
        ocrConfidence = ocrResult.confidence;
      }
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.tiff', '.bmp'].includes(ext)) {
      // Image file: Apply multistage preprocessing (deskew, illumination normalize, CLAHE)
      console.log(`[extractDocument] Preprocessing and running Tesseract OCR on clinical image: ${originalFilename}...`);
      const preprocessedPath = preprocessImage(filePath);

      try {
        const ocrResult = await Tesseract.recognize(preprocessedPath, 'eng');
        text = cleanExtractedText(ocrResult?.data?.text || '');
        ocrConfidence = (ocrResult?.data?.confidence || 0) / 100.0;
        isScanned = true;
        pages = [{ pageNumber: 1, text, method: 'ocr', confidence: ocrConfidence }];
      } finally {
        if (preprocessedPath !== filePath && fs.existsSync(preprocessedPath)) {
          try { fs.unlinkSync(preprocessedPath); } catch (e) {}
        }
      }
    } else if (['.csv', '.tsv'].includes(ext)) {
      const content = fs.readFileSync(filePath, 'utf8');
      text = cleanExtractedText(content);
      pages = [{ pageNumber: 1, text, method: 'tabular', confidence: 1.0 }];
      ocrConfidence = 1.0;
    } else if (['.xlsx', '.xls'].includes(ext)) {
      const workbook = xlsx.readFile(filePath);
      let sheetTexts = [];
      workbook.SheetNames.forEach((sheetName, idx) => {
        const sheet = workbook.Sheets[sheetName];
        const csvContent = xlsx.utils.sheet_to_csv(sheet);
        sheetTexts.push(`--- [Sheet ${idx + 1}: ${sheetName}] ---\n${csvContent}`);
      });
      text = cleanExtractedText(sheetTexts.join('\n\n'));
      pages = [{ pageNumber: 1, text, method: 'tabular', confidence: 1.0 }];
      ocrConfidence = 1.0;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = cleanExtractedText(result.value || '');
      pages = [{ pageNumber: 1, text, method: 'digital', confidence: 0.98 }];
      ocrConfidence = 0.98;
    } else {
      text = cleanExtractedText(fs.readFileSync(filePath, 'utf8'));
      pages = [{ pageNumber: 1, text, method: 'plain_text', confidence: 0.95 }];
      ocrConfidence = 0.95;
    }

    if (!text || text.trim().length === 0) {
      throw new Error('UNREADABLE_FILE: Document contains zero extractable text or unreadable pixel density.');
    }

    // Extract structured entities
    const structuredEntities = extractStructuredMedicalEntities(text, ocrConfidence, isScanned);

    return {
      text,
      pages,
      isScanned,
      ocrConfidence,
      structuredEntities,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      pageCount: pages.length || 1,
      failureState: false
    };
  } catch (err) {
    console.error(`[extractDocument] Ingestion error on ${originalFilename}:`, err.message);
    return {
      text: '',
      pages: [],
      isScanned,
      ocrConfidence: 0.0,
      structuredEntities: null,
      wordCount: 0,
      pageCount: 0,
      failureState: true,
      errorMessage: err.message || 'File processing failed or unreadable file format.'
    };
  }
}

module.exports = {
  extractDocument,
  cleanExtractedText,
  correctMedicalDomainOCR,
  extractStructuredMedicalEntities
};
