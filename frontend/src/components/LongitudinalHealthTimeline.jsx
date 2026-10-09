import React, { useState } from 'react';
import {
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineFilter,
  HiOutlineTrendingUp,
  HiOutlineShieldCheck,
  HiOutlineOfficeBuilding
} from 'react-icons/hi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';

export const PATIENT_TIMELINE_CATALOG = {
  P1001: {
    id: 'P1001',
    name: 'Rajesh Sharma',
    age: 58,
    gender: 'Male',
    chronicConditions: ['Type 2 Diabetes Mellitus (E11.9)', 'Essential Hypertension (I10)'],
    criticalAllergies: ['Penicillin / Amoxicillin (Severe Anaphylaxis)'],
    events: [
      {
        id: 'evt-101',
        date: '10-Jan-2026',
        category: 'Outpatient Consultation',
        type: 'VISIT',
        title: 'Apollo Sugar Clinic Consultation',
        provider: 'Dr. Arvind Rao (MD, DM Endocrinology)',
        clinic: 'Apollo Sugar Clinic, Jayanagar',
        badge: 'Verified Ground Truth',
        badgeColor: 'emerald',
        summary: 'Quarterly diabetic consultation. Blood pressure 142/88 mmHg. Re-certified Metformin 500mg BD and Telmisartan 40mg OD. Penicillin allergy recorded.',
        sourceDoc: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
        page: 1
      },
      {
        id: 'evt-102',
        date: '12-Mar-2026',
        category: 'Pathology & Biochemistry',
        type: 'LAB',
        title: 'Dr. Lal PathLabs Metabolic Panel',
        provider: 'Dr. K. Radhakrishnan (MD Path)',
        clinic: 'Indiranagar Diagnostic Centre',
        badge: 'Certified Diagnostic Record',
        badgeColor: 'emerald',
        summary: 'HbA1c 7.8% (Elevated), Fasting Glucose 148 mg/dL, Total Cholesterol 228 mg/dL, Triglycerides 195 mg/dL. Normal renal creatinine 1.10 mg/dL.',
        sourceDoc: 'dr_lal_pathlabs_lipid_panel_p1001.pdf',
        page: 1
      },
      {
        id: 'evt-103',
        date: '28-Mar-2026',
        category: 'Unnecessary Repeated Lab Test',
        type: 'DUPLICATE',
        title: 'Repeat Lipid Profile (Care Fragmentation)',
        provider: 'Dr. Sneha Roy (Fortis Care)',
        clinic: 'Metropolis Healthcare Koramangala',
        badge: 'Flagged Duplicate (16d Interval)',
        badgeColor: 'amber',
        summary: 'Repeated Comprehensive Lipid Panel within 16 days of prior normal/baseline test at Dr. Lal PathLabs. Total Cholesterol 224 mg/dL. Avoidable out-of-pocket waste: ₹1,200.',
        sourceDoc: 'metropolis_lipid_panel_duplicate_p1001.pdf',
        page: 1
      },
      {
        id: 'evt-104',
        date: '05-Apr-2026',
        category: 'Conflicting Prescription',
        type: 'CONFLICT',
        title: 'City Family Clinic Dose Escalation',
        provider: 'Dr. Vinod Gupta (MBBS, MD)',
        clinic: 'City Family Clinic, HSR Layout',
        badge: 'Prescription Contradiction',
        badgeColor: 'rose',
        summary: 'Prescribed Metformin 850mg BD + Glipizide 10mg OD without knowledge of ongoing Apollo Sugar Clinic Metformin 500mg BD regimen. Triggers dual biguanide overdose warning.',
        sourceDoc: 'city_family_clinic_conflicting_rx_p1001.pdf',
        page: 1
      },
      {
        id: 'evt-105',
        date: '18-Apr-2026',
        category: 'Critical Safety Violation',
        type: 'ALLERGY_ALERT',
        title: 'QuickCare Walk-In Urgent Prescription',
        provider: 'Dr. K. N. Murthy (General Physician)',
        clinic: 'QuickCare Urgent Clinic, BTM 2nd Stage',
        badge: 'Life-Threatening Allergy Conflict',
        badgeColor: 'rose',
        summary: 'Prescribed Augmentin 625mg (Amoxicillin + Clavulanic Acid) for bronchitis, directly violating recorded Penicillin allergy.',
        sourceDoc: 'urgent_care_allergy_conflict_rx_p1001.png',
        page: 1
      }
    ],
    labCharts: [
      {
        metric: 'HbA1c (%)',
        refMin: 4.0,
        refMax: 5.6,
        targetNote: 'Normal < 5.7%, Prediabetes 5.7-6.4%, Diabetes >= 6.5%',
        data: [
          { date: 'Apr 2025', value: 8.4, provider: 'Dr. Lal PathLabs' },
          { date: 'Oct 2025', value: 8.1, provider: 'Metropolis' },
          { date: 'Mar 2026', value: 7.8, provider: 'Dr. Lal PathLabs' }
        ]
      },
      {
        metric: 'Total Cholesterol (mg/dL)',
        refMin: 120,
        refMax: 200,
        targetNote: 'Desirable < 200 mg/dL, Borderline 200-239, High >= 240',
        data: [
          { date: 'Jan 2025', value: 242, provider: 'Apollo Sugar' },
          { date: '12-Mar-2026', value: 228, provider: 'Dr. Lal PathLabs' },
          { date: '28-Mar-2026', value: 224, provider: 'Metropolis (Duplicate)' }
        ]
      }
    ]
  },
  P1002: {
    id: 'P1002',
    name: 'Priya Venkat',
    age: 34,
    gender: 'Female',
    chronicConditions: ['Moderate Persistent Bronchial Asthma (J45.40)', 'Primary Hypothyroidism (E03.9)'],
    criticalAllergies: ['Aspirin & NSAIDs (Induces acute severe bronchospasm - AERD)'],
    events: [
      {
        id: 'evt-200',
        date: '14-Aug-2025',
        category: 'Pulmonology Outpatient Clinic',
        type: 'VISIT',
        title: 'Manipal Hospital Pulmonology Review',
        provider: 'Dr. Ramesh Iyengar (MD Pulm)',
        clinic: 'Manipal Hospital, Whitefield',
        badge: 'Baseline Outpatient Note',
        badgeColor: 'emerald',
        summary: 'Chronic persistent nocturnal wheezing. Spirometry FEV1/FVC ratio 68%. Initiated Symbicort Turbuhaler 160/4.5. Aspirin-induced asthma documented.',
        sourceDoc: 'manipal_pulm_baseline_p1002.pdf',
        page: 1
      },
      {
        id: 'evt-201',
        date: '12-Feb-2026',
        category: 'Hospital Emergency Admission',
        type: 'VISIT',
        title: 'Aster CMI Hospital Inpatient Discharge',
        provider: 'Dr. Meera Nambiar (MD Pulm)',
        clinic: 'Aster CMI Multispecialty Hospital',
        badge: 'Certified Discharge Summary',
        badgeColor: 'emerald',
        summary: 'Admitted for acute asthma exacerbation triggered by viral URI. TSH elevated at 7.82 mIU/L; Levothyroxine titrated from 50 to 75 mcg. Strict Aspirin & NSAID allergy documented.',
        sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf',
        page: 1
      },
      {
        id: 'evt-202',
        date: '16-Feb-2026',
        category: 'Pharmacy Dispensing Refill',
        type: 'LAB',
        title: 'Apollo Pharmacy Post-Discharge Dispense',
        provider: 'Apollo Pharmacy Koramangala',
        clinic: 'Apollo Pharmacy Branch #4012',
        badge: 'Dispensing Ledger Verified',
        badgeColor: 'emerald',
        summary: 'Dispensed Thyronorm 75mcg (100 tabs), Symbicort 160/4.5 Turbuhaler (1 unit), Montair 10mg (30 tabs). Pharmacist Lic: KA-PHARM-9021.',
        sourceDoc: 'apollo_pharmacy_dispensing_log_p1002.csv',
        page: 1
      },
      {
        id: 'evt-203',
        date: '20-Mar-2026',
        category: 'Life-Threatening Prescribing Conflict',
        type: 'ALLERGY_ALERT',
        title: 'Orthopaedic Clinic NSAID Prescription',
        provider: 'Dr. C. S. Reddy (MS Ortho)',
        clinic: 'Bone & Joint Orthopaedic Clinic',
        badge: 'Severe Allergy Conflict',
        badgeColor: 'rose',
        summary: 'Prescribed Ibuprofen 400mg TDS for ankle sprain, directly contravening recorded Aspirin/NSAID induced asthma allergy (AERD). Intercepted by CareSyncIQ safety reconciler.',
        sourceDoc: 'ortho_care_nsaid_allergy_rx_p1002.png',
        page: 1
      },
      {
        id: 'evt-204',
        date: '04-Apr-2026',
        category: 'Endocrinology Follow-up',
        type: 'LAB',
        title: 'Thyroid Recovery Assessment & Free T4',
        provider: 'Dr. Alok Verma (MD Endocrinology)',
        clinic: 'ThyroCare Diagnostic Hub, Indiranagar',
        badge: 'Certified Diagnostic Record',
        badgeColor: 'emerald',
        summary: 'Repeat Free T4 1.12 ng/dL (Normalized from 0.88), TSH responding to 75mcg Levothyroxine (4.90 mIU/L). Patient asymptomatic on current regimen.',
        sourceDoc: 'thyrocare_followup_tsh_p1002.pdf',
        page: 1
      }
    ],
    labCharts: [
      {
        metric: 'Thyroid Stimulating Hormone (TSH, mIU/L)',
        refMin: 0.40,
        refMax: 4.20,
        targetNote: 'Normal Range: 0.40 - 4.20 mIU/L. Higher indicates hypothyroidism.',
        data: [
          { date: 'Jun 2024', value: 4.80, provider: 'Care Diagnostics' },
          { date: 'May 2025', value: 5.90, provider: 'Care Diagnostics' },
          { date: 'Feb 2026', value: 7.82, provider: 'Aster CMI Hospital' },
          { date: 'Apr 2026', value: 4.90, provider: 'ThyroCare Lab' }
        ]
      },
      {
        metric: 'Absolute Eosinophil Count (AEC, cells/mcL)',
        refMin: 40,
        refMax: 450,
        targetNote: 'Normal Range: 40 - 450 cells/mcL. Markers > 500 indicate allergic asthma.',
        data: [
          { date: 'Aug 2025', value: 480, provider: 'Manipal Hospital' },
          { date: 'Feb 2026', value: 620, provider: 'Aster CMI Hospital' },
          { date: 'Apr 2026', value: 310, provider: 'Aster CMI OPD' }
        ]
      }
    ]
  },
  P1003: {
    id: 'P1003',
    name: 'Anita Desai',
    age: 67,
    gender: 'Female',
    chronicConditions: ['Non-valvular Atrial Fibrillation (I48.0)', 'Essential Hypertension (I10)', 'Deep Vein Thrombosis History'],
    criticalAllergies: ['Sulfa Drugs (Sulfamethoxazole - Angioedema & Rash)'],
    events: [
      {
        id: 'evt-300',
        date: '15-Nov-2025',
        category: 'Cardiology Outpatient Review',
        type: 'VISIT',
        title: 'St. John\'s Hospital Baseline AF Management',
        provider: 'Dr. George Thomas (MD, DM Cardio)',
        clinic: 'St. John\'s Medical College Hospital',
        badge: 'Baseline Cardiology Record',
        badgeColor: 'emerald',
        summary: 'CHA2DS2-VASc score = 4. Initiated Tab. Warfarin 3mg OD at 6 PM. Target INR therapeutic window established at 2.0 - 3.0. Amlodipine 5mg OD continued.',
        sourceDoc: 'st_johns_cardio_baseline_p1003.pdf',
        page: 1
      },
      {
        id: 'evt-301',
        date: '10-Jan-2026',
        category: 'Anticoagulation Monitoring',
        type: 'LAB',
        title: 'Routine Prothrombin Time & INR Check',
        provider: 'Dr. Sheila Mathew (MD Path)',
        clinic: 'St. John\'s Diagnostic Central Lab',
        badge: 'Therapeutic In-Range',
        badgeColor: 'emerald',
        summary: 'Prothrombin Time 26.4s, INR 2.45 (Stable in therapeutic target window 2.0 - 3.0). Advised maintaining current 3mg Warfarin daily dosage.',
        sourceDoc: 'st_johns_routine_inr_p1003.pdf',
        page: 1
      },
      {
        id: 'evt-302',
        date: '02-Apr-2026',
        category: 'Critical Drug-Drug Interaction',
        type: 'CONFLICT',
        title: 'Severe Warfarin & Clarithromycin Interaction',
        provider: 'Dr. R. K. Singhal (Chest Physician)',
        clinic: 'Lakeside Chest & Allergy Clinic',
        badge: 'Critical Interaction Alert',
        badgeColor: 'rose',
        summary: 'Secondary walk-in clinic prescribed Clarithromycin 500mg BD for bronchitis without knowing ongoing Warfarin therapy. Potent CYP3A4/CYP2C9 enzyme inhibition caused INR to surge to 4.80 (Critical hemorrhage risk).',
        sourceDoc: 'st_johns_cardio_warfarin_interaction_p1003.pdf',
        page: 1
      },
      {
        id: 'evt-303',
        date: '03-Apr-2026',
        category: 'Emergency Triage & Reversal',
        type: 'VISIT',
        title: 'Emergency Anticoagulation Reversal & Stat Lab',
        provider: 'Dr. Priya Mathew (Emergency Lead)',
        clinic: 'St. John\'s Emergency Department',
        badge: 'Emergency Clinical Intervention',
        badgeColor: 'rose',
        summary: 'Stat PT 44.2s, INR 4.80 confirmed. Warfarin withheld immediately. Oral Vitamin K 2.5mg administered. Patient monitored for occult bleeding.',
        sourceDoc: 'st_johns_er_discharge_p1003.pdf',
        page: 1
      },
      {
        id: 'evt-304',
        date: '07-Apr-2026',
        category: 'Post-Reversal Stabilization',
        type: 'LAB',
        title: 'Stabilized Prothrombin Time & Follow-up',
        provider: 'Dr. George Thomas (MD, DM Cardio)',
        clinic: 'St. John\'s Cardiology Clinic',
        badge: 'Reconciled & Normalized',
        badgeColor: 'emerald',
        summary: 'Repeat INR 2.30 (Normalized in therapeutic window). Warfarin restarted cautiously at 2.5mg OD. Clarithromycin discontinued; Azithromycin safe alternative noted.',
        sourceDoc: 'st_johns_followup_inr_p1003.pdf',
        page: 1
      }
    ],
    labCharts: [
      {
        metric: 'International Normalized Ratio (INR)',
        refMin: 2.00,
        refMax: 3.00,
        targetNote: 'Target Therapeutic AF Range: 2.00 - 3.00. > 4.5 indicates high hemorrhage danger.',
        data: [
          { date: 'Nov 2025', value: 2.20, provider: 'St. John\'s Lab' },
          { date: 'Jan 2026', value: 2.45, provider: 'St. John\'s Lab' },
          { date: '02-Apr-2026', value: 4.80, provider: 'Emergency Stat Lab (Spike)' },
          { date: '07-Apr-2026', value: 2.30, provider: 'St. John\'s Cardiology' }
        ]
      },
      {
        metric: 'Prothrombin Time (Seconds)',
        refMin: 11.0,
        refMax: 15.0,
        targetNote: 'Control baseline: 12.0s. Therapeutic target ~24-30s.',
        data: [
          { date: 'Nov 2025', value: 24.1, provider: 'St. John\'s Lab' },
          { date: 'Jan 2026', value: 26.4, provider: 'St. John\'s Lab' },
          { date: '02-Apr-2026', value: 44.2, provider: 'Emergency Stat Lab (Prolonged)' },
          { date: '07-Apr-2026', value: 25.0, provider: 'St. John\'s Cardiology' }
        ]
      }
    ]
  },
  P1004: {
    id: 'P1004',
    name: 'Vikram Malhotra',
    age: 46,
    gender: 'Male',
    chronicConditions: ['Post-CABG (Triple Vessel Bypass)', 'Severe Hypercholesterolemia (E78.0)', 'CKD Stage 3a (N18.3)'],
    criticalAllergies: ['Radiocontrast Media (Iodinated Contrast - Anaphylactoid Shock)'],
    events: [
      {
        id: 'evt-400',
        date: '08-Sep-2025',
        category: 'Surgical Inpatient Discharge',
        type: 'VISIT',
        title: 'CMC Vellore CABG Surgical Discharge',
        provider: 'Dr. Vinay Kumar (MCh Cardiothoracic)',
        clinic: 'CMC Vellore Heart Centre',
        badge: 'Certified Discharge Summary',
        badgeColor: 'emerald',
        summary: 'Successful CABG x 3 grafts. Post-op recovery uncomplicated. Severe iodinated contrast allergy documented. Discharged on Atorvastatin 40mg HS, Metoprolol 25mg BD, Aspirin 75mg OD.',
        sourceDoc: 'cmc_vellore_cabg_discharge_p1004.pdf',
        page: 1
      },
      {
        id: 'evt-401',
        date: '18-Jan-2026',
        category: 'Cardiology Outpatient Review',
        type: 'VISIT',
        title: 'Fortis Hospital Post-Op Cardiology Review',
        provider: 'Dr. Sneha Roy (MD Cardiology)',
        clinic: 'Fortis Hospital, Bannerghatta',
        badge: 'Outpatient Follow-up',
        badgeColor: 'emerald',
        summary: 'Asymptomatic. LVEF 52%. Serum Creatinine 1.35 mg/dL, eGFR 58 mL/min (CKD 3a). Continued statin & antiplatelet regimen.',
        sourceDoc: 'fortis_cardio_followup_p1004.pdf',
        page: 1
      },
      {
        id: 'evt-402',
        date: '20-Feb-2026',
        category: 'Pharmacy Dispensing Refill',
        type: 'LAB',
        title: 'MedPlus Koramangala Cardiac Refill',
        provider: 'MedPlus Pharmacy Branch #108',
        clinic: 'MedPlus Koramangala',
        badge: 'Dispensing Ledger Verified',
        badgeColor: 'emerald',
        summary: 'Dispensed Atorvastatin 40mg (90 tabs), Metoprolol Succinate 25mg (90 tabs), Ecosprin 75mg (90 tabs). Pharmacist Lic: KA-PHARM-8821.',
        sourceDoc: 'medplus_cardiac_refill_log_p1004.csv',
        page: 1
      },
      {
        id: 'evt-403',
        date: '12-Apr-2026',
        category: 'Critical Drug-Drug Interaction',
        type: 'CONFLICT',
        title: 'Severe Statin + Fibrate Rhabdomyolysis Conflict',
        provider: 'Dr. N. K. Hegde (MBBS, DNB)',
        clinic: 'PrimeCare Multispecialty Clinic',
        badge: 'Critical Interaction Alert',
        badgeColor: 'rose',
        summary: 'Outside walk-in clinic prescribed Gemfibrozil 600mg BD for high triglycerides without checking prior Atorvastatin 40mg record. Glucuronidation block causes 300% statin elevation and acute skeletal muscle toxicity.',
        sourceDoc: 'primecare_fibrate_conflicting_rx_p1004.pdf',
        page: 1
      },
      {
        id: 'evt-404',
        date: '15-Apr-2026',
        category: 'Urgent Pathology Alert',
        type: 'LAB',
        title: 'Serum Creatine Kinase (CK) Toxic Spike',
        provider: 'Dr. R. K. Anand (MD Biochem)',
        clinic: 'Anand Diagnostic Laboratory',
        badge: 'Toxic Elevation (1,240 U/L)',
        badgeColor: 'rose',
        summary: 'Total Creatine Kinase surged to 1,240 U/L (Reference: 30 - 200 U/L). CareSyncIQ triggered immediate hold order on statin and fibrate, averting acute myoglobinuric kidney failure.',
        sourceDoc: 'anand_labs_ck_elevation_p1004.pdf',
        page: 1
      }
    ],
    labCharts: [
      {
        metric: 'Creatine Kinase (CK-Total, U/L)',
        refMin: 30,
        refMax: 200,
        targetNote: 'Normal: 30 - 200 U/L. Markers > 1,000 U/L indicate acute rhabdomyolysis / statin myopathy.',
        data: [
          { date: 'Sep 2025', value: 110, provider: 'CMC Vellore Lab' },
          { date: 'Jan 2026', value: 145, provider: 'Fortis Hospital Lab' },
          { date: '15-Apr-2026', value: 1240, provider: 'Anand Diagnostic Lab (Spike)' }
        ]
      },
      {
        metric: 'LDL Cholesterol (mg/dL)',
        refMin: 50,
        refMax: 100,
        targetNote: 'Target Post-CABG < 70 mg/dL, Borderline 100-129, High >= 130.',
        data: [
          { date: 'Sep 2025', value: 168, provider: 'CMC Vellore Lab' },
          { date: 'Jan 2026', value: 112, provider: 'Fortis Hospital Lab' },
          { date: 'Apr 2026', value: 94, provider: 'Anand Diagnostic Lab' }
        ]
      }
    ]
  },
  P1005: {
    id: 'P1005',
    name: 'Sunita Rao',
    age: 52,
    gender: 'Female',
    chronicConditions: ["Hashimoto's Autoimmune Thyroiditis (E06.3)", 'Osteopenia & Fracture Risk (M85.8)'],
    criticalAllergies: ['Fluoroquinolones (Ciprofloxacin / Levofloxacin - Tendonitis & Angioedema)'],
    events: [
      {
        id: 'evt-500',
        date: '15-Oct-2025',
        category: 'Endocrinology Outpatient Workup',
        type: 'VISIT',
        title: 'Aster CMI Hashimoto\'s Thyroiditis Diagnosis',
        provider: 'Dr. Alok Verma (MD Endocrinology)',
        clinic: 'Aster CMI Hospital, Hebbal',
        badge: 'Baseline Endocrine Record',
        badgeColor: 'emerald',
        summary: 'Elevated Anti-TPO antibodies > 600 IU/mL. TSH 6.40 mIU/L. Prescribed Levothyroxine 50mcg OD 6:00 AM fasting. Strict Fluoroquinolone allergy recorded.',
        sourceDoc: 'aster_cmi_endocrine_note_p1005.pdf',
        page: 1
      },
      {
        id: 'evt-501',
        date: '10-Feb-2026',
        category: 'Diagnostic Densitometry',
        type: 'LAB',
        title: 'Baseline DEXA Bone Mineral Density Scan',
        provider: 'Dr. Ramesh Babu (MD Radiodiagnosis)',
        clinic: 'Aarthi Scans & Labs, Jayanagar',
        badge: 'Certified Diagnostic Record',
        badgeColor: 'emerald',
        summary: 'Dual-Energy X-ray Absorptiometry (DEXA): Lumbar spine (L1-L4) T-score -2.2, Femoral neck T-score -1.8. Confirms osteopenia. Investigation cost: ₹2,800.',
        sourceDoc: 'aarthi_scans_dexa_baseline_p1005.pdf',
        page: 1
      },
      {
        id: 'evt-502',
        date: '02-Mar-2026',
        category: 'Unnecessary Repeated Radiology Test',
        type: 'DUPLICATE',
        title: 'Repeat DEXA Scan (Care Fragmentation)',
        provider: 'Dr. K. Srinivas (MS Ortho)',
        clinic: 'Manipal Hospital Orthopaedics',
        badge: 'Flagged Duplicate (20d Interval)',
        badgeColor: 'amber',
        summary: 'Repeat DEXA scan ordered just 20 days after prior certified scan at Aarthi Scans due to unshared records. Bone density cannot change in 20 days. Avoidable out-of-pocket waste: ₹2,800.',
        sourceDoc: 'manipal_repeat_dexa_duplicate_p1005.pdf',
        page: 1
      },
      {
        id: 'evt-503',
        date: '24-Mar-2026',
        category: 'Conflicting Drug Administration',
        type: 'CONFLICT',
        title: 'Calcium + Levothyroxine Chelation Conflict',
        provider: 'Dr. Preeti Hegde (Internal Medicine)',
        clinic: 'HealthSpring Clinic, Indiranagar',
        badge: 'Absorption Conflict Intercepted',
        badgeColor: 'rose',
        summary: 'Prescribed Shelcal 500 (Calcium Carbonate + Vit D3) morning simultaneously with Levothyroxine. Chelation binding impairs thyroid hormone absorption. Reconciled to 4-hour interval with lunch.',
        sourceDoc: 'healthspring_calcium_rx_p1005.pdf',
        page: 1
      },
      {
        id: 'evt-504',
        date: '08-Apr-2026',
        category: 'Critical Allergy Conflict Intercepted',
        type: 'ALLERGY_ALERT',
        title: 'Urgent Care Fluoroquinolone Prescription',
        provider: 'Dr. S. Mohan (General Physician)',
        clinic: 'Cloudnine Urgent Care, Old Airport Rd',
        badge: 'Life-Threatening Allergy Conflict',
        badgeColor: 'rose',
        summary: 'Prescribed Ciprofloxacin 500mg BD for urinary infection, directly violating documented Fluoroquinolone tendonitis & angioedema allergy. Intercepted; safely switched to Nitrofurantoin 100mg BD.',
        sourceDoc: 'cloudnine_urgent_care_rx_p1005.png',
        page: 1
      }
    ],
    labCharts: [
      {
        metric: 'Thyroid Stimulating Hormone (TSH, mIU/L)',
        refMin: 0.40,
        refMax: 4.20,
        targetNote: 'Normal Range: 0.40 - 4.20 mIU/L. Higher indicates insufficient thyroid replacement.',
        data: [
          { date: 'Oct 2025', value: 6.40, provider: 'ThyroCare Lab' },
          { date: 'Dec 2025', value: 4.80, provider: 'Aster CMI Hospital' },
          { date: 'Mar 2026', value: 5.90, provider: 'HealthSpring Clinic (Calcium Interference)' },
          { date: 'Apr 2026', value: 3.80, provider: 'Aster CMI Hospital (Reconciled)' }
        ]
      },
      {
        metric: 'DEXA Lumbar Spine BMD (T-score)',
        refMin: -1.0,
        refMax: 1.0,
        targetNote: 'Normal > -1.0, Osteopenia -1.0 to -2.5, Osteoporosis <= -2.5.',
        data: [
          { date: '10-Feb-2026', value: -2.2, provider: 'Aarthi Scans & Labs' },
          { date: '02-Mar-2026', value: -2.1, provider: 'Manipal Hospital (Duplicate)' }
        ]
      }
    ]
  }
};

