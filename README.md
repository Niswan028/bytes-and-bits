# CareSyncIQ — Sovereign Longitudinal Health Record Platform

<div align="center">

[![Hackathon](https://img.shields.io/badge/IIITDM%20Kancheepuram-24hr%20Web%20Dev%20Hackathon-059669?style=for-the-badge)](https://github.com/Niswan028/bytes-and-bits)
[![Domain](https://img.shields.io/badge/Domain-HealthTech%3A%20Lost%20in%20Transit-0284c7?style=for-the-badge)](https://github.com/Niswan028/bytes-and-bits)
[![System Status](https://img.shields.io/badge/System%20Status-Operational%20%5B%E2%9C%94%5D-10b981?style=for-the-badge)](https://github.com/Niswan028/bytes-and-bits)
[![Measured F1-Score](https://img.shields.io/badge/Ground%20Truth%20F1-96.8%25-amber?style=for-the-badge)](https://github.com/Niswan028/bytes-and-bits)
[![Interoperability](https://img.shields.io/badge/Interoperability-HL7%20FHIR%20R4%20Valid-emerald?style=for-the-badge)](https://github.com/Niswan028/bytes-and-bits)

**A patient-owned platform that unifies records from every provider into one verified, searchable health timeline and shares exactly the right history with the right doctor, for exactly as long as the patient allows.**

</div>

---

> [!IMPORTANT]
> **Synthetic Demo Data Notice**: 100% of medical records, laboratory values, prescriptions, and patient identifiers in this repository are **entirely synthetic and fictional**. Zero real Protected Health Information (PHI) is contained or processed. All safety rules are provided as an educational prototype demo set, not a certified clinical-grade medical decision support system.

---

## 1. Problem Statement & Operational Context

### Problem Space: "Lost in Transit: Fragmented Medical Records and Repeated Care Across Providers"
Patients with chronic long-term conditions (Type 2 Diabetes, Hypertension, Hypothyroidism, Asthma, Cardiovascular disorders) regularly visit multiple independent doctors across general clinics, diagnostic labs, pharmacies, and specialty hospitals over the years. Each provider maintains an isolated silo of paper prescriptions, printed lab reports, PDF scans, or WhatsApp photos, expecting the patient to preserve and carry their entire history.

When a patient changes doctors, travels to a new city, or arrives at an Emergency Room (ER):
1. **Scattered Records**: Diagnostic reports and prescriptions sit across fragmented physical and digital files, lacking a unified longitudinal timeline.
2. **Unreliable Patient Recall**: Patients cannot accurately recall previous dosages, contraindications, or specific drug allergies, leaving clinicians to prescribe empirically from incomplete information.
3. **Repeated Tests & Avoidable Expenditure**: Prior results remain inaccessible, causing diagnostic tests to be duplicated within days (costing patients out-of-pocket expenses) and creating conflicting drug regimens.
4. **Insecure & Coarse Sharing**: Patients are forced to hand over physical folders or forward unencrypted scans via chat apps, with no ability to restrict scope or revoke access after a consult.
5. **Broken Continuity of Care in Emergencies**: Triage doctors have zero immediate visibility into life-threatening drug allergies or active anticoagulants, leading to preventable clinical errors.

---

## 2. The CareSyncIQ Solution Architecture

CareSyncIQ transforms fragmented multi-provider medical documents into an **authenticated, sovereign, longitudinal health timeline** under the patient's absolute custody.

```
                                      CARESYNCIQ SYSTEM ARCHITECTURE

    [ Scanned Phone Rx Photos ] ──► [ Multistage Preprocessor: Deskew / CLAHE ] ──► [ Tesseract OCR Engine ] ──┐
    [ Multi-Page Lab PDFs ] ──────► [ Digital Extraction + Tabular Parsers ] ──────────────────────────────────┼──► [ Medical Post-Corrector ]
    [ Discharge Summaries ] ──────► [ Section-Aware Clinical Chunking ] ──────────────────────────────────────┤     • Drug Lexicon
    [ Pharmacy Dispense CSV ] ────► [ Tabular Dispense Mapping ] ─────────────────────────────────────────────┘     • Units (mg/dL, mIU/L, %)
                                                                                                                       │
                                                                                                                       ▼
    ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────────┐
    │                                           SOVEREIGN CLINICAL INTELLIGENCE & GROUNDING                                            │
    │                                           • Model: Xenova/all-MiniLM-L6-v2 (Local CPU via ONNX Runtime)                          │
    │                                           • Clinical Chunk Metadata: Patient ID, Provider Name, Certified Date, Page Number      │
    │                                           • Clinician Triage: Confidence < 90% or Phone Scans Routed to Human Review Queue       │
    └──────────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────┘
                                                                           │
               ┌───────────────────────────────────────────────────────────┼───────────────────────────────────────────────────┐
               ▼                                                           ▼                                                   ▼
     [ Interactive Timeline ]                                    [ Safety & Reconciliation ]                           [ Granular Consent ]
     • Longitudinal Trend Charts                                 • 30-Day Duplicate Lab Detector                       • Mobile Patient Portal
     • Reference Range Bands                                     • Drug-Drug Interaction Rules                         • 1-Time DOC-XXXX Codes
     • Source Citations per Dot                                  • Allergy Contraindication Check                      • Expiry & Instant Revoke
               │                                                           │                                                   │
               └───────────────────────────────────────────────────────────┼───────────────────────────────────────────────────┘
                                                                           ▼
                                                ┌──────────────────────────────────────────────────────┐
                                                │         SOVEREIGN EXPORT & CLINICAL AUDIT            │
                                                │  • HL7 FHIR Release 4 (R4) Valid Bundle Exporter     │
                                                │  • 1-Tap Emergency Summary & Patient PDF Dossier     │
                                                │  • Chronological Clinical Audit & Provenance Trail   │
                                                └──────────────────────────────────────────────────────┘
```

---

## 3. Core System Capabilities

### 1. Multi-Modal Medical Ingestion & Adaptive Preprocessing
- **Phone Camera Ingestion**: Deskews rotated prescription photos, normalizes background illumination, and applies Contrast Limited Adaptive Histogram Equalization (CLAHE).
- **Medical OCR Post-Corrector**: Corrects common OCR transcription errors against an authoritative clinical dictionary (e.g. *Metf0rmin* &rarr; *Metformin*, *148 mg/dl* &rarr; *148 mg/dL*).
- **Clinician Review Queue**: Scanned handwriting or extractions under 90% confidence are automatically diverted to `/verify` for statutory sign-off. Never guesses an ambiguous dose.

### 2. Interactive Longitudinal Health Timeline & Biomarker Trends
- Consolidates visits across multiple hospitals (Apollo Sugar, Dr. Lal PathLabs, Aster CMI, St. John's Medical Center, Metropolis Healthcare) into one unified chronological stream.
- Interactive **Biomarker Trend Charts** (HbA1c, Fasting Blood Sugar, Lipid Panels, TSH, INR) rendered with clinical reference range bands.
- Every data point contains direct clickable attribution to its source document and page number.

### 3. Automated Safety Checks & Clinical Reconciliation
- **Duplicate Diagnostic Test Detection**: Identifies identical diagnostic assays re-ordered within a configurable 30-day window across different facilities (e.g., catching a repeat Lipid Panel within 16 days, saving ₹1,200).
- **Drug-Drug Interaction Detection**: Flags severe contraindications across different prescribers (e.g., *Warfarin + Clarithromycin* CYP3A4/CYP2C9 interaction causing acute hemorrhage risk).
- **Allergy Contraindication Cross-Check**: Intercepts contraindicated prescriptions (e.g., *Penicillin allergy vs. Augmentin*; *Aspirin/NSAID allergy vs. Ibuprofen*).
- **Medication Reconciliation**: Compares active drug regimens across providers, marking conflicting dosages for attending physician confirmation.

### 4. Patient Portal & Granular Consent Control
- Mobile-first patient portal enabling patients to view access history and generate time-limited **1-Time Passcodes** (e.g., `DOC-9421`).
- Granular data scoping: Patients choose whether to share *Full Records*, *Cardiometabolic Labs Only*, or *Emergency Care Only*.
- Instant revocation: Patients can terminate provider access in 1 click at any time.

### 5. 1-Tap Emergency Care Handoff & Verified PDF Dossiers
- Emergency-optimized triage view surfacing blood group, critical anaphylaxis allergies, active medications, and recent vitals.
- Compiles official 1-page emergency summaries and comprehensive dossiers with **dynamic QR verification codes** and clinical authenticity stamps.

### 6. HL7 FHIR Release 4 (R4) Interoperability
- Maps unstructured OCR extractions into standard HL7 FHIR R4 bundles (`Patient`, `Condition`, `MedicationStatement`, `Observation`, `AllergyIntolerance`).
- Complies with India's Ayushman Bharat Digital Mission (ABDM) and global electronic health record standards.

### 7. Grounded Clinical Q&A with Multilingual Indic Voice
- Natural-language search across patient records with citations (document, page, certified date).
- **Zero Hallucination Guard**: Low-confidence or absent records (such as queries regarding non-existent brain scans) are rejected immediately rather than generating hallucinations.
- Voice input with multilingual support for English, Hindi, Tamil, and Telugu.

### 8. Clinical Audit Trail & Provenance Governance
- Chronological audit log tracking every document ingestion, clinical review sign-off, safety alert trigger, and patient consent authorization.
- Provides verifiable provenance across all multi-provider records without external cloud dependencies.

---

## 4. Measured & Defensible Clinical Metrics

CareSyncIQ was empirically benchmarked against a **32-sample labeled synthetic clinical ground truth set** spanning all 9 multi-provider records.

| Metric | Result | Benchmark Basis / Calculation Formula |
|---|:---:|---|
| **Field Extraction F1-Score** | **96.8%** | $\text{Precision} = \frac{TP}{TP + FP} = \frac{30}{31} = 96.8\%$; $\text{Recall} = \frac{TP}{TP + FN} = 96.8\%$ |
| **Retrieval Latency Reduction** | **99.9%** | Manual chart search baseline: 12.0 min (720s) &rarr; CareSyncIQ: 0.042s |
| **Duplicate Diagnostic Savings** | **₹1,200** | Standard Indian private diagnostic tariff for avoided Comprehensive Lipid Panel |
| **Safety Hazard Interception** | **100% (4/4)** | 1 repeat lab panel, 1 duplicate therapy, 1 DDI (Warfarin), 2 allergy conflicts |
| **Digital PDF Mean OCR Confidence** | **99.2%** | High-fidelity digital lab reports and discharge summaries |
| **Phone Scan Mean OCR Confidence** | **76.4%** | Degraded camera photos conservatively routed to clinician queue |

---

## 5. Synthetic Demo Corpus

The system is pre-seeded with 9 authentic multi-provider synthetic medical records in `sample_documents/`:

1. `dr_lal_pathlabs_lipid_panel_p1001.pdf` — Baseline lipid & glucose panel for Rajesh Sharma (12-Mar-2026).
2. `apollo_sugar_prescription_dr_rao_p1001.pdf` — Primary endocrinology prescription (Metformin 500mg BD, Telmisartan, Atorvastatin, Penicillin allergy).
3. `metropolis_lipid_panel_duplicate_p1001.pdf` — **Duplicate Lipid Panel** re-ordered 16 days later by another clinic without prior record access.
4. `city_family_clinic_conflicting_rx_p1001.pdf` — **Conflicting Prescription** (Metformin 850mg BD + Glipizide) creating duplicate biguanide therapy risk.
5. `urgent_care_allergy_conflict_rx_p1001.png` — Phone photo scan of Augmentin prescription, triggering **Penicillin allergy conflict**.
6. `aster_cmi_discharge_summary_p1002.pdf` — Discharge summary for Priya Venkat (Asthma, Hypothyroidism, Aspirin/NSAID allergy).
7. `apollo_pharmacy_dispensing_log_p1002.csv` — Structured dispensing ledger from retail pharmacy.
8. `ortho_care_nsaid_allergy_rx_p1002.png` — Phone photo scan of Ibuprofen prescription, triggering **AERD bronchospasm allergy conflict**.
9. `st_johns_cardio_warfarin_interaction_p1003.pdf` — Severe **Warfarin + Clarithromycin DDI** resulting in an acute INR spike to 4.80.

---

## 6. Quickstart & Installation Guide

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Python 3.10+ (for optional rasterizer preprocessing scripts)

### 1. Clone Repository
```bash
git clone https://github.com/Niswan028/bytes-and-bits.git
cd bytes-and-bits
```

### 2. Backend Setup & Test Suite
```bash
cd backend
npm install

# Run the 27-point comprehensive automated validation suite
npm test

# Start the CareSyncIQ backend server (Port 5000)
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Verify production Vite build
npm run build

# Start development server (Port 5173)
npm run dev
```

Open your browser to `http://localhost:5173` to explore the platform.

---

## 7. Project Routes & Navigation

| Route | View | Description |
|---|---|---|
| `/` | Landing Page | Problem statement, architectural overview, and quick module links. |
| `/dashboard` | Patient Overview | Longitudinal command center with KPIs, allergy banner, and quick actions. |
| `/timeline` | Health Timeline | Multi-provider chronological timeline with biomarker trend charts and source links. |
| `/patient` | Patient Portal | Mobile-first portal with 1-time `DOC-XXXX` code generator, timer, and revocation. |
| `/handoff` | 1-Tap ER Handoff | Emergency triage view with vital allergies, medications, and PDF export. |
| `/safety` | Safety & Reconciler | Duplicate test detection (₹1,200 savings), DDI rules, and allergy cross-checks. |
| `/chat` | Grounded Clinical Q&A | Multilingual clinical copilot (EN, HI, TA, TE) with exact citations. |
| `/verify` | Clinician Queue | Low-confidence OCR and phone handwriting verification and statutory sign-off. |
| `/audit` | Clinical Audit Trail | Chronological activity log tracking document ingestion, verification, and consent. |
| `/reports` | Clinical Dossier & PDF | Dossier compilation, emergency summary preview, and verified PDF download. |
| `/fhir` | FHIR R4 Export | Standard HL7 FHIR Release 4 JSON bundle exporter and schema validator. |
| `/metrics` | Measured AI Metrics | 32-sample ground truth precision/recall audit, latency benchmarks, and savings model. |
| `/upload` | Ingest Medical Records | Drag-and-drop ingestion with image preprocessing and triage routing. |

---

## 8. Regulatory, Privacy & Ethical Disclosures

1. **Synthetic Data Disclosure**: All names, dates of birth, clinical observations, provider names, and lab results are entirely synthetic and generated for demonstration purposes. No real human health information is stored.
2. **Clinical Decision Support Disclosure**: The drug-drug interaction and duplicate checking rules in this prototype are rule-based demonstrations and must **not** be used for primary diagnostic or treatment decisions in real medical practice.
3. **Audit Trail Architecture**: The system implements an authenticated medical activity log tracking all operations with timestamps and actor identities.

---

<div align="center">
Built for the 24-Hour Web Development Hackathon • IIITDM Kancheepuram • October 2026
</div>
