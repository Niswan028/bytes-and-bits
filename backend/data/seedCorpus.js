// Baseline Clinical Seed Corpus for CareSyncIQ
// Powers Grounded RAG, Longitudinal Patient Timelines, Safety Checks & Audit Trails

const SEED_DOCUMENTS = [
  {
    _id: 'doc_dr_lal_pathlabs_lipid_panel_p1001.pdf',
    filename: 'dr_lal_pathlabs_lipid_panel_p1001.pdf',
    originalName: 'dr_lal_pathlabs_lipid_panel_p1001.pdf',
    documentType: 'lab_report',
    status: 'verified',
    pageCount: 1,
    processingMethod: 'digital',
    fileHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    pages: [
      {
        pageNumber: 1,
        section: 'Biochemistry & Endocrine Panel',
        text: `DR. LAL PATHLABS CLINICAL PATHOLOGY DIVISION
Branch: Indiranagar Diagnostic Centre, 100ft Road, Bengaluru 560038 | NABL Accredited | SYNTHETIC DEMO DATA

Patient Name: Rajesh Sharma | UHID: P1001 | Age/Gender: 58 Yrs / Male
Sample Collection: 12-Mar-2026 07:45 AM | Status: Final Certified
Referring Doctor: Dr. Arvind Rao (MD, DM Endocrinology)

DEPARTMENT OF BIOCHEMISTRY & ENDOCRINE ASSAYS:
1. Fasting Blood Sugar: 148.0 mg/dL (Reference Range: 70.0 - 99.0 mg/dL) [HIGH]
2. HbA1c (Glycated Hemoglobin): 7.8 % (Reference: < 5.7% Normal, 5.7-6.4% Prediabetes, >= 6.5% Diabetes) [HIGH - Poor Glycemic Control]
3. Estimated Average Glucose (eAG): 177.0 mg/dL (Reference: 90.0 - 120.0 mg/dL) [ELEVATED]
4. Total Cholesterol: 228.0 mg/dL (Reference: < 200.0 mg/dL) [HIGH]
5. Triglycerides: 195.0 mg/dL (Reference: < 150.0 mg/dL) [HIGH]
6. HDL Cholesterol: 38.0 mg/dL (Reference: > 40.0 mg/dL Male) [LOW]
7. LDL Cholesterol (Calculated): 151.0 mg/dL (Reference: < 100.0 mg/dL) [HIGH]
8. VLDL Cholesterol: 39.0 mg/dL (Reference: < 30.0 mg/dL) [HIGH]
9. Serum Creatinine: 1.10 mg/dL (Reference: 0.70 - 1.20 mg/dL) [NORMAL]
10. eGFR (CKD-EPI): 74.0 mL/min/1.73m² (Reference: > 60.0 mL/min/1.73m²) [NORMAL]

Pathologist Sign-off: Dr. K. Radhakrishnan, MD (Pathology), Reg #KMC-41289. Signed at 12-Mar-2026 14:30:15.`
      }
    ]
  },
  {
    _id: 'doc_metropolis_lipid_panel_duplicate_p1001.pdf',
    filename: 'metropolis_lipid_panel_duplicate_p1001.pdf',
    originalName: 'metropolis_lipid_panel_duplicate_p1001.pdf',
    documentType: 'lab_report',
    status: 'flagged_duplicate',
    pageCount: 1,
    processingMethod: 'digital',
    fileHash: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef1',
    pages: [
      {
        pageNumber: 1,
        section: 'Lipid Fractionation (Duplicate Test)',
        text: `METROPOLIS HEALTHCARE PATHOLOGY NETWORK
Koramangala Diagnostic Hub, 80ft Road, Bengaluru | CAP & NABL Accredited | SYNTHETIC DEMO DATA

Patient Name: Rajesh Sharma | Patient ID / MRN: P1001 | Age/Gender: 58 Yrs / Male
Collection Date: 28-Mar-2026 08:15 AM (16 days after Lal PathLabs test)
Referring Physician: Dr. Sneha Roy (MD Cardiology, Fortis Care)
Test Scope: Repeat Comprehensive Lipid Profile

CLINICAL BIOCHEMISTRY - LIPID FRACTIONATION:
1. Total Cholesterol: 224.0 mg/dL (Biological Reference: < 200.0 mg/dL) [Borderline High]
2. Serum Triglycerides: 190.0 mg/dL (Reference: < 150.0 mg/dL) [High]
3. HDL Cholesterol: 39.0 mg/dL (Reference: > 40.0 mg/dL) [Sub-optimal]
4. LDL Cholesterol (Direct): 147.0 mg/dL (Reference: < 100.0 mg/dL) [Elevated]
5. Non-HDL Cholesterol: 185.0 mg/dL (Reference: < 130.0 mg/dL) [Elevated]

CLINICAL NOTE: Ordered without prior record linkage. Correlate with recent clinical history.
Supervising Biochemist: Dr. S. Ananth, MD (Biochemistry). Date: 28-Mar-2026 15:10.`
      }
    ]
  },
  {
    _id: 'doc_apollo_sugar_prescription_dr_rao_p1001.pdf',
    filename: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
    originalName: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
    documentType: 'prescription',
    status: 'verified',
    pageCount: 1,
    processingMethod: 'digital',
    fileHash: 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef2',
    pages: [
      {
        pageNumber: 1,
        section: 'Endocrinology Consultation Rx',
        text: `APOLLO SUGAR CLINIC & DIABETES SPECIALTY CENTRE
14th Main, 4th Block, Jayanagar, Bengaluru 560011 | Tel: 080-26598811 | SYNTHETIC DEMO DATA

Patient Name: Rajesh Sharma | UHID: P1001 | Age / Gender: 58 Yrs / M
Consult Date: 10-Jan-2026 | Doctor: Dr. Arvind Rao (MD, DM Endocrinology, KMC #38192)
Vitals: BP 142/88 mmHg, Pulse 76 bpm, Weight 82 kg, BMI 27.8 kg/m²
KNOWN ALLERGIES: PENICILLIN (ANAPHYLAXIS, ANGIOEDEMA) - STRICT CONTRAINDICATION
Primary Diagnoses: Type 2 Diabetes Mellitus (ICD-10: E11.9), Essential Hypertension (ICD-10: I10)

OUTPATIENT PRESCRIPTION (Rx):
1. Tab. Metformin Hydrochloride IP 500 mg: 1 Tab Twice Daily (BD) after meals x 90 Days. Glycemic control (Biguanide).
2. Tab. Telmisartan IP 40 mg: 1 Tab Once Daily (OD) morning x 90 Days. Hypertension (ARB).
3. Tab. Atorvastatin IP 20 mg: 1 Tab Once Daily (HS) at bedtime x 90 Days. Dyslipidemia & CV risk reduction.

Advice: Low glycemic index diabetic diet, salt restriction (< 5g/day). Weekly blood glucose tracking.
Repeat HbA1c and Lipid Profile in 3 months (Due April 2026).
ALLERGY WARNING RECORDED: Strictly avoid Penicillins, Ampicillin, Amoxicillin.
Digital Verification Signature: AR-APOLLO-99120.`
      }
    ]
  },
  {
    _id: 'doc_city_family_clinic_conflicting_rx_p1001.pdf',
    filename: 'city_family_clinic_conflicting_rx_p1001.pdf',
    originalName: 'city_family_clinic_conflicting_rx_p1001.pdf',
    documentType: 'prescription',
    status: 'flagged_conflict',
    pageCount: 1,
    processingMethod: 'digital',
    fileHash: 'd4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef3',
    pages: [
      {
        pageNumber: 1,
        section: 'General Practice Conflicting Rx',
        text: `CITY FAMILY HEALTH CLINIC
Sector 2, HSR Layout, Bengaluru 560102 | Tel: 080-41123300 | SYNTHETIC DEMO DATA

Patient: Rajesh Sharma | Patient ID: P1001 | Age / Gender: 58 Yrs / Male
Visit Date: 05-Apr-2026 | Consulting Doctor: Dr. Vinod Gupta (MBBS, MD, KMC #58921)
Chief Complaint: Persistent fatigue, post-prandial heaviness.
Assessment: Uncontrolled Type 2 Diabetes Mellitus.

CLINICAL PRESCRIPTION - TREATMENT ESCALATION (Rx):
1. Tab. Glipizide (Minidiab) 10 mg: 1 Tab OD before breakfast. (High Hypoglycemia Risk)
2. Tab. Metformin Extended Release 850 mg: 1 Tab BD after meals. (Conflicting Dose with Apollo 500mg BD)

DOCTOR NOTE: Patient did not present past prescription records. Escalated dose empirically.
Potential Conflicts Flagged: Patient already taking Metformin 500mg BD from Apollo Sugar Clinic. Adding 850mg BD results in unintended biguanide dose escalation (2,700 mg/day vs 1,000 mg/day) and dual therapy risk.`
      }
    ]
  },
  {
    _id: 'doc_urgent_care_allergy_conflict_rx_p1001.png',
    filename: 'urgent_care_allergy_conflict_rx_p1001.png',
    originalName: 'urgent_care_allergy_conflict_rx_p1001.png',
    documentType: 'prescription_scan',
    status: 'needs_review',
    pageCount: 1,
    processingMethod: 'ocr',
    fileHash: 'e5f6a1b2c3d47890123456789abcdef0123456789abcdef0123456789abcdef4',
    pages: [
      {
        pageNumber: 1,
        section: 'Urgent Care Handwritten Scan',
        text: `QUICKCARE URGENT & GENERAL CLINIC
Emergency Walk-in Center, BTM 2nd Stage, Bangalore | SYNTHETIC DEMO DATA
Dr. K. N. Murthy, MBBS - General Physician - Reg #KMC-29401

Date: 18-Apr-2026 | Patient: Rajesh Sharma | Age: 58 / M | UHID: P1001
Clinical Complaint: Severe cough, fever 101F, yellowish sputum x 3 days.
Clinical Impression: Acute Bacterial Bronchitis / Chest Infection.

Rx:
1. Tab. Augmentin 625 mg (Amoxicillin 500mg + Clavulanic Acid 125mg): 1 Tablet Twice Daily (BD) after meals x 5 days.
[CRITICAL CONTRAINDICATION: ALLERGIC TO PENICILLIN / AMOXICILLIN - ANAPHYLAXIS RISK]
2. Tab. Paracetamol 650 mg: 1 Tablet SOS for fever > 100F.
3. Syr. Ascoril D (Cough Expectorant): 10 ml TDS x 5 days.

Instructions: Drink warm fluids. Steam inhalation BD. Review after 5 days.
Dr. K. N. Murthy, MBBS (KMC 29401).`
      }
    ]
  },
  {
    _id: 'doc_aster_cmi_discharge_summary_p1002.pdf',
    filename: 'aster_cmi_discharge_summary_p1002.pdf',
    originalName: 'aster_cmi_discharge_summary_p1002.pdf',
    documentType: 'discharge_summary',
    status: 'verified',
    pageCount: 1,
    processingMethod: 'digital',
    fileHash: 'f6a1b2c3d4e57890123456789abcdef0123456789abcdef0123456789abcdef5',
    pages: [
      {
        pageNumber: 1,
        section: 'Inpatient Pulmonology Discharge Summary',
        text: `ASTER CMI MULTISPECIALTY HOSPITAL
New Airport Road, NH 44, Hebbal, Bengaluru 560092 | Joint Commission International (JCI) Accredited | SYNTHETIC DEMO DATA

Patient Name: Priya Venkat | UHID / IP No: P1002 / IP-2026-904 | Age / Gender: 34 Yrs / Female
Admission Date: 12-Feb-2026 | Discharge Date: 14-Feb-2026
Primary Consultant: Dr. Meera Nambiar (MD Pulmonology), Dr. R. Swaminathan (MD Endocrinology)
ALLERGIES: ASPIRIN & NSAIDs (IBUPROFEN, NAPROXEN, DICLOFENAC) - INDUCES SEVERE ACUTE BRONCHOSPASM (AERD TRIAD)

DISCHARGE CLINICAL SUMMARY & DIAGNOSES:
1. Acute Exacerbation of Bronchial Asthma (Moderate Persistent, ICD-10: J45.40)
2. Primary Hypothyroidism (ICD-10: E03.9) on hormone replacement therapy

HOSPITAL COURSE & LABORATORY HIGHLIGHTS:
- Thyroid Stimulating Hormone (TSH): 7.82 mIU/L (Reference: 0.40 - 4.20 mIU/L) [Elevated; Levothyroxine dose titrated from 50 to 75 mcg]
- Free Thyroxine (FT4): 0.88 ng/dL (Reference: 0.80 - 1.80 ng/dL) [Low Normal]
- Absolute Eosinophil Count (AEC): 620 cells/mcL (Reference: 20 - 500 cells/mcL) [Elevated - Atopic phenotype]
- Serum IgE Total: 410 IU/mL (Reference: < 100 IU/mL) [High Atopic Marker]
- SpO2 (Room Air): 98% at discharge (91% on admission)

DISCHARGE MEDICATIONS (Rx):
1. Budesonide + Formoterol Turbuhaler (160/4.5 mcg): 2 Puffs Twice Daily (BD). Mouth rinse after inhalation.
2. Tab. Montelukast 10 mg: 1 Tab OD at bedtime (HS). Leukotriene receptor antagonist.
3. Tab. Levothyroxine Sodium 75 mcg: 1 Tab OD early morning. Strictly empty stomach 45m before breakfast.

MANDATORY SAFETY ADVISORY:
STRICT CONTRAINDICATION: NSAIDs & ASPIRIN. Even small doses of Ibuprofen, Naproxen, or Diclofenac trigger life-threatening acute asthma exacerbations (AERD).
For analgesia, use Paracetamol (Acetaminophen) with physician guidance.
Follow up with Pulmonology & Endocrinology in 6 weeks with repeat TSH.
Dr. Meera Nambiar, MD, DNB (Pulmonology), Reg #KMC-44102.`
      }
    ]
  },
  {
    _id: 'doc_ortho_care_nsaid_allergy_rx_p1002.png',
    filename: 'ortho_care_nsaid_allergy_rx_p1002.png',
    originalName: 'ortho_care_nsaid_allergy_rx_p1002.png',
    documentType: 'prescription_scan',
    status: 'needs_review',
    pageCount: 1,
    processingMethod: 'ocr',
    fileHash: 'a2b3c4d5e6f17890123456789abcdef0123456789abcdef0123456789abcdef6',
    pages: [
      {
        pageNumber: 1,
        section: 'Orthopaedic Handwritten Prescription Scan',
        text: `ADVANCED BONE & JOINT ORTHOPAEDIC CLINIC
10th Main, Malleshwaram, Bangalore - 560003 | Phone: 080-23349911 | SYNTHETIC DEMO DATA
Dr. C. S. Reddy, MS (Ortho), FISM - Consultant Orthopaedic Surgeon - Reg #KMC-31882

Date: 20-Mar-2026 | Patient: Priya Venkat | Age: 34 / F | UHID: P1002
Clinical Case: Inversion injury left ankle.
Diagnosis: Grade 1 Ankle Ligament Sprain with localized swelling & tenderness.

Rx:
1. Tab. Ibuprofen 400 mg (Brufen): 1 Tablet Thrice Daily (TDS) after food x 5 days.
[CRITICAL ALERT: SEVERE ALLERGY CONFLICT IN ASTHMATIC PATIENT - CONTRAINDICATED IN ASPIRIN/NSAID ALLERGY]
2. Tab. Pantoprazole 40 mg (Pan-40): 1 Tablet OD before food x 5 days.
3. Crepe Bandage 10 cm & Ice compression x 3 days.

R.I.C.E. protocol: Rest, Ice, Compression, Elevation. Review in 1 week.
Dr. C. S. Reddy, MS (Ortho) | KMC Reg #31882.`
      }
    ]
  },
  {
    _id: 'doc_apollo_pharmacy_dispensing_log_p1002.csv',
    filename: 'apollo_pharmacy_dispensing_log_p1002.csv',
    originalName: 'apollo_pharmacy_dispensing_log_p1002.csv',
    documentType: 'pharmacy_log',
    status: 'verified',
    pageCount: 1,
    processingMethod: 'tabular',
    fileHash: 'b3c4d5e6f1a27890123456789abcdef0123456789abcdef0123456789abcdef7',
    pages: [
      {
        pageNumber: 1,
        section: 'Pharmacy Dispensing Ledger',
        text: `APOLLO PHARMACY MULTI-YEAR DISPENSING AUDIT LOG
Branch #4012, 80ft Road, Koramangala, Bengaluru | SYNTHETIC DEMO DATA

TransactionID | DispenseDate | PatientID | PatientName | PrescribedMedication | BrandName | QuantityDispensed | Unit | PrescribingProvider | PharmacistLicense | Notes
TX-2025-0102 | 15-Dec-2025 | P1002 | Priya Venkat | Levothyroxine 50 mcg | Thyronorm 50 | 100 | Tablets | Dr. Swaminathan (Endo) | KA-PHARM-8819 | Baseline dose dispensed
TX-2026-0045 | 15-Jan-2026 | P1002 | Priya Venkat | Budesonide/Formoterol 160/4.5 | Symbicort Turbuhaler | 1 | Inhaler (120 doses) | Dr. Meera Nambiar (Pulm) | KA-PHARM-8819 | Refill dispensed
TX-2026-0128 | 16-Feb-2026 | P1002 | Priya Venkat | Levothyroxine 75 mcg | Thyronorm 75 | 100 | Tablets | Aster CMI Hospital | KA-PHARM-9021 | Dose escalated per TSH 7.82
TX-2026-0129 | 16-Feb-2026 | P1002 | Priya Venkat | Montelukast 10 mg | Montair 10 | 30 | Tablets | Aster CMI Hospital | KA-PHARM-9021 | Post-discharge fill
TX-2026-0214 | 22-Mar-2026 | P1002 | Priya Venkat | Ibuprofen 400 mg | Brufen 400 | 15 | Tablets | Bone & Joint Clinic | KA-PHARM-9021 | Dispensed without allergy check`
      }
    ]
  },
  {
    _id: 'doc_st_johns_cardio_warfarin_interaction_p1003.pdf',
    filename: 'st_johns_cardio_warfarin_interaction_p1003.pdf',
    originalName: 'st_johns_cardio_warfarin_interaction_p1003.pdf',
    documentType: 'clinical_summary',
    status: 'flagged_interaction',
    pageCount: 1,
    processingMethod: 'digital',
    fileHash: 'c4d5e6f1a2b37890123456789abcdef0123456789abcdef0123456789abcdef8',
    pages: [
      {
        pageNumber: 1,
        section: 'Cardiology Specialist Interaction Alert',
        text: `ST. JOHN'S MEDICAL COLLEGE & CARDIOLOGY CENTRE
Sarjapur Road, John Nagar, Bengaluru 560034 | SYNTHETIC DEMO DATA

Patient Name: Anita Desai | UHID / Hospital #: P1003 | Age / Gender: 67 Yrs / Female
Consult Date: 02-Apr-2026 | Consultant: Dr. George Thomas (MD, DM Cardiology, Reg #KMC-18824)
Diagnoses: Non-valvular Atrial Fibrillation (ICD-10: I48.0), Hypertension (I10)
Allergies: Sulfa Drugs (Sulfamethoxazole - facial edema)

LONGITUDINAL MEDICATION REGIMEN & CRITICAL INTERACTION ALERT:
1. Tab. Warfarin Sodium 3 mg: 1 Tab OD evening. Prescribed for stroke prevention in AF.
Concurrent Drug Added by Clinic B: Tab. Clarithromycin 500 mg BD (Chest infection).
CRITICAL INTERACTION: CYP3A4 / CYP2C9 enzyme inhibition -> Impaired S-warfarin clearance -> Severe INR Surge & Bleeding Risk.
2. Tab. Amlodipine 5 mg: 1 Tab OD morning. Prescribed for Hypertension. Stable.

COAGULATION PROFILE (EMERGENCY STAT LAB):
- Prothrombin Time (PT): 44.2 seconds (Reference Range: 11.0 - 13.5 seconds) [Markedly Prolonged]
- International Normalized Ratio (INR): 4.80 (Target AF Range: 2.00 - 3.00) [CRITICAL RISK: Major Hemorrhage / Hematoma]

EMERGENCY ACTION TAKEN: Warfarin temporarily withheld. Discontinued Clarithromycin. Administered Oral Vitamin K1 2.5 mg. Repeat INR in 24 hours.
Dr. George Thomas, MD, DM (Cardiology), FACC.`
      }
    ]
  }
];

module.exports = {
  SEED_DOCUMENTS
};
