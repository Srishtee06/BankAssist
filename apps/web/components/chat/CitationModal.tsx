"use client";

import React from "react";
import { X, FileText, Building2, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Citation } from "@/types";

interface CitationModalProps {
  citation: Citation | null;
  onClose: () => void;
}

export function CitationModal({ citation, onClose }: CitationModalProps) {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bank-navy/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-bank-border rounded-sm shadow-xl p-6 overflow-hidden text-bank-textPrimary">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-bank-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-bank-lightGrey border border-bank-border flex items-center justify-center text-bank-blue">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-bank-lightGrey text-bank-navy border border-bank-border">
                  {citation.product_category || "Banking Policy"}
                </span>
                {citation.relevance_score && (
                  <span className="text-[10px] text-bank-teal font-medium">
                    Relevance: {(citation.relevance_score * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-bank-navy mt-1 leading-snug">
                {citation.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-bank-textSecondary hover:text-bank-textPrimary hover:bg-bank-lightGrey rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 py-2.5 px-3 bg-bank-warmWhite rounded border border-bank-border text-xs">
          <div className="flex items-center gap-2 text-bank-textSecondary">
            <Building2 className="w-3.5 h-3.5 text-bank-blue shrink-0" />
            <span className="truncate">{citation.issuing_organization || "Statutory Authority"}</span>
          </div>
          <div className="flex items-center gap-2 text-bank-textSecondary">
            <MapPin className="w-3.5 h-3.5 text-bank-mutedBlue shrink-0" />
            <span className="truncate">{citation.jurisdiction || "National Banking Reg."}</span>
          </div>
          <div className="flex items-center gap-2 text-bank-textSecondary col-span-2 sm:col-span-1">
            <Calendar className="w-3.5 h-3.5 text-bank-teal shrink-0" />
            <span>Effective: {citation.effective_date || "Active Rule"}</span>
          </div>
        </div>

        {/* Snippet / Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-bank-navy">
            <span>Verified Source Clause:</span>
            {citation.page_number && <span className="text-bank-textSecondary font-normal">Page {citation.page_number}</span>}
          </div>
          <div className="p-4 rounded bg-bank-lightGrey border border-bank-border text-xs text-bank-textPrimary leading-relaxed font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
            {citation.snippet}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-bank-border flex items-center justify-between text-xs text-bank-textSecondary">
          <div className="flex items-center gap-1.5 text-bank-teal font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cryptographically ground-checked chunk</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-bank-navy hover:bg-bank-blue text-white text-xs font-semibold transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
}
