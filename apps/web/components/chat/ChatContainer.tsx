"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Building2,
  Filter,
  PlusCircle,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCheck,
  Search,
} from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { CitationModal } from "./CitationModal";
import { SecurityBanner } from "./SecurityBanner";
import { PolicyModals, ModalType } from "@/components/modals/PolicyModals";
import { ChatMessage, Citation } from "@/types";
import { sendMessageApi } from "@/lib/api";

const STARTER_PROMPTS = [
  {
    title: "UPI PIN Safety",
    prompt: "Someone asked for my UPI PIN to receive a prize or cashback. Is that safe?",
    category: "Digital Payments",
  },
  {
    title: "Loan EMI Calculation",
    prompt: "How is loan EMI calculated and what components make up the monthly payment?",
    category: "Loans & Borrowing",
  },
  {
    title: "Savings Account Minimum Balance",
    prompt: "What are the rules and charges if minimum balance in a savings account is not maintained?",
    category: "Accounts & Fees",
  },
  {
    title: "Unauthorized Deduction",
    prompt: "Money was deducted from my account without an OTP. What steps must I take immediately?",
    category: "Fraud & Security",
  },
];

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [jurisdiction, setJurisdiction] = useState<string>("IN");
  const [productCategory, setProductCategory] = useState<string>("ALL");
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  // Policy Modals state
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [attestationData, setAttestationData] = useState<{
    hash: string;
    consensus: string;
    docTitle?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const initialQuery = params.get("q");
      if (initialQuery && messages.length === 0 && !loading) {
        handleSend(initialQuery);
      }
    }
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: query.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessageApi({
        message: query.trim(),
        conversation_id: conversationId || undefined,
        jurisdiction: jurisdiction === "ALL" ? undefined : jurisdiction,
        product_category: productCategory === "ALL" ? undefined : productCategory,
      });

      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: `**Service Advisory**: ${err?.message || "Unable to reach the BankAssist security backend. Please verify your connection."}`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(""); // Reset to empty string so backend generates clean new ID
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full px-4 sm:px-6 py-4">
      {/* Institutional Security Notice */}
      <div className="mb-3">
        <SecurityBanner
          onOpenSecurity={() => setActiveModal("security")}
          onOpenPii={() => setActiveModal("pii")}
        />
      </div>

      {/* Main Conversation Container: Clean Bank Workstation */}
      <div className="flex-1 flex flex-col bg-white border border-bank-border rounded-sm shadow-xs overflow-hidden relative">
        {/* Navigation & Scope Filter Bar */}
        <div className="px-5 py-3 border-b border-bank-border bg-bank-lightGrey flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-bank-navy flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-bank-blue" />
              <span>Apex Trust Banking Guide</span>
            </span>
            <span className="text-bank-border">|</span>
            <span className="text-bank-textSecondary flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-bank-mutedBlue" />
              <span>Scope:</span>
            </span>

            {/* Jurisdiction Select */}
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="bg-white border border-bank-border text-bank-textPrimary rounded px-2.5 py-1 text-xs focus:outline-none focus:border-bank-blue"
            >
              <option value="ALL">All Jurisdictions</option>
              <option value="IN">Reserve Bank of India (RBI) Regulations</option>
              <option value="US">Federal Reserve / CFPB Standards</option>
              <option value="UK">FCA Banking Regulations</option>
            </select>

            {/* Category Select */}
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="bg-white border border-bank-border text-bank-textPrimary rounded px-2.5 py-1 text-xs focus:outline-none focus:border-bank-blue hidden sm:block"
            >
              <option value="ALL">All Banking Services</option>
              <option value="PAYMENTS">Digital Payments & UPI</option>
              <option value="LOANS">Loans, Mortgages & EMI</option>
              <option value="ACCOUNTS">Savings & Current Accounts</option>
              <option value="SECURITY">Security & Anti-Fraud</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startNewChat}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-white hover:bg-bank-warmWhite text-bank-textPrimary border border-bank-border font-medium transition-colors text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-bank-blue" />
              <span>New Inquiry</span>
            </button>
          </div>
        </div>

        {/* Message Thread Surface */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-bank-warmWhite">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-8">
              <div className="w-12 h-12 rounded bg-bank-navy text-white flex items-center justify-center mb-3 shadow-xs">
                <Building2 className="w-6 h-6 text-bank-teal" />
              </div>
              <h2 className="text-xl font-bold text-bank-navy mb-1">
                Apex Trust Banking Information Assistant
              </h2>
              <p className="text-xs text-bank-textSecondary mb-6 leading-relaxed max-w-md">
                Search verified policies, calculate loan EMIs, understand schedule of charges, or learn official digital payment dispute procedures.
              </p>

              {/* Starter Question Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {STARTER_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p.prompt)}
                    className="p-3.5 rounded bg-white hover:bg-bank-lightGrey border border-bank-border hover:border-bank-blue text-xs transition-all group"
                  >
                    <div className="text-[10px] font-bold text-bank-blue uppercase tracking-wider mb-1">
                      {p.category}
                    </div>
                    <div className="text-bank-textPrimary font-medium group-hover:text-bank-navy leading-snug">
                      {p.prompt}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                onSelectCitation={(c) => setSelectedCitation(c)}
                onOpenAttestation={(data) => {
                  setAttestationData(data);
                  setActiveModal("attestation");
                }}
                onOpenEmergencyFreeze={() => setActiveModal("freeze")}
              />
            ))
          )}

          {/* Verification / Loading indicator */}
          {loading && (
            <div className="flex items-center gap-3 my-3">
              <div className="w-7 h-7 rounded bg-bank-lightGrey border border-bank-border flex items-center justify-center text-bank-blue text-xs">
                <Building2 className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-white px-4 py-2.5 rounded border border-bank-border text-xs text-bank-textSecondary flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-bank-teal animate-pulse" />
                <span>Cross-checking official regulatory circulars & dual-agent consensus...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Query Input Dock */}
        <div className="p-4 border-t border-bank-border bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about interest rates, EMI calculations, minimum balance rules, or UPI safety..."
                disabled={loading}
                className="w-full bg-bank-warmWhite border border-bank-border rounded px-4 py-2.5 text-xs text-bank-textPrimary placeholder-bank-textSecondary focus:outline-none focus:border-bank-blue focus:bg-white transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 bg-bank-navy hover:bg-bank-blue disabled:opacity-40 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors flex items-center gap-2 text-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Guide</span>
            </button>
          </form>

          {/* Institutional Compliance Disclaimer */}
          <div className="mt-2.5 text-center text-[10px] text-bank-textSecondary flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-bank-mutedBlue shrink-0" />
            <span>
              BankAssist AI provides educational guidance based on official gazetted policies. This does not constitute personalized financial or legal advice.
            </span>
          </div>
        </div>
      </div>

      {/* Citation Inspector Modal */}
      <CitationModal
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Policy & Security Modals */}
      <PolicyModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        attestationData={attestationData}
      />
    </div>
  );
}
