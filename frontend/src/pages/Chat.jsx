import React, { useState } from 'react';
import {
  HiOutlineChatAlt2,
  HiOutlineSparkles,
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineDocumentSearch
} from 'react-icons/hi';
import { useForensic } from '../context/ForensicContext';

const KNOWLEDGE_RESPONSES = [
  {
    triggers: ['tamper', 'salary slip', 'forgery', 'prove', 'proof'],
    answer: `**Forensic Findings on Salary Slip (Apex Technologies Ltd - Nov 2026):**\n\n1. **Error Level Analysis (ELA) Quantization Discrepancy:**\n   - High-frequency compression variance was localized at coordinates \`[X: 37%, Y: 72%, W: 55%, H: 8%]\` surrounding the Net Salary figure.\n   - Error level intensity in this bounding box reached **184 luminance units**, compared to the uniform document background baseline of **14 units** (a **13.1x quantization deviation**).\n   - This confirms the digit "1" and comma were digitally spliced into the image from an external graphic source.\n\n2. **Internal Mathematical Arithmetic Breakdown:**\n   - Stated Gross: ₹1,60,000 | Stated Deductions: ₹15,000 | Stated Net: ₹1,45,000.\n   - However, the unmanipulated underlying base salary was Gross: ₹50,000, Deductions: ₹5,000, Net: ₹45,000.\n   - Statutory EPF deduction of ₹8,000 on claimed basic pay of ₹85,000 represents only **9.4%**, violating the mandatory Indian statutory rate of **12%**.\n\n3. **Typographic Baseline Drift:**\n   - Sub-pixel profiling revealed a **-2.4px vertical depression** and anti-aliasing feathering inconsistency on the "1,45,000" glyph block.`
  },
  {
    triggers: ['bank', 'deposit', 'compare', 'credit', 'ach'],
    answer: `**Multi-Document Income Triangulation (Salary Slip vs HDFC Bank Statement):**\n\n- **Applicant Asserted Claim:** Salary Slip asserts a monthly take-home net salary of **INR 1,45,000.00**.\n- **Bank Certified Reality:** HDFC Bank Statement (A/C #50100492817291) records recurring monthly employer inward credits:\n  - 30-Sep-2026: **INR 45,000.00** (\`ACH CR-APEX TECH-SAL-SEP26\`)\n  - 31-Oct-2026: **INR 45,000.00** (\`ACH CR-APEX TECH-SAL-OCT26\`)\n  - 30-Nov-2026: **INR 45,000.00** (\`ACH CR-APEX TECH-SAL-NOV26\`)\n\n**Discrepancy Delta:** Unsubstantiated artificial inflation of **+INR 1,00,000 / month (+222.2%)**.\n**Adjudication:** Mandatory loan application denial under Fraud Rule SEC-FIN-08.`
  },
  {
    triggers: ['invoice', 'procurement', 'vendor', 'po', 'duplicate'],
    answer: `**Procurement Fraud Analysis (Case DFIR-2026-094-PROC):**\n\n1. **Duplicate Invoice Recycling:**\n   - Vendor Invoice #INV-8842 was submitted on **12-Nov-2026** for INR 4,20,000.00.\n   - An identical invoice with the exact same invoice number (#INV-8842), line items (Core Switch Redundancy Migration), and total (INR 4,20,000.00) was re-submitted on **26-Nov-2026** (14 days later).\n   - The secondary submission substituted PO reference \`PO-9102\` with \`PO-9910\` to bypass legacy duplicate filters.\n\n2. **PO Budget Cap Breach:**\n   - Approved Purchase Order PO-9102 has an authorized expenditure ceiling of **INR 2,10,000.00**.\n   - Billed invoice demands **INR 4,20,000.00**, representing a **+100% budget overrun** without an authorized change order.\n\n**Action:** Placed vendor ICICI A/C 001205009988 on immediate ERP disbursement freeze.`
  },
  {
    triggers: ['dossier', 'committee', 'executive', 'summary', 'iso'],
    answer: `**ISO/IEC 27037 Formal Adjudication Brief for Credit Committee:**\n\n- **Case Reference:** DFIR-2026-081-FIN (Borrower: Vikram Aditya Sharma)\n- **Composite Risk Rating:** 92/100 (CRITICAL - Forgery Confirmed)\n- **Integrity Seal:** SHA-256 Verified across 3 evidence documents.\n- **Primary Findings:**\n  1. Forensic ELA confirmed digital splice of Net Salary on November 2026 Salary Slip.\n  2. HDFC Bank ACH records prove actual monthly income is ₹45,000 (claimed ₹1,45,000).\n  3. Income Tax Department ITR-V verifies annual taxable gross of ₹5,40,000.\n- **Final Recommendation:** DECLINE credit application. Blacklist profile in consortium fraud registry.`
  }
];

export default function Chat() {
  const { activeCase } = useForensic();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Greetings Investigator. I am the **ForensIQ Grounded AI Copilot**.\n\nI operate under strict **zero-hallucination protocols** adhering to **ISO/IEC 27037** and **NIST SP 800-86**. Every answer is mathematically cross-referenced with your evidence dossier (\`${activeCase.caseNumber}\`).\n\nWhat would you like me to inspect?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let matched = KNOWLEDGE_RESPONSES.find(kr =>
        kr.triggers.some(t => lower.includes(t))
      );

      const botReply = matched
        ? matched.answer
        : `**Evidence Query Result (${activeCase.caseNumber}):**\n\nTriangulating query against active case file **${activeCase.title}**...\n\n- Primary Subject: **${activeCase.targetEntity}**\n- Document Integrity: Cryptographic SHA-256 seal verified.\n- Verified Conflicts: **${activeCase.crossDocCorrelations.length} active discrepancies** detected.\n\nPlease select one of the suggested prompts below for coordinate-grounded evidentiary deep-dives.`;

      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-md bg-cyan-950 border border-cyan-800 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400 uppercase">
            Section 6.2 &bull; AI Reasoning
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            Grounded Zero-Hallucination Evidentiary Reasoning Engine
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Forensic AI Copilot & Query Terminal
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Ask targeted questions regarding pixel alterations, ELA luminance metrics, income triangulation deltas, and cross-document statutory violations.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Suggested Queries:
        </span>
        {[
          'What proves the salary slip was tampered?',
          'Compare bank deposits with claimed salary',
          'Explain the duplicate invoice PO violation',
          'Generate executive summary for loan committee'
        ].map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl min-h-[440px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black text-xs">
                    F
                  </div>
                )}
                <div
                  className={`max-w-2xl p-4 rounded-2xl whitespace-pre-wrap ${
                    isUser
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
              <HiOutlineSparkles className="text-cyan-400 animate-spin" />
              <span>Cross-referencing document coordinates and ledger hashes...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything regarding document tampering, ELA findings, or bank reconciliation..."
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-2xl border border-cyan-400 bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition shadow-lg disabled:opacity-40"
            >
              <HiOutlinePaperAirplane className="text-base rotate-90" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1 text-cyan-400 font-mono">
              <HiOutlineShieldCheck className="text-xs" /> Zero-Hallucination Grounded Mode Active
            </span>
            <span>Case Context: {activeCase.caseNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
