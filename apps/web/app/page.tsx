"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  Percent,
  Receipt,
  Smartphone,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
} from "lucide-react";
import { PolicySimulator } from "@/components/tools/PolicySimulator";
import { PolicyModals, ModalType } from "@/components/modals/PolicyModals";

const BANKING_SERVICES = [
  {
    title: "Savings & Deposit Accounts",
    category: "Retail Accounts",
    desc: "Compare regular savings accounts, zero-balance salary accounts, and senior citizen fixed deposit yields.",
    action: "Ask About Accounts",
    query: "What is the difference between a savings account and a fixed deposit?",
    icon: Building2,
  },
  {
    title: "Loans & EMI Eligibility",
    category: "Lending Services",
    desc: "Transparent review of home, car, and personal loan criteria, reducing-balance interest rates, and required KYC proofs.",
    action: "Calculate EMI",
    query: "What factors affect loan eligibility and how is EMI calculated?",
    icon: Percent,
  },
  {
    title: "Schedule of Charges & Tariffs",
    category: "Fee Transparency",
    desc: "Complete statutory disclosures for average monthly balance (AMB) shortfalls, NEFT/IMPS charges, and cheque returns.",
    action: "Inspect Fee Tariffs",
    query: "What are typical charges if minimum balance in a savings account is not maintained?",
    icon: Receipt,
  },
  {
    title: "Digital Payments & UPI Rules",
    category: "Payment Systems",
    desc: "Safe UPI guidelines, transaction limits, dispute turnaround timelines (T+1 days), and chargeback mechanisms.",
    action: "Review UPI Safety",
    query: "Someone asked for my UPI PIN to receive money, is that safe?",
    icon: Smartphone,
  },
  {
    title: "Debit Cards & International Usage",
    category: "Cards & Forex",
    desc: "Guidelines for daily ATM withdrawal caps, POS limits, contactless NFC security, and mark-up fees on foreign spends.",
    action: "Card Guidelines",
    query: "What are the rules and limits for contactless debit card payments?",
    icon: CreditCard,
  },
  {
    title: "Anti-Fraud & Ombudsman Assistance",
    category: "Consumer Protection",
    desc: "Immediate emergency freezing instructions, RBI zero-liability consumer protection rules, and grievance escalation steps.",
    action: "View Dispute Rules",
    query: "Money was deducted from my account without an OTP. What steps must I take immediately?",
    icon: ShieldCheck,
  },
];

