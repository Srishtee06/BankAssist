"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  PhoneCall,
  Search,
  Shield,
  Lock,
  FileCheck,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { PolicyModals, ModalType } from "@/components/modals/PolicyModals";

export function BankingHeaderFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/assistant?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-bank-warmWhite text-bank-textPrimary font-sans">
      {/* ── Top Utility Bar ────────────────────────────────────────────── */}
      <div className="bg-bank-navy text-white text-[11px] py-1.5 px-4 border-b border-[#224466]">
        <div className="banking-container flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Personal Banking</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hover:text-white cursor-pointer">Corporate & Commercial</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hover:text-white cursor-pointer">NRI & International</span>
          </div>

          <div className="flex items-center gap-5 text-slate-300">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3 h-3 text-bank-teal" />
              <span>24x7 Customer Care: </span>
              <a href="tel:18002026161" className="font-bold text-white hover:underline">1800 202 6161</a>
            </div>
            <button
              onClick={() => setActiveModal("freeze")}
              className="inline-flex items-center gap-1 text-bank-alertRed hover:text-red-300 font-semibold cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Emergency Rail Freeze</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Banking Navbar ───────────────────────────────────────── */}
      <header className="bg-white border-b border-bank-border sticky top-0 z-40 shadow-xs">
        <div className="banking-container h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded bg-bank-navy flex items-center justify-center text-white">
              <Building2 className="w-5 h-5 text-bank-teal" />
            </div>
            <div>
              <span className="text-base font-bold text-bank-navy tracking-tight block leading-none">
                APEX TRUST BANK
              </span>
              <span className="text-[10px] text-bank-textSecondary font-medium tracking-wide uppercase">
                Banking Information Portal
              </span>
            </div>
          </Link>

          {/* Search bar in header */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative flex-1 max-w-xs mx-4">
            <Search className="w-3.5 h-3.5 text-bank-textSecondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, loan rates, fees..."
              className="w-full bg-bank-lightGrey border border-bank-border rounded pl-8 pr-3 py-1.5 text-xs text-bank-textPrimary placeholder-bank-textSecondary focus:outline-none focus:border-bank-blue focus:bg-white"
            />
          </form>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-bank-textSecondary">
            <Link
              href="/"
              className={`px-3 py-2 rounded transition-colors ${
                pathname === "/" ? "text-bank-navy bg-bank-lightGrey font-bold" : "hover:text-bank-navy hover:bg-bank-lightGrey"
              }`}
            >
              Home
            </Link>
            <Link
              href="/#services"
              className="px-3 py-2 rounded hover:text-bank-navy hover:bg-bank-lightGrey transition-colors"
            >
              Banking Services
            </Link>
            <Link
              href="/#tools"
              className="px-3 py-2 rounded hover:text-bank-navy hover:bg-bank-lightGrey transition-colors"
            >
              Loans & EMI
            </Link>
            <Link
              href="/#charges"
              className="px-3 py-2 rounded hover:text-bank-navy hover:bg-bank-lightGrey transition-colors"
            >
              Schedule of Charges
            </Link>
            <Link
              href="/assistant"
              className={`px-3.5 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                pathname === "/assistant"
                  ? "bg-bank-navy text-white"
                  : "bg-bank-blue text-white hover:bg-bank-blueHover"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Banking Assistant</span>
            </Link>
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded transition-colors ${
                pathname === "/dashboard" ? "text-bank-navy bg-bank-lightGrey font-bold" : "hover:text-bank-navy hover:bg-bank-lightGrey"
              }`}
            >
              Knowledge & Ops
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-bank-textPrimary hover:bg-bank-lightGrey rounded"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-bank-border bg-white px-4 py-3 space-y-2 text-xs font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-bank-navy font-semibold border-b border-bank-lightGrey"
            >
              Home
            </Link>
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-bank-textSecondary border-b border-bank-lightGrey"
            >
              Banking Services
            </Link>
            <Link
              href="/#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-bank-textSecondary border-b border-bank-lightGrey"
            >
              Loans & EMI Calculator
            </Link>
            <Link
              href="/#charges"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-bank-textSecondary border-b border-bank-lightGrey"
            >
              Schedule of Charges
            </Link>
            <Link
              href="/assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-bank-blue font-bold border-b border-bank-lightGrey"
            >
              Launch Banking Assistant
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-bank-textSecondary"
            >
              Knowledge & Ops Portal
            </Link>
          </div>
        )}
      </header>

      {/* ── Main Page Content ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* ── Realistic Institutional Footer ───────────────────────────── */}
      <footer className="bg-bank-navy text-white text-xs border-t border-[#224466] mt-auto">
        <div className="banking-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Column 1: Brand & Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-bank-blue flex items-center justify-center text-white">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm tracking-tight text-white">APEX TRUST BANK</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Empowering customers with transparent financial knowledge, verified statutory policy retrieval, and zero-credential safe banking self-service.
              </p>
              <div className="text-[11px] text-slate-400">
                Official Regulatory Ingestion: Reserve Bank of India & NPCI Standards.
              </div>
            </div>

            {/* Column 2: Banking Services */}
            <div>
              <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] mb-3">
                Banking Guidance
              </h4>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li><Link href="/#services" className="hover:text-white">Savings & Current Accounts</Link></li>
                <li><Link href="/#tools" className="hover:text-white">Loan EMI Calculations</Link></li>
                <li><Link href="/#charges" className="hover:text-white">Schedule of Service Fees</Link></li>
                <li><Link href="/#payments" className="hover:text-white">UPI & Digital Payment Rules</Link></li>
                <li><Link href="/assistant" className="hover:text-white font-medium text-bank-teal">Interactive Banking Guide</Link></li>
              </ul>
            </div>

            {/* Column 3: Trust & Regulatory Standards */}
            <div>
              <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] mb-3">
                Security & Compliance
              </h4>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li>
                  <button
                    onClick={() => setActiveModal("security")}
                    className="hover:text-white text-left text-slate-300 cursor-pointer"
                  >
                    Security Protocol Safeguards
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("pii")}
                    className="hover:text-white text-left text-slate-300 cursor-pointer"
                  >
                    Zero-PII Data Retention Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("grounding")}
                    className="hover:text-white text-left text-slate-300 cursor-pointer"
                  >
                    Official Source Grounding & Attestation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("freeze")}
                    className="text-red-300 hover:text-white text-left cursor-pointer"
                  >
                    Emergency Payment Rail Lockout
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Customer Support & Grievance */}
            <div>
              <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] mb-3">
                Helpline & Grievance
              </h4>
              <div className="space-y-2 text-slate-300 text-[11px]">
                <div>
                  <span className="block text-slate-400">24×7 Customer Care:</span>
                  <a href="tel:18002026161" className="font-bold text-white hover:underline">1800 202 6161</a>
                </div>
                <div>
                  <span className="block text-slate-400">Cyber Crime National Portal:</span>
                  <span className="font-bold text-white">1930 / cybercrime.gov.in</span>
                </div>
                <div>
                  <span className="block text-slate-400">RBI Ombudsman Contact:</span>
                  <span className="font-bold text-white">14448 (cms.rbi.org.in)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar with Functional Security Protocol, Zero PII Policy & Source Grounding buttons */}
          <div className="pt-6 border-t border-[#224466] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              © {new Date().getFullYear()} Apex Trust BankAssist AI. Institutional banking information platform.
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={() => setActiveModal("security")}
                className="hover:text-white font-medium cursor-pointer transition-colors"
              >
                Security Protocol
              </button>
              <button
                onClick={() => setActiveModal("pii")}
                className="hover:text-white font-medium cursor-pointer transition-colors"
              >
                Zero PII Policy
              </button>
              <button
                onClick={() => setActiveModal("grounding")}
                className="hover:text-white font-medium cursor-pointer transition-colors"
              >
                Official Source Grounding
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Interactive Policy Modals */}
      <PolicyModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
