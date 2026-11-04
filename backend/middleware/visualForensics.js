const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Visual Forensic Engine
 * Implements Error Level Analysis (ELA), bounding box anomaly detection,
 * mathematical inconsistency checking, and visual forgery localization.
 */

/**
 * Perform Error Level Analysis (ELA) on an image buffer or file.
 * Resaves the image at 90% JPEG quality, computes pixel-level difference against original,
 * and scales differences by 15x to expose compression anomalies and digital splices.
 */
async function performErrorLevelAnalysis(imageBuffer, options = {}) {
  const quality = options.quality || 90;
  const scale = options.scale || 15;

  try {
    const originalMetadata = await sharp(imageBuffer).metadata();
    const width = originalMetadata.width || 800;
    const height = originalMetadata.height || 1000;

    // Resave at specified JPEG quality
    const compressedJpegBuffer = await sharp(imageBuffer)
      .jpeg({ quality })
      .toBuffer();

    // Get raw pixel data of original and recompressed
    const [rawOriginal, rawCompressed] = await Promise.all([
      sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true }),
      sharp(compressedJpegBuffer).raw().toBuffer({ resolveWithObject: true })
    ]);

    const origData = rawOriginal.data;
    const compData = rawCompressed.data;
    const channels = rawOriginal.info.channels;
    const diffData = Buffer.alloc(rawOriginal.info.size);

    let maxDiff = 0;
    let totalDiff = 0;
    let suspiciousPixelCount = 0;

    // Hotspot bounding box tracking
    let minX = width, minY = height, maxX = 0, maxY = 0;

    for (let i = 0; i < origData.length; i += channels) {
      const pixelIdx = i / channels;
      const currentX = pixelIdx % width;
      const currentY = Math.floor(pixelIdx / width);

      let pixelDiffSum = 0;

      for (let c = 0; c < 3; c++) {
        const diff = Math.abs(origData[i + c] - (compData[i + c] || 0));
        const scaledDiff = Math.min(255, diff * scale);
        diffData[i + c] = scaledDiff;
        pixelDiffSum += diff;
      }

      if (channels === 4) {
        diffData[i + 3] = 255; // Alpha
      }

      totalDiff += pixelDiffSum;
      if (pixelDiffSum > maxDiff) maxDiff = pixelDiffSum;

      // Mark localized high-frequency compression variance (splice artifacts)
      if (pixelDiffSum > 28) {
        suspiciousPixelCount++;
        if (currentX < minX) minX = currentX;
        if (currentX > maxX) maxX = currentX;
        if (currentY < minY) minY = currentY;
        if (currentY > maxY) maxY = currentY;
      }
    }

    // Generate output ELA image as PNG buffer
    const elaImageBuffer = await sharp(diffData, {
      raw: {
        width: rawOriginal.info.width,
        height: rawOriginal.info.height,
        channels: rawOriginal.info.channels
      }
    })
      .png()
      .toBuffer();

    const avgDiff = totalDiff / (origData.length / channels);
    const tamperingScore = Math.min(100, Math.round((suspiciousPixelCount / (width * height)) * 1200));

    const hotspots = [];
    if (suspiciousPixelCount > 80 && minX < maxX && minY < maxY) {
      hotspots.push({
        id: `hotspot-${Date.now()}`,
        type: 'COMPRESSION_VARIANCE_SPLICE',
        label: 'Error Level Anomaly: Digital Copy-Paste / Retouching Hotspot',
        confidence: Math.min(0.96, 0.70 + (tamperingScore / 300)),
        box: {
          x: Math.round((minX / width) * 100),
          y: Math.round((minY / height) * 100),
          width: Math.round(((maxX - minX) / width) * 100),
          height: Math.round(((maxY - minY) / height) * 100)
        },
        pixelCoordinates: { minX, minY, maxX, maxY },
        explanation: `Significant JPEG quantization divergence detected (Scale: ${scale}x). Pixels in this region deviate from the baseline sensor noise pattern, indicative of text insertion or brush editing.`
      });
    }

    return {
      success: true,
      elaDataUrl: `data:image/png;base64,${elaImageBuffer.toString('base64')}`,
      metrics: {
        width,
        height,
        maxDiff,
        avgDiff: parseFloat(avgDiff.toFixed(2)),
        suspiciousPixelCount,
        tamperingScore
      },
      hotspots
    };
  } catch (err) {
    console.error('[VisualForensics] ELA processing error:', err);
    return {
      success: false,
      error: err.message,
      hotspots: []
    };
  }
}