const FAQS = [
  {
    q: "Why is a UPI PIN never required to receive money or cashback?",
    a: "Under National Payments Corporation of India (NPCI) security architecture, entering a UPI PIN authorizes a debit instruction from your account. Receiving funds or cashbacks is an inward credit and requires no PIN entry whatsoever. Any request for a PIN to receive a prize is a fraudulent scam.",
  },
  {
    q: "What is an Average Monthly Balance (AMB) and how is it calculated?",
    a: "AMB is calculated by taking the sum of the end-of-day balances across each calendar day in the month and dividing by the total number of days. If your calculated AMB falls below your branch threshold, a proportionate shortfall fee is levied as per the published Schedule of Charges.",
  },
  {
    q: "What documentation is generally required to apply for a retail loan?",
    a: "Standard documentation includes: (1) Identity Proof (Aadhaar, Passport, or Voter ID), (2) Address Proof (utility bills or rental agreement), (3) Income Proof (last 3 months' salary slips, Form 16, or ITR receipts), and (4) Bank statements of the operating account for the preceding 6 months.",
  },
  {
    q: "What is the turnaround time for a failed UPI or ATM transaction refund?",
    a: "As per Reserve Bank of India harmonization guidelines, auto-reversal of failed electronic transactions must be completed within T+1 business days for UPI and T+5 days for ATM cash dispense failures. Beyond this timeframe, banks are obligated to pay statutory compensation of ₹100 per day of delay.",
  },
];

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="space-y-12 pb-16">
      {/* ── B. Main Hero Section ─────────────────────────────────────── */}
      <section className="bg-bank-navy text-white py-14 px-4 border-b border-[#224466]">
        <div className="banking-container">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#204060] text-slate-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-bank-teal" />
              <span>Official Financial Guidance & Regulatory Knowledge Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Banking questions, answered clearly.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Understand banking services, loan eligibility, fees, digital payments, and financial terminology with assistance from our intelligent banking guide—grounded in official regulatory policies.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/assistant"
                className="px-5 py-2.5 bg-bank-blue hover:bg-bank-blueHover text-white text-xs font-bold rounded transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                <span>Ask the Banking Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#services"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded transition-colors border border-white/20"
              >
                Explore Banking Services
              </a>
            </div>

            {/* Trust cues row */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-bank-teal" />
                Zero-Credential Privacy Guard
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-bank-teal" />
                RBI & NPCI Verified Documentation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-bank-teal" />
                Dual-Agent Consensus Auditing
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── C. Banking Services Section ───────────────────────────────── */}
      <section id="services" className="banking-container scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-bank-border">
          <div>
            <h2 className="text-xl font-bold text-bank-navy">Personal Banking Information Services</h2>
            <p className="text-xs text-bank-textSecondary mt-0.5">
              Select a service below to review statutory guidelines or query our assistant directly.
            </p>
          </div>
          <Link
            href="/assistant"
            className="text-xs font-bold text-bank-blue hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Open All Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BANKING_SERVICES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="banking-card p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-bank-mutedBlue uppercase tracking-wider">
                      {item.category}
                    </span>
                    <div className="w-8 h-8 rounded bg-bank-lightGrey text-bank-blue flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-bank-navy mb-1.5">{item.title}</h3>
                  <p className="text-xs text-bank-textSecondary leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-bank-border">
                  <Link
                    href={`/assistant?q=${encodeURIComponent(item.query)}`}
                    className="text-xs font-semibold text-bank-blue hover:text-bank-navy inline-flex items-center gap-1.5 group"
                  >
                    <span>{item.action}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Decision Tools & Policy Simulator ─────────────────────────── */}
      <section id="tools" className="banking-container scroll-mt-20">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-bank-navy">Policy-as-Code Calculators & Simulations</h2>
          <p className="text-xs text-bank-textSecondary mt-0.5">
            Deterministic mathematical computations for loan installments, average balance shortfall penalties, and payment rail specs.
          </p>
        </div>

        <PolicySimulator />
      </section>

      {/* ── D. Integrated Banking Assistant Spotlight ─────────────────── */}
      <section className="banking-container">
        <div className="bg-white border border-bank-border rounded-sm p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-bank-teal uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              <span>Integrated Customer Support Tool</span>
            </div>
            <h2 className="text-2xl font-bold text-bank-navy leading-snug">
              Have a specific question about banking policies or charges?
            </h2>
            <p className="text-xs text-bank-textSecondary leading-relaxed">
              Our Banking Assistant cross-references approved tariff manuals, Reserve Bank master circulars, and NPCI protocols in real time. Answers cite verifiable source documents without storing sensitive customer credentials.
            </p>
            <div className="pt-2">
              <Link
                href="/assistant"
                className="px-5 py-2.5 bg-bank-navy hover:bg-bank-blue text-white text-xs font-bold rounded transition-colors inline-flex items-center gap-2"
              >
                <span>Launch Assistant Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-96 bg-bank-lightGrey p-4 rounded border border-bank-border space-y-2.5 text-xs">
            <span className="font-bold text-bank-navy block text-[11px] uppercase tracking-wider mb-2">
              Popular Customer Inquiries
            </span>
            {[
              "What happens if my minimum balance drops for 3 days?",
              "What are the charges for ATM transactions beyond 5 free limits?",
              "How can I register a dispute for an unauthorized debit card swipe?",
              "What is the difference between IMPS and RTGS settlement?",
            ].map((q, i) => (
              <Link
                key={i}
                href={`/assistant?q=${encodeURIComponent(q)}`}
                className="block p-2.5 bg-white hover:bg-bank-warmWhite border border-bank-border rounded text-bank-textPrimary font-medium transition-colors"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Schedule of Charges Preview Table ─────────────────────────── */}
      <section id="charges" className="banking-container scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 pb-2 border-b border-bank-border">
          <div>
            <h2 className="text-xl font-bold text-bank-navy">Statutory Tariff & Service Charges Schedule</h2>
            <p className="text-xs text-bank-textSecondary mt-0.5">
              Standard retail service charges effective for the current financial year. (All charges subject to applicable GST).
            </p>
          </div>
          <Link
            href="/assistant?q=Show me the full schedule of banking fees and charges"
            className="text-xs font-bold text-bank-blue hover:underline"
          >
            Ask Assistant to Compare Fees
          </Link>
        </div>

        <div className="banking-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-bank-lightGrey border-b border-bank-border text-bank-textSecondary uppercase tracking-wider font-semibold text-[11px]">
                  <th className="p-3.5">Service Description</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Statutory Allowance</th>
                  <th className="p-3.5">Applicable Tariff</th>
                  <th className="p-3.5">Effective Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bank-border text-bank-textPrimary">
                <tr className="hover:bg-bank-warmWhite">
                  <td className="p-3.5 font-medium">Non-Maintenance of AMB (Metro/Urban)</td>
                  <td className="p-3.5 text-bank-textSecondary">Savings Account</td>
                  <td className="p-3.5">AMB ≥ ₹10,000</td>
                  <td className="p-3.5 font-semibold text-bank-alertRed">₹100 to ₹150 + GST</td>
                  <td className="p-3.5 text-bank-textSecondary">01 Apr (Current)</td>
                </tr>
                <tr className="hover:bg-bank-warmWhite">
                  <td className="p-3.5 font-medium">ATM Financial Transactions (Own Bank)</td>
                  <td className="p-3.5 text-bank-textSecondary">Debit Cards</td>
                  <td className="p-3.5 text-bank-successGreen font-medium">5 Free Transactions / month</td>
                  <td className="p-3.5 font-semibold">₹21 + GST per transaction</td>
                  <td className="p-3.5 text-bank-textSecondary">Active Circular</td>
                </tr>
                <tr className="hover:bg-bank-warmWhite">
                  <td className="p-3.5 font-medium">Online NEFT / RTGS Transfer</td>
                  <td className="p-3.5 text-bank-textSecondary">Digital Banking</td>
                  <td className="p-3.5">Unlimited digital transfers</td>
                  <td className="p-3.5 text-bank-successGreen font-bold">₹0 (Free online)</td>
                  <td className="p-3.5 text-bank-textSecondary">RBI Mandate</td>
                </tr>
                <tr className="hover:bg-bank-warmWhite">
                  <td className="p-3.5 font-medium">Cheque Return (Financial Shortfall)</td>
                  <td className="p-3.5 text-bank-textSecondary">Clearing Services</td>
                  <td className="p-3.5">Nil</td>
                  <td className="p-3.5 font-semibold text-bank-alertRed">₹350 per bounce</td>
                  <td className="p-3.5 text-bank-textSecondary">Standard Tariff</td>
                </tr>
                <tr className="hover:bg-bank-warmWhite">
                  <td className="p-3.5 font-medium">Personal Loan Pre-payment / Foreclosure</td>
                  <td className="p-3.5 text-bank-textSecondary">Retail Loans</td>
                  <td className="p-3.5 text-bank-successGreen font-medium">Zero penalty for floating rate loans</td>
                  <td className="p-3.5 font-semibold">Up to 2% (fixed rate loans only)</td>
                  <td className="p-3.5 text-bank-textSecondary">Fair Practices Code</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── E. Frequently Asked Questions Section ────────────────────── */}
      <section className="banking-container">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-bank-navy">Frequently Asked Banking Questions</h2>
          <p className="text-xs text-bank-textSecondary mt-0.5">
            Authoritative explanations on consumer rights, digital safety, and common banking terminology.
          </p>
        </div>

        <div className="banking-card divide-y divide-bank-border">
          {FAQS.map((item, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div key={idx} className="p-4 sm:p-5">
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-bank-navy hover:text-bank-blue transition-colors"
                >
                  <span className="pr-4">{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-bank-textSecondary shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-bank-textSecondary shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-bank-textSecondary mt-2.5 leading-relaxed animate-fade-in">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Global Policy Modals */}
      <PolicyModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
