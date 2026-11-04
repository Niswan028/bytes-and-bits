import os
import csv
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from PIL import Image, ImageDraw, ImageFont, ImageFilter

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
    print(f"Generated Forensic PDF: {filepath}")

styles = getSampleStyleSheet()

header_style = ParagraphStyle(
    'DocHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=16,
    textColor=colors.HexColor('#0f172a')
)
sub_style = ParagraphStyle(
    'DocSub',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=11,
    textColor=colors.HexColor('#475569')
)
table_bold = ParagraphStyle(
    'TableBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=colors.HexColor('#0f172a')
)
table_norm = ParagraphStyle(
    'TableNorm',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=10,
    textColor=colors.HexColor('#334155')
)
alert_text = ParagraphStyle(
    'AlertText',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=colors.HexColor('#dc2626')
)

# -------------------------------------------------------------------------------------------------
# 1. HDFC Bank Statement Q3 (Genuine baseline for CASE-2026-081)
# -------------------------------------------------------------------------------------------------
def gen_bank_statement():
    filepath = os.path.join(OUTPUT_DIR, "hdfc_bank_statement_q3.pdf")
    elements = [
        Paragraph("HDFC BANK LIMITED • ACCOUNT STATEMENT", header_style),
        Paragraph("Retail Banking Division • Branch: Connaught Place, New Delhi 110001 • IFSC: HDFC0000128", sub_style),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284c7'), spaceAfter=10),
        Paragraph("<b>Account Holder:</b> Vikram Malhotra | <b>Account No:</b> 50100492819201 | <b>Period:</b> 01-Aug-2026 to 31-Oct-2026", sub_style),
        Spacer(1, 8),
        Paragraph("<b>SUMMARY OF TRANSACTIONS</b>", table_bold),
        Spacer(1, 4)
    ]
    
    tx_data = [
        [Paragraph("Date", table_bold), Paragraph("Description / Narration", table_bold), Paragraph("Chq/Ref No.", table_bold), Paragraph("Debit (INR)", table_bold), Paragraph("Credit (INR)", table_bold), Paragraph("Balance (INR)", table_bold)],
        [Paragraph("01-Aug-2026", table_norm), Paragraph("SALARY CREDIT - TECHVANTAGE SOLUTIONS", table_norm), Paragraph("NEFT-994821", table_norm), Paragraph("-", table_norm), Paragraph("45,000.00", table_bold), Paragraph("1,12,450.00", table_norm)],
        [Paragraph("05-Aug-2026", table_norm), Paragraph("UPI-RENT TRANSFER TO RAJESH", table_norm), Paragraph("UPI-392810", table_norm), Paragraph("18,000.00", table_norm), Paragraph("-", table_norm), Paragraph("94,450.00", table_norm)],
        [Paragraph("01-Sep-2026", table_norm), Paragraph("SALARY CREDIT - TECHVANTAGE SOLUTIONS", table_norm), Paragraph("NEFT-102948", table_norm), Paragraph("-", table_norm), Paragraph("45,000.00", table_bold), Paragraph("1,21,450.00", table_norm)],
        [Paragraph("12-Sep-2026", table_norm), Paragraph("ELECTRICITY & UTILITY BILL", table_norm), Paragraph("BBPS-882910", table_norm), Paragraph("4,200.00", table_norm), Paragraph("-", table_norm), Paragraph("1,17,250.00", table_norm)],
        [Paragraph("01-Oct-2026", table_norm), Paragraph("SALARY CREDIT - TECHVANTAGE SOLUTIONS", table_norm), Paragraph("NEFT-201948", table_norm), Paragraph("-", table_norm), Paragraph("45,000.00", table_bold), Paragraph("1,44,250.00", table_norm)],
        [Paragraph("25-Oct-2026", table_norm), Paragraph("MUTUAL FUND SIP DEBIT", table_norm), Paragraph("ACH-772910", table_norm), Paragraph("10,000.00", table_norm), Paragraph("-", table_norm), Paragraph("1,34,250.00", table_norm)]
    ]
    t = Table(tx_data, colWidths=[65, 180, 75, 70, 75, 75])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Certified True Copy:</b> Verified via 256-bit Bank Signature Gateway • Host: banking.hdfcbank.com", sub_style))
    build_pdf_document(filepath, elements)

