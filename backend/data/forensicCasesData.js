/**
 * ForensIQ - Forensic Cases Corpus
 * Grounded enterprise scenarios adhering to DataOps (SOC | NOC | VAPT) Problem Statement
 */

const FORENSIC_CASES = [
  {
    id: 'CASE-2026-081',
    caseNumber: 'DFIR-2026-081-FIN',
    title: 'High-Value Lending: Salary Inflation & Multi-Doc Income Fabrication',
    targetEntity: 'Vikram Aditya Sharma (Loan App #LN-992014)',
    sector: 'Banking & Financial SOC / Fraud Risk Management',
    status: 'ACTIVE_INVESTIGATION',
    riskScore: 92,
    severity: 'CRITICAL',
    verdict: 'FRAUDULENT_ALTERATION_DETECTED',
    verdictSummary: 'Definite document tampering confirmed via Error Level Analysis (ELA) and mathematical contradiction on Nov 2026 Salary Slip. Cross-document triangulation against HDFC Bank Statement and ITR-V reveals 222% artificial income inflation.',
    createdDate: '2026-11-03T09:30:00Z',
    assignedInvestigator: 'Inspector K. Ramanathan (SOC Senior Analyst)',
    documents: [
      {
        id: 'DOC-081-1',
        filename: 'salary_slip_nov2026_tampered.png',
        displayName: 'Salary Slip - November 2026 (Apex Technologies Ltd)',
        docType: 'PAYSLIP_SALARY',
        fileType: 'image/png',
        tamperingDetected: true,
        riskScore: 96,
        sha256: 'a7b8893d7c5847fa2490df1892837bc230182749502938172983749021873918',
        extractedData: {
          employeeName: 'Vikram Aditya Sharma',
          employeeId: 'EMP-4482',
          designation: 'Senior Infrastructure Specialist',
          department: 'Core Operations',
          period: 'November 2026',
          bankAccountNumber: '50100492817291',
          bankName: 'HDFC Bank Ltd',
          basicPay: 85000,
          hra: 42500,
          specialAllowance: 32500,
          grossEarnings: 160000,
          providentFund: 8000,
          professionalTax: 2500,
          incomeTaxTDS: 4500,
          totalDeductions: 15000,
          claimedNetSalary: 145000
        },
        visualFindings: [
          {
            id: 'vf-081-ela-1',
            type: 'ERROR_LEVEL_ANALYSIS',
            tool: 'Compression Quantization Matrix (Scale 15x)',
            severity: 'CRITICAL',
            title: 'Localized JPEG Compression Artifacts (Splice Forgery)',
            description: 'Significant quantization anomaly detected around the Net Payable figure (₹1,45,000). Error level noise in this bounding box is 184 luminance units versus 14 across the unaltered table. Confirms digit "1" and comma were spliced from an external font source.',
            box: { x: 37, y: 72, width: 55, height: 8 },
            pixelMetrics: { avgNoiseDiff: 184, baselineNoise: 14, spliceRatio: '13.1x' },
            confidence: 0.96
          },
          {
            id: 'vf-081-math-1',
            type: 'MATHEMATICAL_CONTRADICTION',
            tool: 'Deterministic Ledger Arithmetic Engine',
            severity: 'CRITICAL',
            title: 'Internal Arithmetic Breakdown',
            description: 'Calculated Net = Stated Gross (₹1,60,000) minus Stated Deductions (₹15,000) = ₹1,45,000. However, the original unmanipulated Gross was ₹50,000 with Deductions of ₹5,000 = ₹45,000. Tampering failed to balance EPF statutory rate (EPF ₹8,000 on Basic ₹85,000 is 9.4%, violating statutory 12%).',
            box: { x: 10, y: 48, width: 80, height: 32 },
            confidence: 0.99
          },
          {
            id: 'vf-081-font-1',
            type: 'TYPOGRAPHIC_ANOMALY',
            tool: 'Sub-Pixel Font & Baseline Profiler',
            severity: 'HIGH',
            title: 'Font Weight & Baseline Drift Irregularity',
            description: 'The prefix "1" in "1,45,000" exhibits a -2.4px vertical baseline depression and 1.8x edge feathering variance compared to Helvetica-Regular glyphs in adjacent fields.',
            box: { x: 37, y: 72, width: 25, height: 8 },
            confidence: 0.91
          }
        ]
      },
      {
        id: 'DOC-081-2',
        filename: 'hdfc_bank_statement_q3.pdf',
        displayName: 'HDFC Bank Account Statement (Q3 FY26)',
        docType: 'BANK_STATEMENT',
        fileType: 'application/pdf',
        tamperingDetected: false,
        riskScore: 12,
        sha256: '92837bc230182749502938172983749021873918a7b8893d7c5847fa2490df18',
        extractedData: {
          accountHolder: 'Vikram Aditya Sharma',
          accountNumber: '50100492817291',
          branch: 'Koramangala 4th Block, Bengaluru',
          statementPeriod: '01-Sep-2026 to 30-Nov-2026',
          monthlySalaryCredits: [
            { date: '30-Sep-2026', description: 'ACH CR-APEX TECH-SAL-SEP26', amount: 45000 },
            { date: '31-Oct-2026', description: 'ACH CR-APEX TECH-SAL-OCT26', amount: 45000 },
            { date: '30-Nov-2026', description: 'ACH CR-APEX TECH-SAL-NOV26', amount: 45000 }
          ],
          closingBalance: 68420.50
        },
        visualFindings: []
      },
      {
        id: 'DOC-081-3',
        filename: 'itr_v_acknowledgement_ay2026.pdf',
        displayName: 'Income Tax Return ITR-V Ack (AY 2026-27)',
        docType: 'TAX_RETURN_ITRV',
        fileType: 'application/pdf',
        tamperingDetected: false,
        riskScore: 8,
        sha256: 'f502938172983749021873918a7b8893d7c5847fa2490df1892837bc23018274',
        extractedData: {
          taxpayerName: 'Vikram Aditya Sharma',
          pan: 'ABCPS8812K',
          assessmentYear: '2026-27',
          filingDate: '28-Jul-2026',
          grossTotalIncome: 540000,
          taxableIncome: 490000,
          employerReported: 'Apex Technologies Ltd',
          monthlyAverageGross: 45000
        },
        visualFindings: []
      }
    ],
    crossDocCorrelations: [
      {
        id: 'cdc-081-1',
        title: 'Salary Slip Net Income vs Bank Account Actual Credit Conflict',
        severity: 'CRITICAL',
        riskImpact: 95,
        type: 'INCOME_DISCREPANCY',
        sourceDocId: 'DOC-081-1',
        sourceDocName: 'Salary Slip Nov 2026',
        sourceField: 'Claimed Net Salary: INR 1,45,000 / month',
        targetDocId: 'DOC-081-2',
        targetDocName: 'HDFC Bank Statement Q3',
        targetField: 'Verified Inward ACH Credit: INR 45,000 / month',
        discrepancyDelta: 'INR +1,00,000 / month (+222.2% Inflation)',
        analysisGrounded: 'Salary Slip states applicant took home INR 1,45,000 in Nov 2026. However, official HDFC bank statement transaction logs show recurring employer inward ACH transfers of exactly INR 45,000 on Sep 30, Oct 31, and Nov 30. Zero deposits matching INR 1,45,000 exist in the banking record.',
        recommendation: 'Decline loan immediately under Fraud Rule SEC-FIN-08. Transmit tamper ledger to Credit Risk Governance.'
      },
      {
        id: 'cdc-081-2',
        title: 'Annualized Salary Claim vs Tax Department (ITR-V) Certified Total',
        severity: 'CRITICAL',
        riskImpact: 90,
        type: 'TAX_FILING_CONTRADICTION',
        sourceDocId: 'DOC-081-1',
        sourceDocName: 'Salary Slip Nov 2026',
        sourceField: 'Annualized Salary: INR 19,20,000 (INR 1.60L x 12)',
        targetDocId: 'DOC-081-3',
        targetDocName: 'ITR-V Acknowledgement AY26',
        targetField: 'CBDT Gross Total Income: INR 5,40,000',
        discrepancyDelta: 'INR +13,80,000 (+255.5% Gap)',
        analysisGrounded: 'Applicant submitted an Income Tax Return certified by the Central Board of Direct Taxes with Gross Total Income of INR 5,40,000 (INR 45,000/mo). The claimed salary slip annualizes to INR 19,20,000 gross. An unexplained difference of INR 13.8 Lakhs exists.',
        recommendation: 'Mark applicant profile with National Credit Fraud Flag CIBIL-FF-91.'
      }
    ],
    chainOfCustody: [
      {
        timestamp: '2026-11-03T09:30:12Z',
        actor: 'Loan Ingestion Gateway v4.2',
        action: 'DOCUMENT_INGESTED',
        details: 'Received 3 multi-page files from applicant web upload portal.',
        sha256Seal: 'b4a8e6e586027a0528e19c36203cf799321ef9a44a6fbb3365fa50017a421b9b'
      },
      {
        timestamp: '2026-11-03T09:30:15Z',
        actor: 'ForensIQ OCR & Structure Engine',
        action: 'KEY_VALUE_EXTRACTION',
        details: 'Extracted tabular financial components, employer PAN, and account credits with 99.4% confidence.',
        sha256Seal: '9f268f7d98be4910283e351892837bc230182749502938172983749021873918'
      },
      {
        timestamp: '2026-11-03T09:30:18Z',
        actor: 'ForensIQ Visual Forensic Engine',
        action: 'ELA_ANALYSIS_EXECUTED',
        details: 'Discovered high-frequency JPEG quantization variance (184 units) at Net Salary coordinates [37, 72, 55, 8].',
        sha256Seal: '71a4f08912d7b8893d7c5847fa2490df1892837bc230182749502938172983749'
      },
      {
        timestamp: '2026-11-03T09:30:22Z',
        actor: 'ForensIQ Cross-Doc Correlator',
        action: 'CORRELATION_MATRIX_BUILT',
        details: 'Triangulated 3 documents. Flagged 2 Critical cross-document discrepancies totaling INR 1.00L/month.',
        sha256Seal: '4892c5789120938172983749021873918a7b8893d7c5847fa2490df1892837bc'
      },
      {
        timestamp: '2026-11-03T09:31:00Z',
        actor: 'Inspector K. Ramanathan',
        action: 'INVESTIGATOR_TRIAGE_CONFIRMED',
        details: 'Affirmed automated findings. Dossier compiled with ISO/IEC 27037 digital evidence preservation stamp.',
        sha256Seal: 'c198230918237491823749817239487192837498172938749182739182739182'
      }
    ]
  },
  {
    id: 'CASE-2026-094',
    caseNumber: 'DFIR-2026-094-PROC',
    title: 'Supply Chain Risk: Duplicate Invoice & Purchase Order Cap Breach',
    targetEntity: 'Apex Cloud & Network Solutions LLP (GSTIN: 27AABCA1234F1Z5)',
    sector: 'Enterprise NOC / VAPT / Corporate Audit',
    status: 'ACTIVE_INVESTIGATION',
    riskScore: 84,
    severity: 'HIGH',
    verdict: 'DUPLICATE_BILLING_AND_PO_OVERRUN',
    verdictSummary: 'Automated cross-document correlation detected identical Invoice #INV-8842 submitted twice within 14 calendar days under differing Purchase Order references. Furthermore, billed sum of INR 4,20,000 breaches approved PO cap of INR 2,10,000 by 100%.',
    createdDate: '2026-11-02T14:15:00Z',
    assignedInvestigator: 'Analyst Meera Sen (VAPT Threat Hunter)',
    documents: [
      {
        id: 'DOC-094-1',
        filename: 'vendor_invoice_apex_tech_nov12.pdf',
        displayName: 'Vendor Invoice #INV-8842 (Dated 12-Nov-2026)',
        docType: 'VENDOR_INVOICE',
        fileType: 'application/pdf',
        tamperingDetected: false,
        riskScore: 40,
        sha256: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
        extractedData: {
          invoiceNumber: 'INV-8842',
          invoiceDate: '12-Nov-2026',
          vendorName: 'Apex Cloud & Network Solutions LLP',
          vendorGstin: '27AABCA1234F1Z5',
          poReference: 'PO-9102',
          subtotal: 355932.20,
          cgst: 32033.90,
          sgst: 32033.90,
          totalAmount: 420000.00,
          bankDetails: 'ICICI Bank A/C 001205009988'
        },
        visualFindings: []
      },
      {
        id: 'DOC-094-2',
        filename: 'vendor_invoice_apex_tech_repeat_nov26.pdf',
        displayName: 'Vendor Invoice #INV-8842 Duplicate (Dated 26-Nov-2026)',
        docType: 'VENDOR_INVOICE',
        fileType: 'application/pdf',
        tamperingDetected: true,
        riskScore: 88,
        sha256: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
        extractedData: {
          invoiceNumber: 'INV-8842',
          invoiceDate: '26-Nov-2026',
          vendorName: 'Apex Cloud & Network Solutions LLP',
          vendorGstin: '27AABCA1234F1Z5',
          poReference: 'PO-9910',
          subtotal: 355932.20,
          cgst: 32033.90,
          sgst: 32033.90,
          totalAmount: 420000.00,
          bankDetails: 'ICICI Bank A/C 001205009988'
        },
        visualFindings: [
          {
            id: 'vf-094-po-1',
            type: 'PO_METADATA_ALTERATION',
            tool: 'Header-Footer Structure Diff Engine',
            severity: 'HIGH',
            title: 'Purchase Order Reference Substitution',
            description: 'Invoice #INV-8842 re-submitted with PO Reference altered from PO-9102 to PO-9910. Line items, quantities, subtotal, and tax breakdowns are bit-for-bit identical.',
            box: { x: 55, y: 18, width: 35, height: 6 },
            confidence: 0.98
          }
        ]
      },
      {
        id: 'DOC-094-3',
        filename: 'approved_purchase_order_po9102.pdf',
        displayName: 'Approved Purchase Order PO-9102',
        docType: 'PURCHASE_ORDER',
        fileType: 'application/pdf',
        tamperingDetected: false,
        riskScore: 10,
        sha256: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
        extractedData: {
          poNumber: 'PO-9102',
          issuedDate: '01-Nov-2026',
          approvedBudgetCap: 210000.00,
          approver: 'Director of Infrastructure, TechOps',
          authorizedVendor: 'Apex Cloud & Network Solutions LLP'
        },
        visualFindings: []
      }
    ],
    crossDocCorrelations: [
      {
        id: 'cdc-094-1',
        title: 'Duplicate Invoice Submission (Identical Invoice #INV-8842)',
        severity: 'CRITICAL',
        riskImpact: 92,
        type: 'DUPLICATE_BILLING_ATTEMPT',
        sourceDocId: 'DOC-094-1',
        sourceDocName: 'Vendor Invoice 12-Nov-2026',
        sourceField: 'Invoice #INV-8842 (INR 4,20,000)',
        targetDocId: 'DOC-094-2',
        targetDocName: 'Vendor Invoice 26-Nov-2026',
        targetField: 'Invoice #INV-8842 (INR 4,20,000)',
        discrepancyDelta: '100% Redundant Claim (INR 4,20,000)',
        analysisGrounded: 'Identical invoice number INV-8842 was submitted on 12-Nov and again on 26-Nov with identical line items (Core Switch Redundancy Migration). The second submission swapped the PO reference to PO-9910 in an attempt to bypass automated ERP duplicate checks.',
        recommendation: 'Block ERP disbursement queue for ICICI Bank A/C 001205009988 immediately. Notify Internal Audit.'
      },
      {
        id: 'cdc-094-2',
        title: 'Billed Amount Exceeds Approved Purchase Order Cap',
        severity: 'HIGH',
        riskImpact: 82,
        type: 'PO_BUDGET_OVERRUN',
        sourceDocId: 'DOC-094-1',
        sourceDocName: 'Vendor Invoice 12-Nov-2026',
        sourceField: 'Billed Total: INR 4,20,000',
        targetDocId: 'DOC-094-3',
        targetDocName: 'Purchase Order PO-9102',
        targetField: 'Approved Cap: INR 2,10,000',
        discrepancyDelta: 'INR +2,10,000 (+100% Over Budget)',
        analysisGrounded: 'Approved Purchase Order PO-9102 authorizes a maximum disbursement limit of INR 2,10,000. Billed invoice demands INR 4,20,000 without an attached or signed Variation / Change Order.',
        recommendation: 'Reject invoice line item overflow until authorized revision signed by CTO.'
      }
    ],
    chainOfCustody: [
      {
        timestamp: '2026-11-02T14:15:00Z',
        actor: 'ERP Vendor Ingestion Pipe',
        action: 'DOCUMENT_INGESTED',
        details: 'Received electronic procurement packet with 3 documents.',
        sha256Seal: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'
      },
      {
        timestamp: '2026-11-02T14:15:08Z',
        actor: 'ForensIQ Cross-Doc Correlator',
        action: 'DUPLICATE_HASH_DETECTED',
        details: 'Line-item fingerprint match detected against historic invoice repository.',
        sha256Seal: 'b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01'
      }
    ]
  },
  {
    id: 'CASE-2026-105',
    caseNumber: 'DFIR-2026-105-GRC',
    title: 'Executive Governance: Splice Forgery & Chronological Authorization Inversion',
    targetEntity: 'Sterling Digital Infra Ventures Ltd (CIN: U72200DL2018PLC339912)',
    sector: 'Corporate Governance / VAPT / Legal Compliance',
    status: 'ACTIVE_INVESTIGATION',
    riskScore: 89,
    severity: 'CRITICAL',
    verdict: 'SIGNATORY_TAMPERING_AND_TEMPORAL_PARADOX',
    verdictSummary: 'Digital board resolution contains an optically displaced executive signature with background noise floor mismatch. Furthermore, document cites regulatory amendment 4 weeks prior to official gazette publication, creating an irreconcilable temporal causality violation.',
    createdDate: '2026-11-01T11:00:00Z',
    assignedInvestigator: 'Chief Forensics Lead Dr. A. Varma',
    documents: [
      {
        id: 'DOC-105-1',
        filename: 'board_resolution_borrowing_mandate.pdf',
        displayName: 'Special Resolution: Enhancement of Borrowing Powers',
        docType: 'LEGAL_RESOLUTION',
        fileType: 'application/pdf',
        tamperingDetected: true,
        riskScore: 91,
        sha256: '99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff',
        extractedData: {
          companyName: 'Sterling Digital Infra Ventures Ltd',
          cin: 'U72200DL2018PLC339912',
          resolutionDate: '14-Oct-2026',
          signatoryStated: 'Managing Director Rajeshwar Rao',
          authorizedBorrowingLimit: 'INR 150,00,00,000 (150 Crores)',
          citedStatute: 'MCA Notification F.No. 01/02/2026-CL-V Dated 28-Oct-2026'
        },
        visualFindings: [
          {
            id: 'vf-105-sig-1',
            type: 'SIGNATURE_SPLICE_FORGERY',
            tool: 'Bicubic Splice Boundary & Noise Discontinuity Detector',
            severity: 'CRITICAL',
            title: 'Signature Bounding Box Background Discontinuity',
            description: 'The MD signature exhibits a rectangular boundary bounding box where background PDF noise floor drops sharply to 0.0dB against the document baseline of 18.2dB. Transparent PNG alpha-mask stamp spliced over vector canvas.',
            box: { x: 62, y: 82, width: 32, height: 12 },
            confidence: 0.97
          }
        ]
      }
    ],
    crossDocCorrelations: [
      {
        id: 'cdc-105-1',
        title: 'Temporal Chronological Causality Violation',
        severity: 'CRITICAL',
        riskImpact: 94,
        type: 'TEMPORAL_CAUSALITY_CONFLICT',
        sourceDocId: 'DOC-105-1',
        sourceDocName: 'Special Board Resolution',
        sourceField: 'Document Execution Date: 14-Oct-2026',
        targetDocId: 'DOC-105-1',
        targetDocName: 'MCA Gazette Regulatory Register',
        targetField: 'Notification Gazetted Date: 28-Oct-2026',
        discrepancyDelta: 'Causal Inversion (-14 Days)',
        analysisGrounded: 'The Board Resolution claims to have been executed on 14-Oct-2026 under the powers of MCA Notification 01/02/2026-CL-V. However, the official Ministry of Corporate Affairs gazette notification was only promulgated 14 days later on 28-Oct-2026. A legal instrument cannot lawfully cite a government notification before it was issued.',
        recommendation: 'Freeze corporate credit enhancement request. Refer to Corporate Vigilance & Registrar of Companies.'
      }
    ],
    chainOfCustody: [
      {
        timestamp: '2026-11-01T11:00:00Z',
        actor: 'Legal Intake Terminal',
        action: 'DOCUMENT_INGESTED',
        details: 'Mandate file uploaded for corporate loan syndication verification.',
        sha256Seal: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'
      }
    ]
  }
];

module.exports = {
  FORENSIC_CASES
};
