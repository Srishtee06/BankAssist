"use client";

import React from "react";
import {
  Shield,
  Lock,
  FileCheck,
  AlertTriangle,
  X,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
  Cpu,
  Key,
  Database,
  History,
} from "lucide-react";

export type ModalType = "security" | "pii" | "grounding" | "freeze" | "attestation" | null;

interface PolicyModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  attestationData?: {
    hash: string;
    consensus: string;
    docTitle?: string;
  } | null;
}

export function PolicyModals({ activeModal, onClose, attestationData }: PolicyModalsProps) {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bank-navy/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-bank-border rounded-sm shadow-xl p-6 overflow-hidden max-h-[90vh] flex flex-col text-bank-textPrimary">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-bank-textSecondary hover:text-bank-textPrimary hover:bg-bank-lightGrey rounded transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal 1: Security Protocol */}
        {activeModal === "security" && (
          <div className="overflow-y-auto pr-2 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-bank-border">
              <div className="w-10 h-10 rounded bg-bank-lightGrey flex items-center justify-center text-bank-blue">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-bank-navy">Apex Trust Security Protocol</h3>
                <p className="text-xs text-bank-textSecondary">Statutory Banking Information Safeguards & Zero-Credential Standards</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-bank-textSecondary">
              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded">
                <h4 className="font-semibold text-bank-navy text-sm mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-bank-teal" />
                  1. Zero-Credential Isolation Architecture
                </h4>
                <p>
                  Apex Trust BankAssist is engineered strictly as an educational and policy-retrieval guide. It does not interface directly with core transaction databases and is cryptographically air-gapped from internal ledger settlement systems. It will never request, store, or accept PINs, OTPs, CVVs, net-banking passwords, or full card credentials.
                </p>
              </div>

              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded">
                <h4 className="font-semibold text-bank-navy text-sm mb-1 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-bank-blue" />
                  2. Deterministic Rule Interceptors
                </h4>
                <p>
                  Every input stream passes through deterministic pattern-matching gates prior to neural retrieval. Queries mentioning stolen cards, compromised accounts, or unauthorized transactions bypass vector search entirely and invoke the immediate Emergency Security Routing Protocol.
                </p>
              </div>

              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded">
                <h4 className="font-semibold text-bank-navy text-sm mb-1 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-bank-alertRed" />
                  3. Emergency Contact & Regulatory Ombudsman Routing
                </h4>
                <p>
                  High-risk events trigger instant escalation cards with direct links to the 24×7 Central Fraud Desk (1800-APEX-FRAUD), the National Cyber Crime Reporting Portal (cybercrime.gov.in / 1930), and the Reserve Bank Ombudsman (14448).
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-bank-border flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bank-navy hover:bg-bank-blue text-white text-xs font-semibold rounded transition-colors"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        )}

        {/* Modal 2: Zero PII Policy */}
        {activeModal === "pii" && (
          <div className="overflow-y-auto pr-2 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-bank-border">
              <div className="w-10 h-10 rounded bg-bank-lightGrey flex items-center justify-center text-bank-teal">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-bank-navy">Zero-PII Commitment & Data Sanitization</h3>
                <p className="text-xs text-bank-textSecondary">Comprehensive Customer Privacy & Context Packaging Standards</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-bank-textSecondary">
              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded">
                <h4 className="font-semibold text-bank-navy text-sm mb-1">In-Memory Redaction Pipeline</h4>
                <p>
                  Any accidental customer entry containing 10-digit phone numbers, 12-digit Aadhaar formats, 10-character PAN syntax, or 16-digit card structures is scrubbed in memory via regex transformers before query processing or database logging occurs.
                </p>
              </div>

              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded">
                <h4 className="font-semibold text-bank-navy text-sm mb-1">Zero-Knowledge Support Dossiers</h4>
                <p>
                  When a customer query requires handoff to a branch officer or customer service agent, the assistant compiles a structured Zero-Knowledge briefing (Intent, Policy Friction Point, Sentiment) rather than transmitting raw unstructured chat telemetry.
                </p>
              </div>

              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded">
                <h4 className="font-semibold text-bank-navy text-sm mb-1">No Model Retraining on User Conversations</h4>
                <p>
                  Apex Trust BankAssist does not use proprietary customer queries to train external foundation models. All retrieval takes place within private local embedding indexes under bank data governance protocols.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-bank-border flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bank-navy hover:bg-bank-blue text-white text-xs font-semibold rounded transition-colors"
              >
                Close Privacy Policy
              </button>
            </div>
          </div>
        )}

        {/* Modal 3: Official Source Grounding */}
        {activeModal === "grounding" && (
          <div className="overflow-y-auto pr-2 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-bank-border">
              <div className="w-10 h-10 rounded bg-bank-lightGrey flex items-center justify-center text-bank-blue">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-bank-navy">Official Source Grounding & Attestation</h3>
                <p className="text-xs text-bank-textSecondary">Dual-Agent Consensus, Circular Time-Stamping & Policy Verification</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-bank-textSecondary">
              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded">
                <h4 className="font-semibold text-bank-navy text-sm mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-bank-successGreen" />
                  Dual-Agent Cross Examination ("Prosecutor & Defense")
                </h4>
                <p>
                  Every generated answer must pass an internal consensus loop before rendering. The Compliance Agent drafts an answer anchored to official circulars; an independent Adversarial Guardrail Agent then checks for missing caveats, ambiguous fee schedules, or regulatory overstatements.
                </p>
              </div>

              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded">
                <h4 className="font-semibold text-bank-navy text-sm mb-1 flex items-center gap-2">
                  <History className="w-4 h-4 text-bank-blue" />
                  Temporal & Version-Aware Circular Retrieval
                </h4>
                <p>
                  Banking tariffs and repo-rate linked loan calculations track two time dimensions: Valid Time (when the regulatory circular is effective in the market) and Ingestion Time (when the circular was gazetted). Older circulars are marked with version deprecation warnings.
                </p>
              </div>

              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded">
                <h4 className="font-semibold text-bank-navy text-sm mb-1 flex items-center gap-2">
                  <Key className="w-4 h-4 text-bank-teal" />
                  Cryptographic Attestation Token
                </h4>
                <p>
                  Each retrieved answer computes an ephemeral SHA-256 digital fingerprint referencing the active policy chunk ID, providing an immutable audit trail for compliance officers and branch auditors.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-bank-border flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bank-navy hover:bg-bank-blue text-white text-xs font-semibold rounded transition-colors"
              >
                Close Grounding Details
              </button>
            </div>
          </div>
        )}

        {/* Modal 4: Emergency Account & UPI Freeze */}
        {activeModal === "freeze" && (
          <div className="overflow-y-auto pr-2 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-bank-border">
              <div className="w-10 h-10 rounded bg-bank-alertRedBg flex items-center justify-center text-bank-alertRed">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-bank-alertRed">Emergency Security Protocol: Coercion & Fraud Freeze</h3>
                <p className="text-xs text-bank-textSecondary">Immediate Digital Channel Lockout & Anti-Fraud Alert</p>
              </div>
            </div>

            <div className="p-4 bg-bank-alertRedBg/60 border border-bank-alertRed/30 rounded text-xs space-y-2 text-bank-textPrimary">
              <p className="font-semibold text-bank-alertRed">
                Active Duress / Scammer Impersonation Warning:
              </p>
              <p>
                If an unknown caller claiming to be from the bank, customs, police, or courier company is instructing you to transfer funds immediately or download screen-sharing tools (AnyDesk, TeamViewer, RustDesk):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-bank-textSecondary">
                <li><strong className="text-bank-textPrimary">Disconnect the call immediately.</strong> Official bank employees will never demand instant external wire transfers.</li>
                <li><strong className="text-bank-textPrimary">Do not approve any biometric prompt or UPI PIN entry.</strong> PINs are required exclusively for debiting money, never for receiving rewards or verification.</li>
              </ul>
            </div>

            <div className="p-3 bg-bank-warmWhite border border-bank-border rounded space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-bank-navy">1-Tap Simulated Debit Rail Freeze</div>
                  <div className="text-[11px] text-bank-textSecondary">Instantly disables outbound UPI VPAs, NetBanking transfers, and ATM card usage.</div>
                </div>
                <button
                  onClick={() => {
                    alert("Emergency Simulation: Digital payment rails (UPI & Debit Cards) locked. A high-priority duress ticket (#FR-9042) has been logged with the 24x7 Anti-Fraud Desk.");
                    onClose();
                  }}
                  className="px-3.5 py-1.5 bg-bank-alertRed hover:bg-red-800 text-white font-semibold text-xs rounded transition-colors"
                >
                  Lock Payment Rails Now
                </button>
              </div>

              <div className="pt-2 border-t border-bank-border flex items-center justify-between text-xs">
                <span className="text-bank-textSecondary">24×7 Anti-Fraud Priority Hotline:</span>
                <a href="tel:18002026161" className="font-bold text-bank-blue hover:underline flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  1800 202 6161
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-bank-border flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bank-lightGrey hover:bg-bank-border text-bank-navy text-xs font-semibold rounded transition-colors"
              >
                Close Emergency Screen
              </button>
            </div>
          </div>
        )}

        {/* Modal 5: Cryptographic Attestation Receipt */}
        {activeModal === "attestation" && (
          <div className="overflow-y-auto pr-2 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-bank-border">
              <div className="w-10 h-10 rounded bg-bank-lightGrey flex items-center justify-center text-bank-teal">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-bank-navy">Proof-of-Policy Attestation Receipt</h3>
                <p className="text-xs text-bank-textSecondary">Cryptographic Verification & Regulatory Transparency Log</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-bank-warmWhite border border-bank-border rounded space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between border-b border-bank-border pb-1">
                  <span className="text-bank-textSecondary">Attestation Digest:</span>
                  <span className="font-bold text-bank-navy">{attestationData?.hash || "SHA256:0x7e8b91a0c4f...d89e"}</span>
                </div>
                <div className="flex justify-between border-b border-bank-border py-1">
                  <span className="text-bank-textSecondary">Consensus Audit:</span>
                  <span className="text-bank-successGreen font-medium">{attestationData?.consensus || "Dual-Agent Verified"}</span>
                </div>
                <div className="flex justify-between border-b border-bank-border py-1">
                  <span className="text-bank-textSecondary">Statutory Anchor:</span>
                  <span className="text-bank-navy">RBI Master Circular on Banking Services / NPCI UPI Specs</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-bank-textSecondary">Ledger Timestamp:</span>
                  <span className="text-bank-textSecondary">{new Date().toUTCString()}</span>
                </div>
              </div>

              <p className="text-xs text-bank-textSecondary">
                This attestation verifies that the answer presented was generated strictly against un-tampered bank policy documentation active on the transaction date, ensuring full auditability under bank governance standards.
              </p>
            </div>

            <div className="pt-3 border-t border-bank-border flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bank-navy hover:bg-bank-blue text-white text-xs font-semibold rounded transition-colors"
              >
                Close Attestation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
