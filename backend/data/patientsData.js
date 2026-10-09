/**
 * CareSyncIQ - Synthetic Clinical Dataset
 * 
 * STRICT COMPLIANCE NOTICE:
 * This dataset contains ONLY synthetic, fictional patient records generated
 * specifically for evaluating the hackathon problem statement:
 * "Lost in Transit: Fragmented Medical Records and Repeated Care Across Providers."
 * No real patient health information (PHI) is included.
 */

const SYNTHETIC_PATIENTS = [
  {
    id: 'P1001',
    name: 'Rajesh Sharma',
    age: 58,
    gender: 'Male',
    dob: '1968-04-15',
    bloodGroup: 'B+',
    phone: '+91 98450-XXXXX',
    emergencyContact: {
      name: 'Sunita Sharma (Spouse)',
      relation: 'Spouse',
      phone: '+91 98451-XXXXX'
    },
    chronicConditions: [
      { code: 'E11.9', name: 'Type 2 Diabetes Mellitus', diagnosedYear: 2021, status: 'Active', severity: 'Moderate' },
      { code: 'I10', name: 'Essential Hypertension', diagnosedYear: 2022, status: 'Active', severity: 'Mild' }
    ],
    allergies: [
      {
        substance: 'Penicillin / Amoxicillin',
        reaction: 'Severe Anaphylaxis, angioedema, generalized urticaria',
        severity: 'Life-Threatening',
        recordedDate: '2022-03-10',
        sourceDoc: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
        page: 1
      }
    ],
    activeMedications: [
      {
        drugName: 'Metformin Hydrochloride',
        dose: '500 mg',
        form: 'Tablet',
        frequency: '1 Tab BD (Twice daily after meals)',
        route: 'Oral',
        startDate: '2026-01-10',
        prescribedBy: 'Dr. Arvind Rao (Endocrinologist)',
        clinic: 'Apollo Sugar Clinic',
        sourceDoc: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
        page: 1,
        status: 'Active (Conflicted with City Clinic 850mg Rx)',
        needsReview: true
      },
      {
        drugName: 'Telmisartan',
        dose: '40 mg',
        form: 'Tablet',
        frequency: '1 Tab OD (Once daily morning)',
        route: 'Oral',
        startDate: '2026-01-10',
        prescribedBy: 'Dr. Arvind Rao',
        clinic: 'Apollo Sugar Clinic',
        sourceDoc: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
        page: 1,
        status: 'Active',
        needsReview: false
      },
      {
        drugName: 'Atorvastatin',
        dose: '20 mg',
        form: 'Tablet',
        frequency: '1 Tab HS (At bedtime)',
        route: 'Oral',
        startDate: '2026-01-10',
        prescribedBy: 'Dr. Arvind Rao',
        clinic: 'Apollo Sugar Clinic',
        sourceDoc: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
        page: 1,
        status: 'Active',
        needsReview: false
      }
    ],
    labTrends: [
      { date: '2025-04-10', test: 'HbA1c', value: 8.4, unit: '%', refMin: 4.0, refMax: 5.6, provider: 'Dr. Lal PathLabs', sourceDoc: 'Historical Health Card', page: 1 },
      { date: '2025-10-18', test: 'HbA1c', value: 8.1, unit: '%', refMin: 4.0, refMax: 5.6, provider: 'Metropolis Healthcare', sourceDoc: 'Historical Health Card', page: 1 },
      { date: '2026-03-12', test: 'HbA1c', value: 7.8, unit: '%', refMin: 4.0, refMax: 5.6, provider: 'Dr. Lal PathLabs', sourceDoc: 'dr_lal_pathlabs_lipid_panel_p1001.pdf', page: 1 },
      { date: '2026-03-12', test: 'Fasting Blood Sugar', value: 148, unit: 'mg/dL', refMin: 70, refMax: 99, provider: 'Dr. Lal PathLabs', sourceDoc: 'dr_lal_pathlabs_lipid_panel_p1001.pdf', page: 1 },
      { date: '2026-03-12', test: 'Total Cholesterol', value: 228, unit: 'mg/dL', refMin: 120, refMax: 200, provider: 'Dr. Lal PathLabs', sourceDoc: 'dr_lal_pathlabs_lipid_panel_p1001.pdf', page: 1 },
      { date: '2026-03-12', test: 'Triglycerides', value: 195, unit: 'mg/dL', refMin: 50, refMax: 150, provider: 'Dr. Lal PathLabs', sourceDoc: 'dr_lal_pathlabs_lipid_panel_p1001.pdf', page: 1 },
      { date: '2026-03-12', test: 'HDL Cholesterol', value: 38, unit: 'mg/dL', refMin: 40, refMax: 60, provider: 'Dr. Lal PathLabs', sourceDoc: 'dr_lal_pathlabs_lipid_panel_p1001.pdf', page: 1 },
      { date: '2026-03-12', test: 'LDL Cholesterol', value: 151, unit: 'mg/dL', refMin: 60, refMax: 100, provider: 'Dr. Lal PathLabs', sourceDoc: 'dr_lal_pathlabs_lipid_panel_p1001.pdf', page: 1 },
      { date: '2026-03-12', test: 'Serum Creatinine', value: 1.10, unit: 'mg/dL', refMin: 0.70, refMax: 1.20, provider: 'Dr. Lal PathLabs', sourceDoc: 'dr_lal_pathlabs_lipid_panel_p1001.pdf', page: 1 },
      // DUPLICATE TEST EVENT (16 days later)
      { date: '2026-03-28', test: 'Total Cholesterol', value: 224, unit: 'mg/dL', refMin: 120, refMax: 200, provider: 'Metropolis Healthcare', sourceDoc: 'metropolis_lipid_panel_duplicate_p1001.pdf', page: 1, isDuplicate: true },
      { date: '2026-03-28', test: 'Triglycerides', value: 190, unit: 'mg/dL', refMin: 50, refMax: 150, provider: 'Metropolis Healthcare', sourceDoc: 'metropolis_lipid_panel_duplicate_p1001.pdf', page: 1, isDuplicate: true },
      { date: '2026-03-28', test: 'HDL Cholesterol', value: 39, unit: 'mg/dL', refMin: 40, refMax: 60, provider: 'Metropolis Healthcare', sourceDoc: 'metropolis_lipid_panel_duplicate_p1001.pdf', page: 1, isDuplicate: true },
      { date: '2026-03-28', test: 'LDL Cholesterol', value: 147, unit: 'mg/dL', refMin: 60, refMax: 100, provider: 'Metropolis Healthcare', sourceDoc: 'metropolis_lipid_panel_duplicate_p1001.pdf', page: 1, isDuplicate: true }
    ],
    timelineEvents: [
      {
        id: 'evt-101',
        date: '2026-01-10',
        type: 'CLINICAL_VISIT',
        category: 'Outpatient Consultation',
        title: 'Apollo Sugar Clinic Consultation',
        provider: 'Dr. Arvind Rao (MD, DM Endocrinology)',
        clinic: 'Apollo Sugar Clinic, Jayanagar',
        summary: 'Routine 3-month diabetes follow-up. BP 142/88. Metformin 500mg BD continued. Penicillin allergy recorded.',
        sourceDoc: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
        page: 1,
        verified: true,
        verificationStatus: 'VERIFIED'
      },
      {
        id: 'evt-102',
        date: '2026-03-12',
        type: 'DIAGNOSTIC_LAB',
        category: 'Pathology & Biochemistry',
        title: 'Comprehensive Metabolic & Lipid Panel',
        provider: 'Dr. Lal PathLabs',
        clinic: 'Indiranagar Diagnostic Centre',
        summary: 'HbA1c 7.8% (Elevated), Fasting Glucose 148 mg/dL, Total Cholesterol 228 mg/dL, Triglycerides 195 mg/dL.',
        sourceDoc: 'dr_lal_pathlabs_lipid_panel_p1001.pdf',
        page: 1,
        verified: true,
        verificationStatus: 'VERIFIED'
      },
      {
        id: 'evt-103',
        date: '2026-03-28',
        type: 'DUPLICATE_DIAGNOSTIC',
        category: 'Unnecessary Repeated Lab Test',
        title: 'Repeat Lipid Profile (Uncoordinated Care)',
        provider: 'Metropolis Healthcare',
        clinic: 'Koramangala Diagnostic Hub',
        summary: 'Ordered by Dr. Sneha Roy (Fortis) without visibility into Lal PathLabs test done 16 days prior. Total Cholesterol 224 mg/dL. Wasted cost: ₹1,200.',
        sourceDoc: 'metropolis_lipid_panel_duplicate_p1001.pdf',
        page: 1,
        verified: true,
        verificationStatus: 'FLAGGED_DUPLICATE'
      },
      {
        id: 'evt-104',
        date: '2026-04-05',
        type: 'CONFLICTING_PRESCRIPTION',
        category: 'Prescription Contradiction',
        title: 'City Family Clinic Dose Escalation',
        provider: 'Dr. Vinod Gupta (MBBS, MD)',
        clinic: 'City Family Clinic, HSR Layout',
        summary: 'Prescribed Metformin 850mg BD + Glipizide 10mg without knowing patient is already on Metformin 500mg BD. High hypoglycemia risk.',
        sourceDoc: 'city_family_clinic_conflicting_rx_p1001.pdf',
        page: 1,
        verified: false,
        verificationStatus: 'FLAGGED_CONFLICT'
      },
      {
        id: 'evt-105',
        date: '2026-04-18',
        type: 'ALLERGY_ALERT',
        category: 'Critical Safety Violation',
        title: 'QuickCare Walk-In Urgent Prescription',
        provider: 'Dr. K. N. Murthy (General Physician)',
        clinic: 'QuickCare Urgent Clinic, BTM 2nd Stage',
        summary: 'Prescribed Augmentin 625mg (Amoxicillin) for acute bronchitis, directly violating recorded Penicillin allergy.',
        sourceDoc: 'urgent_care_allergy_conflict_rx_p1001.png',
        page: 1,
        verified: false,
        verificationStatus: 'CRITICAL_ALLERGY_CONFLICT'
      }
    ]
  },
  {
    id: 'P1002',
    name: 'Priya Venkat',
    age: 34,
    gender: 'Female',
    dob: '1992-08-22',
    bloodGroup: 'O+',
    phone: '+91 97410-XXXXX',
    emergencyContact: {
      name: 'R. Venkat (Father)',
      relation: 'Father',
      phone: '+91 97411-XXXXX'
    },
    chronicConditions: [
      { code: 'J45.40', name: 'Moderate Persistent Bronchial Asthma', diagnosedYear: 2022, status: 'Active', severity: 'Moderate' },
      { code: 'E03.9', name: 'Primary Hypothyroidism', diagnosedYear: 2023, status: 'Active', severity: 'Mild' }
    ],
    allergies: [
      {
        substance: 'Aspirin & NSAIDs (Ibuprofen, Naproxen, Diclofenac)',
        reaction: 'Severe Bronchospasm, wheezing, angioedema (AERD Triad)',
        severity: 'Life-Threatening',
        recordedDate: '2023-05-14',
        sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf',
        page: 1
      }
    ],
    activeMedications: [
      {
        drugName: 'Budesonide / Formoterol',
        dose: '160/4.5 mcg',
        form: 'Inhaler (Turbuhaler)',
        frequency: '2 Puffs BD',
        route: 'Inhalation',
        startDate: '2026-02-14',
        prescribedBy: 'Dr. Meera Nambiar (Pulmonologist)',
        clinic: 'Aster CMI Multispecialty Hospital',
        sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf',
        page: 1,
        status: 'Active',
        needsReview: false
      },
      {
        drugName: 'Montelukast',
        dose: '10 mg',
        form: 'Tablet',
        frequency: '1 Tab OD at bedtime (HS)',
        route: 'Oral',
        startDate: '2026-02-14',
        prescribedBy: 'Dr. Meera Nambiar',
        clinic: 'Aster CMI Hospital',
        sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf',
        page: 1,
        status: 'Active',
        needsReview: false
      },
      {
        drugName: 'Levothyroxine Sodium',
        dose: '75 mcg',
        form: 'Tablet',
        frequency: '1 Tab OD morning (Empty stomach)',
        route: 'Oral',
        startDate: '2026-02-14',
        prescribedBy: 'Dr. R. Swaminathan (Endocrinologist)',
        clinic: 'Aster CMI Hospital',
        sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf',
        page: 1,
        status: 'Active (Titrated from 50mcg)',
        needsReview: false
      }
    ],
    labTrends: [
      { date: '2024-06-12', test: 'TSH', value: 4.80, unit: 'mIU/L', refMin: 0.40, refMax: 4.20, provider: 'Care Diagnostic Lab', sourceDoc: 'Care Lab Archive', page: 1 },
      { date: '2025-05-20', test: 'TSH', value: 5.90, unit: 'mIU/L', refMin: 0.40, refMax: 4.20, provider: 'Care Diagnostic Lab', sourceDoc: 'Care Lab Archive', page: 1 },
      { date: '2026-02-12', test: 'TSH', value: 7.82, unit: 'mIU/L', refMin: 0.40, refMax: 4.20, provider: 'Aster CMI Hospital', sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf', page: 1 },
      { date: '2026-02-12', test: 'Free T4 (FT4)', value: 0.88, unit: 'ng/dL', refMin: 0.80, refMax: 1.80, provider: 'Aster CMI Hospital', sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf', page: 1 },
      { date: '2026-02-12', test: 'Absolute Eosinophil Count', value: 620, unit: 'cells/mcL', refMin: 20, refMax: 500, provider: 'Aster CMI Hospital', sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf', page: 1 },
      { date: '2026-02-12', test: 'Serum Total IgE', value: 410, unit: 'IU/mL', refMin: 0, refMax: 100, provider: 'Aster CMI Hospital', sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf', page: 1 }
    ],
    timelineEvents: [
      {
        id: 'evt-201',
        date: '2026-02-12',
        type: 'HOSPITALIZATION',
        category: 'Inpatient Emergency Admission',
        title: 'Aster CMI Acute Asthma Admission',
        provider: 'Dr. Meera Nambiar (MD Pulm)',
        clinic: 'Aster CMI Hospital, Hebbal',
        summary: 'Admitted for acute exacerbation of bronchial asthma. TSH elevated at 7.82 mIU/L, AEC 620. Strict Aspirin/NSAID allergy recorded.',
        sourceDoc: 'aster_cmi_discharge_summary_p1002.pdf',
        page: 1,
        verified: true,
        verificationStatus: 'VERIFIED'
      },
      {
        id: 'evt-202',
        date: '2026-02-16',
        type: 'PHARMACY_DISPENSING',
        category: 'Prescription Refill',
        title: 'Apollo Pharmacy Post-Discharge Dispense',
        provider: 'Apollo Pharmacy Koramangala',
        clinic: 'Apollo Pharmacy #4012',
        summary: 'Dispensed Thyronorm 75mcg (100 tabs), Symbicort 160/4.5 Turbuhaler (1 unit), Montair 10mg (30 tabs). Pharmacist Lic: KA-PHARM-9021.',
        sourceDoc: 'apollo_pharmacy_dispensing_log_p1002.csv',
        page: 1,
        verified: true,
        verificationStatus: 'VERIFIED'
      },
      {
        id: 'evt-203',
        date: '2026-03-20',
        type: 'ALLERGY_ALERT',
        category: 'Life-Threatening Prescribing Conflict',
        title: 'Orthopaedic Clinic NSAID Prescription',
        provider: 'Dr. C. S. Reddy (MS Ortho)',
        clinic: 'Bone & Joint Orthopaedic Clinic, Malleshwaram',
        summary: 'Prescribed Ibuprofen 400mg TDS for ankle sprain, directly contravening recorded Aspirin/NSAID induced asthma allergy.',
        sourceDoc: 'ortho_care_nsaid_allergy_rx_p1002.png',
        page: 1,
        verified: false,
        verificationStatus: 'CRITICAL_ALLERGY_CONFLICT'
      }
    ]
  },
  {
    id: 'P1003',
    name: 'Anita Desai',
    age: 67,
    gender: 'Female',
    dob: '1959-11-04',
    bloodGroup: 'A+',
    phone: '+91 94480-XXXXX',
    emergencyContact: {
      name: 'Vikram Desai (Son)',
      relation: 'Son',
      phone: '+91 94481-XXXXX'
    },
    chronicConditions: [
      { code: 'I48.0', name: 'Non-valvular Atrial Fibrillation', diagnosedYear: 2020, status: 'Active', severity: 'High' },
      { code: 'I10', name: 'Hypertension', diagnosedYear: 2018, status: 'Active', severity: 'Moderate' }
    ],
    allergies: [
      {
        substance: 'Sulfa Drugs (Sulfamethoxazole)',
        reaction: 'Erythematous rash, facial edema',
        severity: 'Moderate',
        recordedDate: '2021-08-19',
        sourceDoc: 'st_johns_cardio_warfarin_interaction_p1003.pdf',
        page: 1
      }
    ],
    activeMedications: [
      {
        drugName: 'Warfarin Sodium',
        dose: '3 mg',
        form: 'Tablet',
        frequency: '1 Tab OD evening',
        route: 'Oral',
        startDate: '2024-03-01',
        prescribedBy: 'Dr. George Thomas (Cardiologist)',
        clinic: 'St. John\'s Medical College Cardiology Centre',
        sourceDoc: 'st_johns_cardio_warfarin_interaction_p1003.pdf',
        page: 1,
        status: 'Temporarily Withheld (INR Spike: 4.80)',
        needsReview: true
      },
      {
        drugName: 'Amlodipine',
        dose: '5 mg',
        form: 'Tablet',
        frequency: '1 Tab OD morning',
        route: 'Oral',
        startDate: '2024-03-01',
        prescribedBy: 'Dr. George Thomas',
        clinic: 'St. John\'s Cardiology Centre',
        sourceDoc: 'st_johns_cardio_warfarin_interaction_p1003.pdf',
        page: 1,
        status: 'Active',
        needsReview: false
      }
    ],
    labTrends: [
      { date: '2025-11-10', test: 'INR', value: 2.20, unit: 'Ratio', refMin: 2.00, refMax: 3.00, provider: 'St. John\'s Lab', sourceDoc: 'Historical Lab Sheet', page: 1 },
      { date: '2026-01-15', test: 'INR', value: 2.50, unit: 'Ratio', refMin: 2.00, refMax: 3.00, provider: 'St. John\'s Lab', sourceDoc: 'Historical Lab Sheet', page: 1 },
      { date: '2026-04-02', test: 'INR', value: 4.80, unit: 'Ratio', refMin: 2.00, refMax: 3.00, provider: 'St. John\'s Emergency Stat Lab', sourceDoc: 'st_johns_cardio_warfarin_interaction_p1003.pdf', page: 1, isCritical: true },
      { date: '2026-04-02', test: 'Prothrombin Time (PT)', value: 44.2, unit: 'seconds', refMin: 11.0, refMax: 13.5, provider: 'St. John\'s Emergency Stat Lab', sourceDoc: 'st_johns_cardio_warfarin_interaction_p1003.pdf', page: 1, isCritical: true }
    ],
    timelineEvents: [
      {
        id: 'evt-301',
        date: '2026-04-02',
        type: 'DRUG_INTERACTION_ALERT',
        category: 'Critical Drug-Drug Interaction',
        title: 'Severe Warfarin + Clarithromycin Interaction',
        provider: 'Dr. George Thomas (MD, DM Cardio)',
        clinic: 'St. John\'s Medical College Hospital',
        summary: 'Walk-in clinic added Clarithromycin 500mg BD for bronchitis while patient on Warfarin. Potent CYP3A4/CYP2C9 inhibition caused INR to surge to 4.80. Lethal hemorrhage risk avoided.',
        sourceDoc: 'st_johns_cardio_warfarin_interaction_p1003.pdf',
        page: 1,
        verified: true,
        verificationStatus: 'CRITICAL_DRUG_INTERACTION'
      }
    ]
  },
  {
    id: 'P1004',
    name: 'Vikram Malhotra',
    age: 46,
    gender: 'Male',
    dob: '1980-06-22',
    bloodGroup: 'O+',
    phone: '+91 97410-XXXXX',
    emergencyContact: {
      name: 'Pooja Malhotra (Spouse)',
      relation: 'Spouse',
      phone: '+91 97411-XXXXX'
    },
    chronicConditions: [
      { code: 'I25.10', name: 'Coronary Artery Disease (Post-CABG x3)', diagnosedYear: 2025, status: 'Active', severity: 'Severe' },
      { code: 'E78.0', name: 'Severe Hypercholesterolemia', diagnosedYear: 2023, status: 'Active', severity: 'High' },
      { code: 'N18.3', name: 'Chronic Kidney Disease Stage 3a (eGFR 58)', diagnosedYear: 2025, status: 'Active', severity: 'Moderate' }
    ],
    allergies: [
      {
        substance: 'Radiocontrast Media (Iodinated Contrast)',
        reaction: 'Severe Anaphylactoid Reaction, bronchospasm, facial edema during coronary angiogram',
        severity: 'Life-Threatening',
        recordedDate: '2025-08-20',
        sourceDoc: 'cmc_vellore_cabg_discharge_p1004.pdf',
        page: 1
      }
    ],
    activeMedications: [
      {
        drugName: 'Atorvastatin IP',
        dose: '40 mg',
        form: 'Tablet',
        frequency: '1 Tab HS (Bedtime)',
        route: 'Oral',
        startDate: '2025-09-08',
        prescribedBy: 'Dr. Vinay Kumar (Cardiothoracic Surgeon)',
        clinic: 'CMC Vellore Heart Centre',
        sourceDoc: 'cmc_vellore_cabg_discharge_p1004.pdf',
        page: 1,
        status: 'Active (Flagged Rhabdomyolysis Conflict with Fibrate)',
        needsReview: true
      },
      {
        drugName: 'Metoprolol Succinate ER',
        dose: '25 mg',
        form: 'Tablet',
        frequency: '1 Tab BD',
        route: 'Oral',
        startDate: '2025-09-08',
        prescribedBy: 'Dr. Vinay Kumar',
        clinic: 'CMC Vellore Heart Centre',
        sourceDoc: 'cmc_vellore_cabg_discharge_p1004.pdf',
        page: 1,
        status: 'Active',
        needsReview: false
      },
      {
        drugName: 'Aspirin (Ecosprin)',
        dose: '75 mg',
        form: 'Tablet',
        frequency: '1 Tab OD post-lunch',
        route: 'Oral',
        startDate: '2025-09-08',
        prescribedBy: 'Dr. Vinay Kumar',
        clinic: 'CMC Vellore Heart Centre',
        sourceDoc: 'cmc_vellore_cabg_discharge_p1004.pdf',
        page: 1,
        status: 'Active',
        needsReview: false
      }
    ],
    labTrends: [
      { date: '2025-09-05', test: 'Total Cholesterol', value: 245, unit: 'mg/dL', refMin: 120, refMax: 200, provider: 'CMC Vellore Lab', sourceDoc: 'cmc_vellore_cabg_discharge_p1004.pdf', page: 1 },
      { date: '2025-09-05', test: 'LDL Cholesterol', value: 168, unit: 'mg/dL', refMin: 60, refMax: 100, provider: 'CMC Vellore Lab', sourceDoc: 'cmc_vellore_cabg_discharge_p1004.pdf', page: 1 },
      { date: '2026-01-18', test: 'Serum Creatinine', value: 1.35, unit: 'mg/dL', refMin: 0.70, refMax: 1.20, provider: 'Fortis Hospital Lab', sourceDoc: 'fortis_cardio_followup_p1004.pdf', page: 1 },
      { date: '2026-04-15', test: 'Creatine Kinase (CK-Total)', value: 1240, unit: 'U/L', refMin: 30, refMax: 200, provider: 'Anand Diagnostic Lab', sourceDoc: 'anand_labs_ck_elevation_p1004.pdf', page: 1, isCritical: true }
    ],
    timelineEvents: [
      {
        id: 'evt-401',
        date: '2026-04-12',
        type: 'DRUG_INTERACTION_ALERT',
        category: 'Critical Drug-Drug Interaction',
        title: 'Severe Statin + Fibrate Rhabdomyolysis Risk',
        provider: 'Dr. N. K. Hegde (MBBS, DNB)',
        clinic: 'PrimeCare Multispecialty Clinic',
        summary: 'Outside clinic prescribed Gemfibrozil 600mg BD for elevated triglycerides without knowing CMC Vellore Atorvastatin 40mg regimen. Glucuronidation block causes 300% statin elevation and severe muscle toxicity (CK 1,240 U/L).',
        sourceDoc: 'primecare_fibrate_conflicting_rx_p1004.pdf',
        page: 1,
        verified: true,
        verificationStatus: 'CRITICAL_DRUG_INTERACTION'
      }
    ]
  },
  {
    id: 'P1005',
    name: 'Sunita Rao',
    age: 52,
    gender: 'Female',
    dob: '1974-03-12',
    bloodGroup: 'B+',
    phone: '+91 99000-XXXXX',
    emergencyContact: {
      name: 'Ramesh Rao (Spouse)',
      relation: 'Spouse',
      phone: '+91 99001-XXXXX'
    },
    chronicConditions: [
      { code: 'E06.3', name: 'Hashimoto Autoimmune Thyroiditis', diagnosedYear: 2023, status: 'Active', severity: 'Moderate' },
      { code: 'M85.8', name: 'Osteopenia / Osteoporosis Risk (T-score -2.2)', diagnosedYear: 2026, status: 'Active', severity: 'Moderate' }
    ],
    allergies: [
      {
        substance: 'Fluoroquinolones (Ciprofloxacin / Levofloxacin)',
        reaction: 'Acute Achilles Tendonitis and Bilateral Facial Angioedema',
        severity: 'Life-Threatening',
        recordedDate: '2024-05-14',
        sourceDoc: 'aster_cmi_endocrine_note_p1005.pdf',
        page: 1
      }
    ],
    activeMedications: [
      {
        drugName: 'Levothyroxine Sodium (Thyronorm)',
        dose: '50 mcg',
        form: 'Tablet',
        frequency: '1 Tab OD 6:00 AM empty stomach',
        route: 'Oral',
        startDate: '2025-10-15',
        prescribedBy: 'Dr. Alok Verma (Endocrinologist)',
        clinic: 'Aster CMI Hospital',
        sourceDoc: 'aster_cmi_endocrine_note_p1005.pdf',
        page: 1,
        status: 'Active (Chelation Binding Conflict with Calcium)',
        needsReview: true
      },
      {
        drugName: 'Shelcal 500 (Calcium Carbonate + Vit D3)',
        dose: '500 mg / 250 IU',
        form: 'Tablet',
        frequency: '1 Tab OD with lunch (2:00 PM)',
        route: 'Oral',
        startDate: '2026-03-24',
        prescribedBy: 'Dr. Preeti Hegde (Internal Medicine)',
        clinic: 'HealthSpring Clinic, Indiranagar',
        sourceDoc: 'healthspring_calcium_rx_p1005.pdf',
        page: 1,
        status: 'Active (Reconciled with 4-hour spacing)',
        needsReview: false
      }
    ],
    labTrends: [
      { date: '2025-10-15', test: 'TSH', value: 6.40, unit: 'mIU/L', refMin: 0.40, refMax: 4.20, provider: 'ThyroCare Lab', sourceDoc: 'aster_cmi_endocrine_note_p1005.pdf', page: 1 },
      { date: '2026-02-10', test: 'DEXA Bone Mineral Density (Lumbar Spine T-score)', value: -2.2, unit: 'T-score', refMin: -1.0, refMax: 2.0, provider: 'Aarthi Scans & Labs Jayanagar', sourceDoc: 'aarthi_scans_dexa_baseline_p1005.pdf', page: 1 },
      // DUPLICATE DEXA SCAN (20 days later)
      { date: '2026-03-02', test: 'DEXA Bone Mineral Density (Lumbar Spine T-score)', value: -2.1, unit: 'T-score', refMin: -1.0, refMax: 2.0, provider: 'Manipal Hospital Radiology', sourceDoc: 'manipal_repeat_dexa_duplicate_p1005.pdf', page: 1, isDuplicate: true }
    ],
    timelineEvents: [
      {
        id: 'evt-501',
        date: '2026-03-02',
        type: 'DUPLICATE_TEST_ALERT',
        category: 'Unnecessary Repeated Radiology Test',
        title: 'Repeat DEXA Bone Densitometry Scan (20d Interval)',
        provider: 'Dr. K. Srinivas (MS Ortho)',
        clinic: 'Manipal Hospital Orthopaedics',
        summary: 'Repeat DEXA scan ordered 20 days after prior certified scan at Aarthi Scans & Labs. Bone density does not change in 20 days. Avoidable out-of-pocket waste: ₹2,800.',
        sourceDoc: 'manipal_repeat_dexa_duplicate_p1005.pdf',
        page: 1,
        verified: true,
        verificationStatus: 'DUPLICATE_FLAGGED'
      }
    ]
  }
];

// Document metadata catalog
const SYNTHETIC_SOURCE_DOCUMENTS = [
  {
    id: 'doc_lal_pathlabs',
    filename: 'dr_lal_pathlabs_lipid_panel_p1001.pdf',
    originalName: 'dr_lal_pathlabs_lipid_panel_p1001.pdf',
    patientId: 'P1001',
    patientName: 'Rajesh Sharma',
    documentType: 'Clinical Pathology Report',
    facility: 'Dr. Lal PathLabs, Indiranagar',
    date: '2026-03-12',
    pageCount: 1,
    processingMethod: 'Digital Text Extraction',
    ocrConfidence: 0.99,
    status: 'Verified',
    verificationId: 'CSIQ-LAL-9910-VERIFIED'
  },
  {
    id: 'doc_metropolis_dup',
    filename: 'metropolis_lipid_panel_duplicate_p1001.pdf',
    originalName: 'metropolis_lipid_panel_duplicate_p1001.pdf',
    patientId: 'P1001',
    patientName: 'Rajesh Sharma',
    documentType: 'Duplicate Pathology Report',
    facility: 'Metropolis Healthcare Ltd, Koramangala',
    date: '2026-03-28',
    pageCount: 1,
    processingMethod: 'Digital Text Extraction',
    ocrConfidence: 0.99,
    status: 'Flagged Duplicate (16d interval)',
    verificationId: 'CSIQ-METRO-9911-DUPLICATE'
  },
  {
    id: 'doc_apollo_rx',
    filename: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
    originalName: 'apollo_sugar_prescription_dr_rao_p1001.pdf',
    patientId: 'P1001',
    patientName: 'Rajesh Sharma',
    documentType: 'Endocrine Specialist Outpatient Rx',
    facility: 'Apollo Sugar Clinic, Jayanagar',
    date: '2026-01-10',
    pageCount: 1,
    processingMethod: 'Digital Text Extraction',
    ocrConfidence: 0.98,
    status: 'Verified',
    verificationId: 'CSIQ-APOLLO-9912-VERIFIED'
  },
  {
    id: 'doc_city_rx',
    filename: 'city_family_clinic_conflicting_rx_p1001.pdf',
    originalName: 'city_family_clinic_conflicting_rx_p1001.pdf',
    patientId: 'P1001',
    patientName: 'Rajesh Sharma',
    documentType: 'General Practitioner Rx',
    facility: 'City Family Clinic, HSR Layout',
    date: '2026-04-05',
    pageCount: 1,
    processingMethod: 'Digital Text Extraction',
    ocrConfidence: 0.97,
    status: 'Flagged Conflict',
    verificationId: 'CSIQ-CITY-9913-CONFLICT'
  },
  {
    id: 'doc_urgent_scan',
    filename: 'urgent_care_allergy_conflict_rx_p1001.png',
    originalName: 'urgent_care_allergy_conflict_rx_p1001.png',
    patientId: 'P1001',
    patientName: 'Rajesh Sharma',
    documentType: 'Scanned Phone Photo Prescription',
    facility: 'QuickCare Walk-In Urgent Clinic',
    date: '2026-04-18',
    pageCount: 1,
    processingMethod: 'Preprocessed Tesseract OCR',
    ocrConfidence: 0.84,
    status: 'Needs Review (Allergy Conflict)',
    verificationId: 'CSIQ-URGENT-9914-REVIEW'
  },
  {
    id: 'doc_aster_discharge',
    filename: 'aster_cmi_discharge_summary_p1002.pdf',
    originalName: 'aster_cmi_discharge_summary_p1002.pdf',
    patientId: 'P1002',
    patientName: 'Priya Venkat',
    documentType: 'Inpatient Hospital Discharge Summary',
    facility: 'Aster CMI Hospital, Hebbal',
    date: '2026-02-14',
    pageCount: 1,
    processingMethod: 'Digital Text Extraction',
    ocrConfidence: 0.99,
    status: 'Verified',
    verificationId: 'CSIQ-ASTER-9915-VERIFIED'
  },
  {
    id: 'doc_ortho_scan',
    filename: 'ortho_care_nsaid_allergy_rx_p1002.png',
    originalName: 'ortho_care_nsaid_allergy_rx_p1002.png',
    patientId: 'P1002',
    patientName: 'Priya Venkat',
    documentType: 'Scanned Orthopaedic Rx',
    facility: 'Bone & Joint Ortho Clinic, Malleshwaram',
    date: '2026-03-20',
    pageCount: 1,
    processingMethod: 'Preprocessed Tesseract OCR',
    ocrConfidence: 0.81,
    status: 'Needs Review (NSAID Allergy Conflict)',
    verificationId: 'CSIQ-ORTHO-9916-REVIEW'
  },
  {
    id: 'doc_apollo_pharmacy',
    filename: 'apollo_pharmacy_dispensing_log_p1002.csv',
    originalName: 'apollo_pharmacy_dispensing_log_p1002.csv',
    patientId: 'P1002',
    patientName: 'Priya Venkat',
    documentType: 'Pharmacy Dispensing Spreadsheet',
    facility: 'Apollo Pharmacy Koramangala',
    date: '2026-03-22',
    pageCount: 1,
    processingMethod: 'Tabular CSV Ingestion',
    ocrConfidence: 1.0,
    status: 'Verified',
    verificationId: 'CSIQ-PHARM-9917-VERIFIED'
  },
  {
    id: 'doc_st_johns_cardio',
    filename: 'st_johns_cardio_warfarin_interaction_p1003.pdf',
    originalName: 'st_johns_cardio_warfarin_interaction_p1003.pdf',
    patientId: 'P1003',
    patientName: 'Anita Desai',
    documentType: 'Cardiology Specialist Clinical Record',
    facility: 'St. John\'s Medical College Hospital',
    date: '2026-04-02',
    pageCount: 1,
    processingMethod: 'Digital Text Extraction',
    ocrConfidence: 0.99,
    status: 'Verified',
    verificationId: 'CSIQ-STJOHNS-9918-VERIFIED'
  },
  {
    id: 'doc_cmc_vellore',
    filename: 'cmc_vellore_cabg_discharge_p1004.pdf',
    originalName: 'cmc_vellore_cabg_discharge_p1004.pdf',
    patientId: 'P1004',
    patientName: 'Vikram Malhotra',
    documentType: 'Cardiothoracic Surgery Discharge Summary',
    facility: 'CMC Vellore Heart Centre',
    date: '2025-09-08',
    pageCount: 1,
    processingMethod: 'Digital Text Extraction',
    ocrConfidence: 0.99,
    status: 'Verified',
    verificationId: 'CSIQ-CMC-9919-VERIFIED'
  },
  {
    id: 'doc_aarthi_dexa',
    filename: 'aarthi_scans_dexa_baseline_p1005.pdf',
    originalName: 'aarthi_scans_dexa_baseline_p1005.pdf',
    patientId: 'P1005',
    patientName: 'Sunita Rao',
    documentType: 'Bone Mineral Densitometry Report',
    facility: 'Aarthi Scans & Labs Jayanagar',
    date: '2026-02-10',
    pageCount: 1,
    processingMethod: 'Digital Text Extraction',
    ocrConfidence: 0.99,
    status: 'Verified',
    verificationId: 'CSIQ-AARTHI-9920-VERIFIED'
  }
];

module.exports = {
  SYNTHETIC_PATIENTS,
  SYNTHETIC_SOURCE_DOCUMENTS
};
