import os
import csv
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "sample_documents"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

def build_pdf_document(filepath, elements):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    doc.build(elements)
    print(f"Generated PDF: {filepath}")

# Styles
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=18,
    textColor=colors.HexColor('#065f46')
)
subtitle_style = ParagraphStyle(
    'DocSubTitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=12,
    textColor=colors.HexColor('#475569')
)
header_cell = ParagraphStyle(
    'HeaderCell',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=colors.HexColor('#0f172a')
)
body_cell = ParagraphStyle(
    'BodyCell',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=10,
    textColor=colors.HexColor('#1e293b')
)
alert_cell = ParagraphStyle(
    'AlertCell',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=colors.HexColor('#dc2626')
)
disclaimer_style = ParagraphStyle(
    'Disclaimer',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=7,
    leading=9,
    textColor=colors.HexColor('#64748b')
)

# -------------------------------------------------------------
# DOC 1: Dr. Lal PathLabs - Lipid Profile & HbA1c (Rajesh Sharma)
# -------------------------------------------------------------
def make_doc1():
    path = os.path.join(OUTPUT_DIR, "dr_lal_pathlabs_lipid_panel_p1001.pdf")
    elements = []
    
    elements.append(Paragraph("DR. LAL PATHLABS CLINICAL PATHOLOGY DIVISION", title_style))
    elements.append(Paragraph("Branch: Indiranagar Diagnostic Centre, 100ft Road, Bengaluru 560038 | NABL Accredited | SYNTHETIC DEMO DATA", subtitle_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#10b981'), spaceAfter=8))
    
    demo_data = [
        [Paragraph("<b>Patient Name:</b> Rajesh Sharma", body_cell), Paragraph("<b>UHID / Patient ID:</b> P1001", body_cell)],
        [Paragraph("<b>Age / Gender:</b> 58 Yrs / Male", body_cell), Paragraph("<b>Sample Collection:</b> 12-Mar-2026 07:45 AM", body_cell)],
        [Paragraph("<b>Referring Doctor:</b> Dr. Arvind Rao (MD, DM Endocrinology)", body_cell), Paragraph("<b>Report Status:</b> Final Certified", body_cell)],
    ]
    t_demo = Table(demo_data, colWidths=[270, 270])
    t_demo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_demo)
    elements.append(Spacer(1, 12))
    
    elements.append(Paragraph("<b>DEPARTMENT OF BIOCHEMISTRY & ENDOCRINE ASSAYS</b>", header_cell))
    elements.append(Spacer(1, 4))
    
    lab_data = [
        [Paragraph("Test Description", header_cell), Paragraph("Observed Value", header_cell), Paragraph("Units", header_cell), Paragraph("Biological Reference Range", header_cell), Paragraph("Flag", header_cell)],
        [Paragraph("Fasting Blood Sugar (Glucose, Fasting)", body_cell), Paragraph("148.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("70.0 - 99.0", body_cell), Paragraph("HIGH", alert_cell)],
        [Paragraph("HbA1c (Glycated Hemoglobin)", body_cell), Paragraph("7.8", alert_cell), Paragraph("%", body_cell), Paragraph("< 5.7 (Normal), 5.7-6.4 (Prediabetes)", body_cell), Paragraph("HIGH", alert_cell)],
        [Paragraph("Estimated Average Glucose (eAG)", body_cell), Paragraph("177.0", body_cell), Paragraph("mg/dL", body_cell), Paragraph("90.0 - 120.0", body_cell), Paragraph("ELEVATED", alert_cell)],
        [Paragraph("Total Cholesterol", body_cell), Paragraph("228.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("< 200.0", body_cell), Paragraph("HIGH", alert_cell)],
        [Paragraph("Triglycerides", body_cell), Paragraph("195.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("< 150.0", body_cell), Paragraph("HIGH", alert_cell)],
        [Paragraph("HDL Cholesterol", body_cell), Paragraph("38.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("> 40.0 (Male)", body_cell), Paragraph("LOW", alert_cell)],
        [Paragraph("LDL Cholesterol (Calculated)", body_cell), Paragraph("151.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("< 100.0", body_cell), Paragraph("HIGH", alert_cell)],
        [Paragraph("VLDL Cholesterol", body_cell), Paragraph("39.0", body_cell), Paragraph("mg/dL", body_cell), Paragraph("< 30.0", body_cell), Paragraph("HIGH", alert_cell)],
        [Paragraph("Serum Creatinine", body_cell), Paragraph("1.10", body_cell), Paragraph("mg/dL", body_cell), Paragraph("0.70 - 1.20", body_cell), Paragraph("NORMAL", body_cell)],
        [Paragraph("eGFR (CKD-EPI)", body_cell), Paragraph("74.0", body_cell), Paragraph("mL/min/1.73m²", body_cell), Paragraph("> 60.0", body_cell), Paragraph("NORMAL", body_cell)],
    ]
    t_lab = Table(lab_data, colWidths=[160, 80, 70, 160, 70])
    t_lab.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e6f4ea')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_lab)
    elements.append(Spacer(1, 14))
    
    elements.append(Paragraph("<b>Pathologist Sign-off:</b> Dr. K. Radhakrishnan, MD (Pathology), Reg #KMC-41289. Electronically signed at 12-Mar-2026 14:30:15.", body_cell))
    elements.append(Paragraph("DISCLAIMER: Certified synthetic diagnostic record for hackathon evaluation. Not real patient data.", disclaimer_style))
    build_pdf_document(path, elements)

# ---------------------------------------------------------------------------------
# DOC 2: Metropolis Healthcare - DUPLICATE Lipid Panel 16 days later (Rajesh Sharma)
# -------------------------------------------------------------
def make_doc2():
    path = os.path.join(OUTPUT_DIR, "metropolis_lipid_panel_duplicate_p1001.pdf")
    elements = []
    
    elements.append(Paragraph("METROPOLIS HEALTHCARE PATHOLOGY NETWORK", title_style))
    elements.append(Paragraph("Koramangala Diagnostic Hub, 80ft Road, Bengaluru | CAP & NABL Accredited | SYNTHETIC DEMO DATA", subtitle_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284c7'), spaceAfter=8))
    
    demo_data = [
        [Paragraph("<b>Patient Name:</b> Rajesh Sharma", body_cell), Paragraph("<b>Patient ID / MRN:</b> P1001", body_cell)],
        [Paragraph("<b>Age / Gender:</b> 58 Yrs / Male", body_cell), Paragraph("<b>Collection Date:</b> 28-Mar-2026 08:15 AM", alert_cell)],
        [Paragraph("<b>Referring Physician:</b> Dr. Sneha Roy (MD Cardiology, Fortis Care)", body_cell), Paragraph("<b>Test Scope:</b> Repeat Comprehensive Lipid Profile", alert_cell)],
    ]
    t_demo = Table(demo_data, colWidths=[270, 270])
    t_demo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_demo)
    elements.append(Spacer(1, 10))
    
    elements.append(Paragraph("<b>CLINICAL BIOCHEMISTRY - LIPID FRACTIONATION</b>", header_cell))
    elements.append(Spacer(1, 4))
    
    lab_data = [
        [Paragraph("Investigation", header_cell), Paragraph("Result", header_cell), Paragraph("Units", header_cell), Paragraph("Biological Reference Interval", header_cell), Paragraph("Interpretation", header_cell)],
        [Paragraph("Total Cholesterol", body_cell), Paragraph("224.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("< 200.0", body_cell), Paragraph("Borderline High", alert_cell)],
        [Paragraph("Serum Triglycerides", body_cell), Paragraph("190.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("< 150.0", body_cell), Paragraph("High", alert_cell)],
        [Paragraph("HDL Cholesterol", body_cell), Paragraph("39.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("> 40.0", body_cell), Paragraph("Sub-optimal", alert_cell)],
        [Paragraph("LDL Cholesterol (Direct)", body_cell), Paragraph("147.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("< 100.0", body_cell), Paragraph("Elevated", alert_cell)],
        [Paragraph("Non-HDL Cholesterol", body_cell), Paragraph("185.0", alert_cell), Paragraph("mg/dL", body_cell), Paragraph("< 130.0", body_cell), Paragraph("Elevated", alert_cell)],
    ]
    t_lab = Table(lab_data, colWidths=[160, 80, 70, 160, 70])
    t_lab.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e0f2fe')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_lab)
    elements.append(Spacer(1, 14))
    
    elements.append(Paragraph("<b>CLINICAL NOTE:</b> Ordered without prior record linkage. Correlate with recent clinical history.", ParagraphStyle('Note', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#b45309'))))
    elements.append(Paragraph("<b>Supervising Biochemist:</b> Dr. S. Ananth, MD (Biochemistry). Date: 28-Mar-2026 15:10.", body_cell))
    elements.append(Paragraph("SYNTHETIC DEMO DATASET - Intentional duplication test case within 16-day interval.", disclaimer_style))
    build_pdf_document(path, elements)

# ---------------------------------------------------------------------------------
# DOC 3: Apollo Sugar Clinic Prescription (Rajesh Sharma)
# ---------------------------------------------------------------------------------
def make_doc3():
    path = os.path.join(OUTPUT_DIR, "apollo_sugar_prescription_dr_rao_p1001.pdf")
    elements = []
    
    elements.append(Paragraph("APOLLO SUGAR CLINIC & DIABETES SPECIALTY CENTRE", title_style))
    elements.append(Paragraph("14th Main, 4th Block, Jayanagar, Bengaluru 560011 | Tel: 080-26598811 | SYNTHETIC DEMO DATA", subtitle_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#059669'), spaceAfter=8))
    
    demo_data = [
        [Paragraph("<b>Patient Name:</b> Rajesh Sharma", body_cell), Paragraph("<b>UHID:</b> P1001", body_cell)],
        [Paragraph("<b>Age / Gender:</b> 58 Yrs / M", body_cell), Paragraph("<b>Consult Date:</b> 10-Jan-2026", body_cell)],
        [Paragraph("<b>Vitals:</b> BP 142/88 mmHg, Pulse 76, BMI 27.8 kg/m²", body_cell), Paragraph("<b>Known Allergies:</b> <font color='#dc2626'><b>PENICILLIN (ANAPHYLAXIS)</b></font>", alert_cell)],
        [Paragraph("<b>Primary Diagnoses:</b> Type 2 Diabetes Mellitus (E11.9), Essential Hypertension (I10)", body_cell), Paragraph("<b>Doctor:</b> Dr. Arvind Rao (MD, DM Endo, KMC #38192)", body_cell)]
    ]
    t_demo = Table(demo_data, colWidths=[270, 270])
    t_demo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_demo)
    elements.append(Spacer(1, 10))
    
    elements.append(Paragraph("<b>OUTPATIENT PRESCRIPTION (Rx)</b>", header_cell))
    elements.append(Spacer(1, 4))
    
    rx_data = [
        [Paragraph("#", header_cell), Paragraph("Medication Name & Formulation", header_cell), Paragraph("Dosage", header_cell), Paragraph("Frequency / Timing", header_cell), Paragraph("Duration", header_cell), Paragraph("Clinical Purpose", header_cell)],
        [Paragraph("1", body_cell), Paragraph("Tab. Metformin Hydrochloride IP", body_cell), Paragraph("500 mg", body_cell), Paragraph("1 Tab Twice Daily (BD) after food", body_cell), Paragraph("90 Days", body_cell), Paragraph("Glycemic control (Biguanide)", body_cell)],
        [Paragraph("2", body_cell), Paragraph("Tab. Telmisartan IP", body_cell), Paragraph("40 mg", body_cell), Paragraph("1 Tab Once Daily (OD) morning", body_cell), Paragraph("90 Days", body_cell), Paragraph("Hypertension (ARB)", body_cell)],
        [Paragraph("3", body_cell), Paragraph("Tab. Atorvastatin IP", body_cell), Paragraph("20 mg", body_cell), Paragraph("1 Tab Once Daily (HS) at bedtime", body_cell), Paragraph("90 Days", body_cell), Paragraph("Dyslipidemia & CV risk reduction", body_cell)],
    ]
    t_rx = Table(rx_data, colWidths=[20, 160, 60, 150, 60, 90])
    t_rx.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#d1fae5')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_rx)
    elements.append(Spacer(1, 12))
    
    elements.append(Paragraph("<b>ADVICE / LIFESTYLE INSTRUCTIONS:</b>", header_cell))
    elements.append(Paragraph("• Diabetic diet: Low glycemic index, avoid refined sugars, salt restriction (< 5g/day).<br/>• Self-monitoring of blood glucose (SMBG) weekly.<br/>• Repeat HbA1c, Fasting Blood Sugar, and Lipid Profile in 3 months (Due April 2026).<br/>• <b>ALLERGY WARNING RECORDED: Strictly avoid Penicillins, Ampicillin, Amoxicillin.</b>", body_cell))
    elements.append(Spacer(1, 14))
    elements.append(Paragraph("Dr. Arvind Rao, Senior Consultant Endocrinologist | Digital Verification Signature: AR-APOLLO-99120", body_cell))
    elements.append(Paragraph("SYNTHETIC DEMO RECORD - Created for CareSyncIQ hackathon evaluation.", disclaimer_style))
    build_pdf_document(path, elements)

# ---------------------------------------------------------------------------------
# DOC 4: City Family Clinic - Conflicting Rx (Rajesh Sharma)
# ---------------------------------------------------------------------------------
def make_doc4():
    path = os.path.join(OUTPUT_DIR, "city_family_clinic_conflicting_rx_p1001.pdf")
    elements = []
    
    elements.append(Paragraph("CITY FAMILY HEALTH CLINIC", title_style))
    elements.append(Paragraph("Sector 2, HSR Layout, Bengaluru 560102 | Tel: 080-41123300 | SYNTHETIC DEMO DATA", subtitle_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#ea580c'), spaceAfter=8))
    
    demo_data = [
        [Paragraph("<b>Patient:</b> Rajesh Sharma (Male / 58 Yrs)", body_cell), Paragraph("<b>Patient ID:</b> P1001", body_cell)],
        [Paragraph("<b>Visit Date:</b> 05-Apr-2026", body_cell), Paragraph("<b>Consulting Doctor:</b> Dr. Vinod Gupta (MBBS, MD)", body_cell)],
        [Paragraph("<b>Chief Complaint:</b> Persistent fatigue, post-prandial heaviness", body_cell), Paragraph("<b>Assessment:</b> Uncontrolled Type 2 Diabetes", body_cell)],
    ]
    t_demo = Table(demo_data, colWidths=[270, 270])
    t_demo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fff7ed')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#fdba74')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fed7aa')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_demo)
    elements.append(Spacer(1, 10))
    
    elements.append(Paragraph("<b>CLINICAL PRESCRIPTION - TREATMENT ESCALATION</b>", header_cell))
    elements.append(Spacer(1, 4))
    
    rx_data = [
        [Paragraph("#", header_cell), Paragraph("Prescribed Drug", header_cell), Paragraph("Dose", header_cell), Paragraph("Instructions", header_cell), Paragraph("Potential Conflict / Concern", header_cell)],
        [Paragraph("1", body_cell), Paragraph("Tab. Glipizide (Minidiab)", body_cell), Paragraph("10 mg", body_cell), Paragraph("1 Tab OD before breakfast", body_cell), Paragraph("<font color='#dc2626'>High Hypoglycemia Risk</font>", alert_cell)],
        [Paragraph("2", body_cell), Paragraph("Tab. Metformin Extended Release", body_cell), Paragraph("850 mg", alert_cell), Paragraph("1 Tab BD after meals", body_cell), Paragraph("<font color='#dc2626'>Conflicting Dose with Apollo 500mg BD</font>", alert_cell)],
    ]
    t_rx = Table(rx_data, colWidths=[20, 160, 60, 150, 150])
    t_rx.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffedd5')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#f97316')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fed7aa')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_rx)
    elements.append(Spacer(1, 12))
    
    elements.append(Paragraph("<b>DOCTOR NOTE:</b> Patient did not present past prescription. Dose escalated empirically.", ParagraphStyle('Warn', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#c2410c'))))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph("Dr. Vinod Gupta, Consultant Physician | KMC Reg #58921 | Date: 05-Apr-2026", body_cell))
    elements.append(Paragraph("SYNTHETIC DEMO RECORD - Intentional conflicting prescription pair.", disclaimer_style))
    build_pdf_document(path, elements)

# ---------------------------------------------------------------------------------
# DOC 5: Urgent Care Clinic - Scanned Phone Photo (Allergy Conflict: Amoxicillin)
# ---------------------------------------------------------------------------------
def make_doc5():
    path = os.path.join(OUTPUT_DIR, "urgent_care_allergy_conflict_rx_p1001.png")
    # Create an image mimicking a phone snapshot of a handwritten/printed prescription slip
    img = Image.new('RGB', (1000, 1300), color=(250, 248, 243))
    draw = ImageDraw.Draw(img)
    
    # Header
    draw.rectangle([30, 30, 970, 160], fill=(235, 245, 238), outline=(50, 140, 90), width=2)
    draw.text((60, 50), "QUICKCARE URGENT & GENERAL CLINIC", fill=(20, 80, 50))
    draw.text((60, 85), "Emergency Walk-in Center, BTM 2nd Stage, Bangalore", fill=(60, 70, 70))
    draw.text((60, 115), "Dr. K. N. Murthy, MBBS - General Physician - Reg #KMC-29401", fill=(80, 80, 80))
    
    # Patient Info
    draw.line([30, 180, 970, 180], fill=(180, 180, 180), width=2)
    draw.text((50, 200), "Date: 18-Apr-2026               Patient: Rajesh Sharma               Age: 58 / M", fill=(20, 20, 20))
    draw.text((50, 230), "UHID: P1001                      Contact: 98450-XXXXX", fill=(60, 60, 60))
    draw.text((50, 260), "Clinical Complaint: Severe cough, fever 101F, yellowish sputum x 3 days", fill=(40, 40, 40))
    draw.text((50, 290), "Clinical Impression: Acute Bacterial Bronchitis / Chest Infection", fill=(40, 40, 40))
    draw.line([30, 330, 970, 330], fill=(180, 180, 180), width=2)
    
    # Prescription Symbol & Drugs
    draw.text((60, 360), "Rx", fill=(10, 40, 120))
    draw.text((80, 410), "1. Tab. Augmentin 625 mg (Amoxicillin 500mg + Clavulanic Acid 125mg)", fill=(20, 20, 20))
    draw.text((120, 445), "-> 1 Tablet Twice Daily (BD) after meals x 5 days", fill=(60, 60, 60))
    draw.text((120, 475), "[CRITICAL CONTRAINDICATION: ALLERGIC TO PENICILLIN]", fill=(200, 20, 20))
    
    draw.text((80, 530), "2. Tab. Paracetamol 650 mg", fill=(20, 20, 20))
    draw.text((120, 565), "-> 1 Tablet SOS for fever > 100F", fill=(60, 60, 60))
    
    draw.text((80, 620), "3. Syr. Ascoril D (Cough Expectorant)", fill=(20, 20, 20))
    draw.text((120, 655), "-> 10 ml TDS x 5 days", fill=(60, 60, 60))
    
    # Footer and Signature
    draw.line([30, 850, 970, 850], fill=(180, 180, 180), width=1)
    draw.text((50, 880), "Instructions: Drink warm fluids. Steam inhalation BD.", fill=(80, 80, 80))
    draw.text((650, 950), "Dr. K. N. Murthy", fill=(20, 20, 20))
    draw.text((650, 980), "MBBS (KMC 29401)", fill=(60, 60, 60))
    
    draw.text((50, 1220), "SYNTHETIC DEMO DATA - Intended allergy-versus-prescription conflict testing.", fill=(120, 120, 120))
    
    # Add slight realistic rotation / compression simulation
    img = img.rotate(0.5, resample=Image.BICUBIC, fillcolor=(240, 238, 233))
    img.save(path, "PNG")
    print(f"Generated Simulated Image: {path}")

# ---------------------------------------------------------------------------------
# DOC 6: Aster CMI Hospital Discharge Summary (Priya Venkat)
# ---------------------------------------------------------------------------------
def make_doc6():
    path = os.path.join(OUTPUT_DIR, "aster_cmi_discharge_summary_p1002.pdf")
    elements = []
    
    elements.append(Paragraph("ASTER CMI MULTISPECIALTY HOSPITAL", title_style))
    elements.append(Paragraph("New Airport Road, NH 44, Hebbal, Bengaluru 560092 | Joint Commission International (JCI) Accredited | SYNTHETIC DEMO DATA", subtitle_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#047857'), spaceAfter=8))
    
    demo_data = [
        [Paragraph("<b>Patient Name:</b> Priya Venkat", body_cell), Paragraph("<b>UHID / IP No:</b> P1002 / IP-2026-904", body_cell)],
        [Paragraph("<b>Age / Gender:</b> 34 Yrs / Female", body_cell), Paragraph("<b>Admission Date:</b> 12-Feb-2026 | <b>Discharge:</b> 14-Feb-2026", body_cell)],
        [Paragraph("<b>Primary Consultant:</b> Dr. Meera Nambiar (MD Pulm)", body_cell), Paragraph("<b>Allergies:</b> <font color='#dc2626'><b>ASPIRIN & NSAIDs (BRONCHOSPASM)</b></font>", alert_cell)],
    ]
    t_demo = Table(demo_data, colWidths=[270, 270])
    t_demo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_demo)
    elements.append(Spacer(1, 10))
    
    elements.append(Paragraph("<b>DISCHARGE CLINICAL SUMMARY & DIAGNOSES</b>", header_cell))
    elements.append(Paragraph("1. Acute Exacerbation of Bronchial Asthma (Moderate Persistent, ICD-10: J45.40)<br/>2. Primary Hypothyroidism (E03.9) on hormone replacement therapy", body_cell))
    elements.append(Spacer(1, 8))
    
    elements.append(Paragraph("<b>HOSPITAL COURSE & LABORATORY HIGHLIGHTS</b>", header_cell))
    lab_data = [
        [Paragraph("Laboratory Test / Parameter", header_cell), Paragraph("Discharge Value", header_cell), Paragraph("Reference Range", header_cell), Paragraph("Clinical Interpretation", header_cell)],
        [Paragraph("Thyroid Stimulating Hormone (TSH)", body_cell), Paragraph("7.82 mIU/L", alert_cell), Paragraph("0.40 - 4.20 mIU/L", body_cell), Paragraph("Elevated; dose titrated to 75 mcg", alert_cell)],
        [Paragraph("Free Thyroxine (FT4)", body_cell), Paragraph("0.88 ng/dL", body_cell), Paragraph("0.80 - 1.80 ng/dL", body_cell), Paragraph("Low Normal", body_cell)],
        [Paragraph("Absolute Eosinophil Count (AEC)", body_cell), Paragraph("620 cells/mcL", alert_cell), Paragraph("20 - 500 cells/mcL", body_cell), Paragraph("Elevated (Allergic phenotype)", alert_cell)],
        [Paragraph("Serum IgE Total", body_cell), Paragraph("410 IU/mL", alert_cell), Paragraph("< 100 IU/mL", body_cell), Paragraph("High Atopic Marker", alert_cell)],
        [Paragraph("SpO2 (Room Air)", body_cell), Paragraph("98%", body_cell), Paragraph("> 95%", body_cell), Paragraph("Adequate Oxygenation", body_cell)],
    ]
    t_lab = Table(lab_data, colWidths=[180, 100, 130, 130])
    t_lab.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#d1fae5')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_lab)
    elements.append(Spacer(1, 10))
    
    elements.append(Paragraph("<b>DISCHARGE MEDICATIONS (Rx)</b>", header_cell))
    med_data = [
        [Paragraph("#", header_cell), Paragraph("Drug Name & Dosage", header_cell), Paragraph("Administration Schedule", header_cell), Paragraph("Special Instructions", header_cell)],
        [Paragraph("1", body_cell), Paragraph("Budesonide + Formoterol Turbuhaler (160/4.5 mcg)", body_cell), Paragraph("2 Puffs Twice Daily (BD)", body_cell), Paragraph("Mouth rinse after inhalation", body_cell)],
        [Paragraph("2", body_cell), Paragraph("Tab. Montelukast 10 mg", body_cell), Paragraph("1 Tab OD at bedtime (HS)", body_cell), Paragraph("Leukotriene receptor antagonist", body_cell)],
        [Paragraph("3", body_cell), Paragraph("Tab. Levothyroxine Sodium 75 mcg", alert_cell), Paragraph("1 Tab OD early morning", body_cell), Paragraph("Strictly empty stomach 45m before breakfast", body_cell)],
    ]
    t_med = Table(med_data, colWidths=[20, 200, 160, 160])
    t_med.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ecfdf5')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_med)
    elements.append(Spacer(1, 10))
    
    elements.append(Paragraph("<b>MANDATORY SAFETY ADVISORY:</b>", header_cell))
    elements.append(Paragraph("• <b>STRICT CONTRAINDICATION: NSAIDs & ASPIRIN.</b> Even small doses of Ibuprofen, Naproxen, or Diclofenac trigger life-threatening acute asthma exacerbations (AERD).<br/>• For analgesia, use Paracetamol (Acetaminophen) with physician guidance.<br/>• Follow up with Pulmonology & Endocrinology in 6 weeks with repeat TSH.", body_cell))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph("Dr. Meera Nambiar, MD, DNB (Pulmonology) | KMC Reg #44102 | Aster CMI Hospital", body_cell))
    elements.append(Paragraph("SYNTHETIC DEMO DATA - Complies with hackathon privacy and evaluation standards.", disclaimer_style))
    build_pdf_document(path, elements)

# ---------------------------------------------------------------------------------
# DOC 7: Ortho Clinic Phone Scan (Priya Venkat - NSAID Allergy Conflict)
# ---------------------------------------------------------------------------------
def make_doc7():
    path = os.path.join(OUTPUT_DIR, "ortho_care_nsaid_allergy_rx_p1002.png")
    img = Image.new('RGB', (1000, 1300), color=(252, 250, 246))
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([30, 30, 970, 150], fill=(240, 243, 246), outline=(70, 90, 120), width=2)
    draw.text((60, 50), "ADVANCED BONE & JOINT ORTHOPAEDIC CLINIC", fill=(20, 40, 80))
    draw.text((60, 85), "10th Main, Malleshwaram, Bangalore - 560003 | Phone: 080-23349911", fill=(60, 60, 60))
    draw.text((60, 115), "Dr. C. S. Reddy, MS (Ortho), FISM - Consultant Orthopaedic Surgeon", fill=(80, 80, 80))
    
    draw.line([30, 170, 970, 170], fill=(180, 180, 180), width=2)
    draw.text((50, 190), "Date: 20-Mar-2026               Patient: Priya Venkat               Age: 34 / F", fill=(20, 20, 20))
    draw.text((50, 220), "UHID: P1002                      Clinical Case: Inversion injury left ankle", fill=(60, 60, 60))
    draw.text((50, 250), "Diagnosis: Grade 1 Ankle Ligament Sprain with localized swelling & tenderness", fill=(40, 40, 40))
    draw.line([30, 290, 970, 290], fill=(180, 180, 180), width=2)
    
    draw.text((60, 320), "Rx", fill=(10, 40, 120))
    draw.text((80, 370), "1. Tab. Ibuprofen 400 mg (Brufen)", fill=(20, 20, 20))
    draw.text((120, 405), "-> 1 Tablet Thrice Daily (TDS) after food x 5 days", fill=(60, 60, 60))
    draw.text((120, 435), "[CRITICAL ALERT: SEVERE ALLERGY CONFLICT IN ASTHMATIC PATIENT]", fill=(200, 20, 20))
    
    draw.text((80, 490), "2. Tab. Pantoprazole 40 mg (Pan-40)", fill=(20, 20, 20))
    draw.text((120, 525), "-> 1 Tablet OD before food x 5 days", fill=(60, 60, 60))
    
    draw.text((80, 580), "3. Crepe Bandage 10 cm & Ice compression x 3 days", fill=(20, 20, 20))
    
    draw.line([30, 800, 970, 800], fill=(180, 180, 180), width=1)
    draw.text((50, 830), "R.I.C.E. protocol: Rest, Ice, Compression, Elevation. Review in 1 week.", fill=(80, 80, 80))
    draw.text((650, 900), "Dr. C. S. Reddy, MS (Ortho)", fill=(20, 20, 20))
    draw.text((650, 930), "KMC Reg #31882", fill=(60, 60, 60))
    
    draw.text((50, 1220), "SYNTHETIC DEMO RECORD - Allergy cross-check test case (NSAID vs Bronchial Asthma).", fill=(120, 120, 120))
    
    img = img.rotate(-0.4, resample=Image.BICUBIC, fillcolor=(240, 238, 233))
    img.save(path, "PNG")
    print(f"Generated Simulated Image: {path}")

# ---------------------------------------------------------------------------------
# DOC 8: Apollo Pharmacy Dispensing Log (Priya Venkat)
# ---------------------------------------------------------------------------------
def make_doc8():
    path = os.path.join(OUTPUT_DIR, "apollo_pharmacy_dispensing_log_p1002.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["TransactionID", "DispenseDate", "PatientID", "PatientName", "PrescribedMedication", "BrandName", "QuantityDispensed", "Unit", "PrescribingProvider", "PharmacistLicense", "Notes"])
        writer.writerow(["TX-2025-0102", "15-Dec-2025", "P1002", "Priya Venkat", "Levothyroxine 50 mcg", "Thyronorm 50", "100", "Tablets", "Dr. Swaminathan (Endo)", "KA-PHARM-8819", "Baseline dose dispensed"])
        writer.writerow(["TX-2026-0045", "15-Jan-2026", "P1002", "Priya Venkat", "Budesonide/Formoterol 160/4.5", "Symbicort Turbuhaler", "1", "Inhaler (120 doses)", "Dr. Meera Nambiar (Pulm)", "KA-PHARM-8819", "Refill dispensed"])
        writer.writerow(["TX-2026-0128", "16-Feb-2026", "P1002", "Priya Venkat", "Levothyroxine 75 mcg", "Thyronorm 75", "100", "Tablets", "Aster CMI Hospital", "KA-PHARM-9021", "Dose escalated per TSH 7.82"])
        writer.writerow(["TX-2026-0129", "16-Feb-2026", "P1002", "Priya Venkat", "Montelukast 10 mg", "Montair 10", "30", "Tablets", "Aster CMI Hospital", "KA-PHARM-9021", "Post-discharge fill"])
        writer.writerow(["TX-2026-0214", "22-Mar-2026", "P1002", "Priya Venkat", "Ibuprofen 400 mg", "Brufen 400", "15", "Tablets", "Bone & Joint Clinic", "KA-PHARM-9021", "Dispensed without allergy warning"])
    print(f"Generated CSV: {path}")

# ---------------------------------------------------------------------------------
# DOC 9: St. John's Cardio - Warfarin + Clarithromycin Interaction (Anita Desai)
# ---------------------------------------------------------------------------------
def make_doc9():
    path = os.path.join(OUTPUT_DIR, "st_johns_cardio_warfarin_interaction_p1003.pdf")
    elements = []
    
    elements.append(Paragraph("ST. JOHN'S MEDICAL COLLEGE & CARDIOLOGY CENTRE", title_style))
    elements.append(Paragraph("Sarjapur Road, John Nagar, Bengaluru 560034 | SYNTHETIC DEMO DATA", subtitle_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#b91c1c'), spaceAfter=8))
    
    demo_data = [
        [Paragraph("<b>Patient Name:</b> Anita Desai", body_cell), Paragraph("<b>UHID / Hospital #</b> P1003", body_cell)],
        [Paragraph("<b>Age / Gender:</b> 67 Yrs / Female", body_cell), Paragraph("<b>Consult Date:</b> 02-Apr-2026", body_cell)],
        [Paragraph("<b>Diagnoses:</b> Non-valvular Atrial Fibrillation (I48.0), Hypertension", body_cell), Paragraph("<b>Consultant:</b> Dr. George Thomas (MD, DM Cardiology)", body_cell)],
    ]
    t_demo = Table(demo_data, colWidths=[270, 270])
    t_demo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef2f2')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#fca5a5')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fecaca')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_demo)
    elements.append(Spacer(1, 10))
    
    elements.append(Paragraph("<b>LONGITUDINAL MEDICATION REGIMEN & CRITICAL INTERACTION ALERT</b>", header_cell))
    elements.append(Spacer(1, 4))
    
    med_data = [
        [Paragraph("Active Drug", header_cell), Paragraph("Dose / Frequency", header_cell), Paragraph("Prescribed For", header_cell), Paragraph("Concurrent Drug Added by Clinic B", header_cell), Paragraph("Drug-Drug Interaction Risk", header_cell)],
        [Paragraph("Tab. Warfarin Sodium", body_cell), Paragraph("3 mg OD evening", body_cell), Paragraph("Stroke prevention in AF", body_cell), Paragraph("Tab. Clarithromycin 500 mg BD (Chest infection)", alert_cell), Paragraph("<font color='#dc2626'>CYP3A4 / CYP2C9 inhibition -> Severe INR Surge & Bleeding Risk</font>", alert_cell)],
        [Paragraph("Tab. Amlodipine", body_cell), Paragraph("5 mg OD morning", body_cell), Paragraph("Hypertension", body_cell), Paragraph("None", body_cell), Paragraph("Stable", body_cell)],
    ]
    t_med = Table(med_data, colWidths=[110, 100, 110, 110, 110])
    t_med.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fee2e2')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#f87171')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fecaca')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_med)
    elements.append(Spacer(1, 10))
    
    elements.append(Paragraph("<b>COAGULATION PROFILE (EMERGENCY STAT LAB)</b>", header_cell))
    lab_data = [
        [Paragraph("Coagulation Assay", header_cell), Paragraph("Measured Value", header_cell), Paragraph("Target Therapeutic Range", header_cell), Paragraph("Clinical Risk Severity", header_cell)],
        [Paragraph("Prothrombin Time (PT)", body_cell), Paragraph("44.2 seconds", alert_cell), Paragraph("11.0 - 13.5 seconds", body_cell), Paragraph("Markedly Prolonged", alert_cell)],
        [Paragraph("International Normalized Ratio (INR)", alert_cell), Paragraph("4.80", alert_cell), Paragraph("2.00 - 3.00 (Target AF Range)", body_cell), Paragraph("<font color='#dc2626'>CRITICAL RISK: Major Hemorrhage</font>", alert_cell)],
    ]
    t_lab = Table(lab_data, colWidths=[160, 100, 140, 140])
    t_lab.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fef2f2')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#f87171')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fecaca')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_lab)
    elements.append(Spacer(1, 12))
    
    elements.append(Paragraph("<b>EMERGENCY ACTION TAKEN:</b> Warfarin temporarily withheld. Discontinued Clarithromycin. Administered Oral Vitamin K1 2.5 mg. Repeat INR in 24 hours.", body_cell))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph("Dr. George Thomas, MD, DM (Cardiology), FACC | Reg #KMC-18824", body_cell))
    elements.append(Paragraph("SYNTHETIC DEMO DATA - Curated drug-drug interaction test case.", disclaimer_style))
    build_pdf_document(path, elements)

if __name__ == "__main__":
    make_doc1()
    make_doc2()
    make_doc3()
    make_doc4()
    make_doc5()
    make_doc6()
    make_doc7()
    make_doc8()
    make_doc9()
    print("ALL 9 SYNTHETIC MEDICAL DOCUMENTS GENERATED SUCCESSFULLY.")