# -------------------------------------------------------------------------------------------------
# 2. ITR-V Tax Acknowledgement AY2026 (Genuine baseline for CASE-2026-081)
# -------------------------------------------------------------------------------------------------
def gen_itr_v():
    filepath = os.path.join(OUTPUT_DIR, "itr_v_acknowledgement_ay2026.pdf")
    elements = [
        Paragraph("GOVERNMENT OF INDIA • INCOME TAX DEPARTMENT", header_style),
        Paragraph("INDIAN INCOME TAX RETURN VERIFICATION FORM [ITR-V] • ASSESSMENT YEAR 2026-27", sub_style),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor('#059669'), spaceAfter=10),
        Paragraph("<b>PAN:</b> ABCPM8819K | <b>Name:</b> Vikram Malhotra | <b>Status:</b> Individual Resident | <b>Form:</b> ITR-1 (SAHAJ)", sub_style),
        Spacer(1, 8),
        Paragraph("<b>PART B - COMPUTATION OF TOTAL INCOME AND TAX LIABILITY</b>", table_bold),
        Spacer(1, 4)
    ]
    
    itr_data = [
        [Paragraph("Item No.", table_bold), Paragraph("Income Component / Description", table_bold), Paragraph("Amount Declared (INR)", table_bold)],
        [Paragraph("1", table_norm), Paragraph("Gross Salary (as per Section 17(1))", table_norm), Paragraph("5,40,000.00", table_bold)],
        [Paragraph("2", table_norm), Paragraph("Standard Deduction u/s 16(ia)", table_norm), Paragraph("50,000.00", table_norm)],
        [Paragraph("3", table_norm), Paragraph("Income chargeable under head 'Salaries' (1 - 2)", table_norm), Paragraph("4,90,000.00", table_bold)],
        [Paragraph("4", table_norm), Paragraph("Income from Other Sources (Bank Interest)", table_norm), Paragraph("12,400.00", table_norm)],
        [Paragraph("5", table_norm), Paragraph("Gross Total Income (3 + 4)", table_norm), Paragraph("5,02,400.00", table_bold)],
        [Paragraph("6", table_norm), Paragraph("Deductions under Chapter VI-A (80C, 80D)", table_norm), Paragraph("85,000.00", table_norm)],
        [Paragraph("7", table_norm), Paragraph("Total Taxable Income (Rounded Off)", table_norm), Paragraph("4,17,400.00", table_bold)],
        [Paragraph("8", table_norm), Paragraph("Net Tax Payable after Section 87A Rebate", table_norm), Paragraph("0.00", table_bold)]
    ]
    t = Table(itr_data, colWidths=[60, 320, 160])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ecfdf5')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#a7f3d0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>E-Verification Timestamp:</b> 18-Jul-2026 14:22:10 IST • Ack No: 491820194819028 • Verification Status: VERIFIED", sub_style))
    build_pdf_document(filepath, elements)