/**
 * Analyze document layout, font metrics, and mathematical alignment
 */
function inspectVisualAndContextualAnomalies(docMetadata) {
  const anomalies = [];

  // 1. Math consistency verification for Financial / Salary documents
  if (docMetadata.docType === 'PAYSLIP_SALARY' && docMetadata.financials) {
    const { grossEarnings, totalDeductions, netPayable } = docMetadata.financials;
    if (grossEarnings !== undefined && totalDeductions !== undefined && netPayable !== undefined) {
      const calculatedNet = grossEarnings - totalDeductions;
      if (Math.abs(calculatedNet - netPayable) > 1.0) {
        anomalies.push({
          id: `anomaly-math-${Date.now()}`,
          category: 'MATHEMATICAL_INCONSISTENCY',
          severity: 'CRITICAL',
          label: 'Internal Arithmetic Contradiction',
          location: 'Net Payable Salary Field',
          expectedValue: `INR ${calculatedNet.toLocaleString('en-IN')}.00 (Gross ${grossEarnings} - Deductions ${totalDeductions})`,
          observedValue: `INR ${netPayable.toLocaleString('en-IN')}.00`,
          box: { x: 37, y: 72, width: 55, height: 8 },
          explanation: `Gross Earnings (₹${grossEarnings.toLocaleString('en-IN')}) minus Total Deductions (₹${totalDeductions.toLocaleString('en-IN')}) equals ₹${calculatedNet.toLocaleString('en-IN')}, but stated Net Salary is ₹${netPayable.toLocaleString('en-IN')}. Proof of manual figure alteration.`
        });
      }
    }
  }

  // 2. Invoice mathematical and line-item verification
  if (docMetadata.docType === 'VENDOR_INVOICE' && docMetadata.invoiceData) {
    const { subtotal, taxAmount, totalAmount } = docMetadata.invoiceData;
    if (subtotal !== undefined && taxAmount !== undefined && totalAmount !== undefined) {
      const computedTotal = subtotal + taxAmount;
      if (Math.abs(computedTotal - totalAmount) > 2.0) {
        anomalies.push({
          id: `anomaly-inv-math-${Date.now()}`,
          category: 'INVOICE_ARITHMETIC_MISMATCH',
          severity: 'HIGH',
          label: 'Line Item vs Total Mismatch',
          location: 'Total Payable Block',
          expectedValue: `INR ${computedTotal.toFixed(2)}`,
          observedValue: `INR ${totalAmount.toFixed(2)}`,
          box: { x: 60, y: 80, width: 35, height: 6 },
          explanation: `Subtotal + Applicable GST does not equal the final billed amount. Indicative of altered tax or inflated total.`
        });
      }
    }
  }

  // 3. Font / Baseline alignment irregularities
  if (docMetadata.fontAnomalies && docMetadata.fontAnomalies.length > 0) {
    docMetadata.fontAnomalies.forEach((fa, idx) => {
      anomalies.push({
        id: `anomaly-font-${idx}`,
        category: 'TYPOGRAPHIC_INCONSISTENCY',
        severity: 'MEDIUM',
        label: fa.label || 'Typography / Kerning Discrepancy',
        location: fa.location || 'Document Body Text',
        box: fa.box || { x: 35, y: 71, width: 45, height: 6 },
        explanation: fa.explanation || 'Font weight, baseline drift, and anti-aliasing sharpness deviate from surrounding typeface structure.'
      });
    });
  }

  return anomalies;
}

module.exports = {
  performErrorLevelAnalysis,
  inspectVisualAndContextualAnomalies
};