export default function LongitudinalHealthTimeline({ selectedPatientId = 'P1001', onSelectPatient }) {
  const [activePatientId, setActivePatientId] = useState(selectedPatientId);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [activeChartIdx, setActiveChartIdx] = useState(0);

  const patient = PATIENT_TIMELINE_CATALOG[activePatientId] || PATIENT_TIMELINE_CATALOG.P1001;

  const filteredEvents = patient.events.filter(e => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'SAFETY') return e.type === 'CONFLICT' || e.type === 'ALLERGY_ALERT' || e.type === 'DUPLICATE';
    if (filterCategory === 'LABS') return e.type === 'LAB' || e.type === 'DUPLICATE';
    if (filterCategory === 'VISITS') return e.type === 'VISIT';
    return true;
  });

  const currentChart = patient.labCharts[activeChartIdx] || patient.labCharts[0];

  return (
    <div className="space-y-6">
      {/* Header & Patient Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <HiOutlineTrendingUp className="text-lg" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Longitudinal Health Timeline & Clinical Trajectory</h2>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Chronological multi-provider health record tracking diagnoses, prescriptions, lab trends, and safety events.
          </p>
        </div>

        {/* Patient Tabs */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1.5 border border-slate-200">
          {Object.values(PATIENT_TIMELINE_CATALOG).map(p => (
            <button
              key={p.id}
              onClick={() => {
                setActivePatientId(p.id);
                setActiveChartIdx(0);
                if (onSelectPatient) onSelectPatient(p.id);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activePatientId === p.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.name} ({p.id})
            </button>
          ))}
        </div>
      </div>

      {/* Patient Vital Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient Demographics</span>
          <div className="mt-1 text-base font-extrabold text-slate-900">{patient.name}</div>
          <p className="text-xs text-slate-600 mt-0.5">{patient.age} Yrs • {patient.gender} • UHID: {patient.id}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chronic Conditions</span>
          <div className="mt-1 space-y-0.5">
            {patient.chronicConditions.map((c, i) => (
              <div key={i} className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
            <HiOutlineExclamationCircle /> Critical Allergy Alerts
          </span>
          <div className="mt-1 space-y-0.5">
            {patient.criticalAllergies.map((a, i) => (
              <div key={i} className="text-xs font-bold text-rose-900">
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Biomarker Trend Chart */}
      {currentChart && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Multi-Year Biomarker Trajectory</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{currentChart.metric}</h3>
              <p className="text-xs text-slate-500">{currentChart.targetNote}</p>
            </div>

            {patient.labCharts.length > 1 && (
              <div className="flex gap-2">
                {patient.labCharts.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveChartIdx(idx)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition border ${
                      activeChartIdx === idx
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {ch.metric.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentChart.data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                          <p className="text-xs font-bold text-slate-900">{d.date}</p>
                          <p className="text-sm font-black text-emerald-600 mt-1">{d.value} {currentChart.metric.match(/\((.*?)\)/)?.[1] || ''}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Facility: {d.provider}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceArea y1={currentChart.refMin} y2={currentChart.refMax} fill="#10b981" fillOpacity={0.12} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-6 rounded-sm bg-emerald-200"></span>
              Biological Reference Range Band ({currentChart.refMin} - {currentChart.refMax})
            </span>
            <span>Zero Hallucination Ground Truth</span>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <HiOutlineFilter className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Events:</span>
        </div>
        <div className="flex gap-1.5">
          {['ALL', 'VISITS', 'LABS', 'SAFETY'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:bottom-0 before:top-2 before:left-2.5 before:w-0.5 before:bg-slate-200">
        {filteredEvents.map((evt, idx) => {
          let badgeBorder = 'border-emerald-200 bg-emerald-50 text-emerald-800';
          let dotColor = 'bg-emerald-500';

          if (evt.type === 'DUPLICATE') {
            badgeBorder = 'border-amber-200 bg-amber-50 text-amber-800';
            dotColor = 'bg-amber-500';
          } else if (evt.type === 'CONFLICT' || evt.type === 'ALLERGY_ALERT') {
            badgeBorder = 'border-rose-200 bg-rose-50 text-rose-800';
            dotColor = 'bg-rose-500';
          }

          return (
            <div key={evt.id} className="relative group">
              {/* Dot */}
              <span className={`absolute -left-[19px] top-4 h-3.5 w-3.5 rounded-full border-2 border-white ring-2 ring-slate-100 ${dotColor}`} />

              {/* Event Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-slate-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <HiOutlineCalendar /> {evt.date}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-500">{evt.category}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-1">{evt.title}</h4>
                  </div>
                  <span className={`self-start sm:self-auto rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badgeBorder}`}>
                    {evt.badge}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-700">
                  {evt.summary}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <HiOutlineOfficeBuilding className="text-slate-400" /> {evt.clinic}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600">{evt.provider}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 border border-slate-200 flex items-center gap-1">
                      <HiOutlineDocumentText /> {evt.sourceDoc} (p. {evt.page})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