# -------------------------------------------------------------------------------------------------
# 3. Vendor Invoice Original (INV-8842 - CASE-2026-094)
# -------------------------------------------------------------------------------------------------
def gen_vendor_invoice_1():
    filepath = os.path.join(OUTPUT_DIR, "vendor_invoice_apex_tech_nov12.pdf")
    elements = [
        Paragraph("APEX CLOUD SOLUTIONS PRIVATE LIMITED • TAX INVOICE", header_style),
        Paragraph("Cyber City, Tower B, Level 8, Gurugram, Haryana 122002 • GSTIN: 06AAACA1192M1Z4", sub_style),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor('#4f46e5'), spaceAfter=10),
        Paragraph("<b>Invoice No:</b> INV-8842 | <b>Date:</b> 12-Nov-2026 | <b>PO Reference:</b> PO-9102 | <b>Payment Terms:</b> Net 30 Days", sub_style),
        Paragraph("<b>Billed To:</b> DataOps Global Enterprise Ltd, Outer Ring Road, Bengaluru 560103", sub_style),
        Spacer(1, 8),
        Paragraph("<b>SERVICES RENDERED</b>", table_bold),
        Spacer(1, 4)
    ]
    
    inv_data = [
        [Paragraph("Sl.", table_bold), Paragraph("Service Description", table_bold), Paragraph("SAC Code", table_bold), Paragraph("Units", table_bold), Paragraph("Rate (INR)", table_bold), Paragraph("Total Amount (INR)", table_bold)],
        [Paragraph("1", table_norm), Paragraph("Cloud Architecture Migration & Hardening", table_norm), Paragraph("998313", table_norm), Paragraph("1", table_norm), Paragraph("2,50,000.00", table_norm), Paragraph("2,50,000.00", table_bold)],
        [Paragraph("2", table_norm), Paragraph("Kubernetes SOC/NOC Telemetry Integration", table_norm), Paragraph("998314", table_norm), Paragraph("1", table_norm), Paragraph("1,05,932.20", table_norm), Paragraph("1,05,932.20", table_bold)],
        [Paragraph("-", table_norm), Paragraph("<b>Subtotal</b>", table_bold), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("3,55,932.20", table_bold)],
        [Paragraph("-", table_norm), Paragraph("IGST (18%)", table_norm), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("18%", table_norm), Paragraph("64,067.80", table_norm)],
        [Paragraph("-", table_norm), Paragraph("<b>TOTAL PAYABLE INVOICE VALUE</b>", table_bold), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("4,20,000.00", table_bold)]
    ]
    t = Table(inv_data, colWidths=[30, 230, 60, 45, 85, 90])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#eef2ff')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#c7d2fe')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Bank Account for Wire:</b> Apex Cloud Solutions | ICICI Bank A/C: 002905008129 | IFSC: ICIC0000029", sub_style))
    build_pdf_document(filepath, elements)

# -------------------------------------------------------------------------------------------------
# 4. Duplicate Vendor Invoice Resubmission (INV-8842 Duplicate - CASE-2026-094)
# -------------------------------------------------------------------------------------------------
def gen_vendor_invoice_duplicate():
    filepath = os.path.join(OUTPUT_DIR, "vendor_invoice_apex_tech_repeat_nov26.pdf")
    elements = [
        Paragraph("APEX CLOUD SOLUTIONS PRIVATE LIMITED • TAX INVOICE", header_style),
        Paragraph("Cyber City, Tower B, Level 8, Gurugram, Haryana 122002 • GSTIN: 06AAACA1192M1Z4", sub_style),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e11d48'), spaceAfter=10),
        Paragraph("<b>Invoice No:</b> INV-8842 | <b>Date:</b> 26-Nov-2026 | <b>PO Reference:</b> PO-9910 | <b>Payment Terms:</b> Immediate", alert_text),
        Paragraph("<b>Billed To:</b> DataOps Global Enterprise Ltd, Accounts Payable Division, Mumbai Branch", sub_style),
        Spacer(1, 8),
        Paragraph("<b>SERVICES RENDERED (DUPLICATE SUBMISSION NOTICE)</b>", alert_text),
        Spacer(1, 4)
    ]
    
    inv_data = [
        [Paragraph("Sl.", table_bold), Paragraph("Service Description", table_bold), Paragraph("SAC Code", table_bold), Paragraph("Units", table_bold), Paragraph("Rate (INR)", table_bold), Paragraph("Total Amount (INR)", table_bold)],
        [Paragraph("1", table_norm), Paragraph("Cloud Architecture Migration & Hardening (Cycle 2)", table_norm), Paragraph("998313", table_norm), Paragraph("1", table_norm), Paragraph("2,50,000.00", table_norm), Paragraph("2,50,000.00", table_bold)],
        [Paragraph("2", table_norm), Paragraph("Kubernetes SOC/NOC Telemetry Integration (Phase B)", table_norm), Paragraph("998314", table_norm), Paragraph("1", table_norm), Paragraph("1,05,932.20", table_norm), Paragraph("1,05,932.20", table_bold)],
        [Paragraph("-", table_norm), Paragraph("<b>Subtotal</b>", table_bold), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("3,55,932.20", table_bold)],
        [Paragraph("-", table_norm), Paragraph("IGST (18%)", table_norm), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("18%", table_norm), Paragraph("64,067.80", table_norm)],
        [Paragraph("-", table_norm), Paragraph("<b>TOTAL PAYABLE INVOICE VALUE</b>", alert_text), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("-", table_norm), Paragraph("4,20,000.00", alert_text)]
    ]
    t = Table(inv_data, colWidths=[30, 230, 60, 45, 85, 90])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffe4e6')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fecdd3')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Notice:</b> Re-billed under alternate PO reference #PO-9910. Wire Details: ICICI Bank A/C: 002905008129", alert_text))
    build_pdf_document(filepath, elements)

# -------------------------------------------------------------------------------------------------
# 5. Purchase Order (Approved PO-9102 - CASE-2026-094)
# -------------------------------------------------------------------------------------------------
def gen_purchase_order():
    filepath = os.path.join(OUTPUT_DIR, "approved_purchase_order_po9102.pdf")
    elements = [
        Paragraph("DATAOPS GLOBAL ENTERPRISE LIMITED • OFFICIAL PURCHASE ORDER", header_style),
        Paragraph("Global Procurement Office • Bellandur Campus, Outer Ring Road, Bengaluru 560103", sub_style),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0d9488'), spaceAfter=10),
        Paragraph("<b>PO Number:</b> PO-9102 | <b>Date:</b> 01-Nov-2026 | <b>Vendor:</b> Apex Cloud Solutions Pvt Ltd | <b>Status:</b> APPROVED", table_bold),
        Paragraph("<b>Approved By:</b> S. Venkatesh, Chief Procurement Officer | <b>Budget Code:</b> IT-INFRA-2026-Q4", sub_style),
        Spacer(1, 8),
        Paragraph("<b>AUTHORIZED LINE ITEMS (MAXIMUM EXPENDITURE CAP)</b>", table_bold),
        Spacer(1, 4)
    ]
    
    po_data = [
        [Paragraph("Item", table_bold), Paragraph("Authorized Service Scope", table_bold), Paragraph("Cost Center", table_bold), Paragraph("Authorized Cap (INR)", table_bold)],
        [Paragraph("1", table_norm), Paragraph("Cloud Architecture Optimization Consultancy", table_norm), Paragraph("CC-4019", table_norm), Paragraph("1,50,000.00", table_bold)],
        [Paragraph("2", table_norm), Paragraph("Telemetry Pipeline Setup & Integration", table_norm), Paragraph("CC-4022", table_norm), Paragraph("60,000.00", table_bold)],
        [Paragraph("-", table_norm), Paragraph("<b>MAXIMUM AUTHORIZED PO CAP (INCLUSIVE OF APPLICABLE TAXES)</b>", table_bold), Paragraph("-", table_norm), Paragraph("2,10,000.00", table_bold)]
    ]
    t = Table(po_data, colWidths=[40, 270, 90, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f0fdfa')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#99f6e4')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Strict Clause:</b> Any invoice exceeding INR 2,10,000 or lacking matching SAC codes shall be rejected by FinOps.", sub_style))
    build_pdf_document(filepath, elements)

# -------------------------------------------------------------------------------------------------
# 6. Tampered Salary Slip Image (CASE-2026-081) - Artificially manipulated with PIL
# -------------------------------------------------------------------------------------------------
def gen_tampered_salary_slip_image():
    filepath = os.path.join(OUTPUT_DIR, "salary_slip_nov2026_tampered.png")
    width, height = 1200, 1600
    img = Image.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Header border
    draw.rectangle([(40, 40), (width - 40, height - 40)], outline=(180, 190, 205), width=2)
    draw.rectangle([(40, 40), (width - 40, 160)], fill=(240, 245, 250), outline=(180, 190, 205), width=2)

    # Texts
    draw.text((70, 65), "TECHVANTAGE SOLUTIONS PRIVATE LIMITED", fill=(15, 23, 42))
    draw.text((70, 95), "Pay Slip for the Month of October 2026 • Private & Confidential", fill=(71, 85, 105))
    draw.text((70, 120), "CIN: U72200DL2018PTC339102 • Okhla Industrial Area Phase-III, New Delhi 110020", fill=(100, 116, 139))

    # Employee details
    y = 190
    draw.line([(40, y), (width - 40, y)], fill=(203, 213, 225), width=1)
    draw.text((70, y + 15), "Employee Name: Vikram Malhotra", fill=(15, 23, 42))
    draw.text((450, y + 15), "Employee ID: TVS-8819", fill=(15, 23, 42))
    draw.text((800, y + 15), "PAN: ABCPM8819K", fill=(15, 23, 42))

    draw.text((70, y + 45), "Designation: Senior Lead Specialist", fill=(15, 23, 42))
    draw.text((450, y + 45), "Bank: HDFC Bank", fill=(15, 23, 42))
    draw.text((800, y + 45), "Account: *******9201", fill=(15, 23, 42))

    y = 280
    draw.line([(40, y), (width - 40, y)], fill=(203, 213, 225), width=1)

    # Table Header
    draw.rectangle([(70, y + 20), (width - 70, y + 60)], fill=(241, 245, 249), outline=(203, 213, 225), width=1)
    draw.text((90, y + 32), "Earnings Component", fill=(15, 23, 42))
    draw.text((380, y + 32), "Amount (INR)", fill=(15, 23, 42))
    draw.text((600, y + 32), "Deductions Component", fill=(15, 23, 42))
    draw.text((900, y + 32), "Amount (INR)", fill=(15, 23, 42))

    # Genuine line items
    rows = [
        ("Basic Salary", "25,000.00", "Provident Fund (PF)", "2,800.00"),
        ("House Rent Allowance (HRA)", "12,500.00", "Professional Tax (PT)", "200.00"),
        ("Special Allowance", "8,500.00", "Income Tax (TDS)", "0.00"),
        ("Medical Reimbursement", "2,000.00", "-", "-")
    ]

    curr_y = y + 80
    for r in rows:
        draw.text((90, curr_y), r[0], fill=(51, 65, 85))
        draw.text((380, curr_y), r[1], fill=(51, 65, 85))
        draw.text((600, curr_y), r[2], fill=(51, 65, 85))
        draw.text((900, curr_y), r[3], fill=(51, 65, 85))
        draw.line([(70, curr_y + 25), (width - 70, curr_y + 25)], fill=(241, 245, 249), width=1)
        curr_y += 35

    # Sums line:
    # Notice: Actual Gross is 25000 + 12500 + 8500 + 2000 = 48,000. Deductions = 3,000. Net = 45,000.
    # But the applicant artificially pasted "1,45,000.00" on Net Salary!
    curr_y += 30
    draw.rectangle([(70, curr_y), (width - 70, curr_y + 70)], fill=(248, 250, 252), outline=(203, 213, 225), width=1)
    draw.text((90, curr_y + 25), "Total Gross Earnings: 48,000.00", fill=(15, 23, 42))
    draw.text((600, curr_y + 25), "Total Deductions: 3,000.00", fill=(15, 23, 42))

    curr_y += 100
    # Artificially altered region:
    # Draw slightly discolored background patch simulating digital copy-paste edit
    draw.rectangle([(70, curr_y), (width - 70, curr_y + 90)], fill=(255, 252, 245), outline=(234, 179, 8), width=2)
    draw.text((90, curr_y + 30), "NET PAYABLE SALARY:", fill=(15, 23, 42))
    
    # Intentionally overwritten number with slight offset and altered pixel sharpness
    draw.text((450, curr_y + 26), "INR 1,45,000.00", fill=(10, 15, 30))
    draw.text((450, curr_y + 55), "(Rupees One Lakh Forty Five Thousand Only)", fill=(70, 70, 70))

    # Stamp / Signature section at bottom
    curr_y += 180
    draw.text((90, curr_y), "Authorized Signatory: Head of Human Resources", fill=(100, 116, 139))
    draw.text((90, curr_y + 25), "Computer-generated salary voucher. Discrepancies reportable to payroll@techvantage.in", fill=(140, 150, 165))
    draw.rectangle([(800, curr_y - 20), (1050, curr_y + 80)], outline=(100, 116, 139), width=1)
    draw.text((820, curr_y + 25), "[ DIGITALLY SIGNED ]", fill=(100, 116, 139))

    # Add subtle compression noise to simulate saved photo
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(filepath, "PNG")
    print(f"Generated Tampered Salary Slip Image: {filepath}")

if __name__ == '__main__':
    print("Generating comprehensive forensic sample document dataset...")
    gen_bank_statement()
    gen_itr_v()
    gen_vendor_invoice_1()
    gen_vendor_invoice_duplicate()
    gen_purchase_order()
    gen_tampered_salary_slip_image()
    print("Dataset generation complete!")
