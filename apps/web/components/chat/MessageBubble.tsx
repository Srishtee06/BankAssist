"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Shield,
  User,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Clock,
  Key,
  ShieldCheck,
  AlertOctagon,
  Building2,
} from "lucide-react";
import { ChatMessage, Citation } from "@/types";
import { submitFeedbackApi } from "@/lib/api";

interface MessageBubbleProps {
  message: ChatMessage;
  onSelectCitation?: (citation: Citation) => void;
  onOpenAttestation?: (data: { hash: string; consensus: string; docTitle?: string }) => void;
  onOpenEmergencyFreeze?: () => void;
}

export function MessageBubble({
  message,
  onSelectCitation,
  onOpenAttestation,
  onOpenEmergencyFreeze,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleFeedback = async (isPositive: boolean) => {
    try {
      setFeedback(isPositive ? "up" : "down");
      await submitFeedbackApi({
        message_id: message.id,
        rating: isPositive ? 5 : 1,
        is_positive: isPositive,
      });
    } catch (e) {
      console.error("Feedback error:", e);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 my-4">
        <div className="max-w-[85%] sm:max-w-[70%]">
          <div className="bg-bank-navy text-white px-4 py-3 rounded-sm text-xs leading-relaxed font-normal shadow-xs">
            {message.content}
          </div>
          <div className="text-[10px] text-bank-textSecondary text-right mt-1 px-1">
            {message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
          </div>
        </div>
        <div className="w-7 h-7 rounded bg-bank-lightGrey border border-bank-border flex items-center justify-center shrink-0 text-bank-textSecondary text-xs">
          <User className="w-3.5 h-3.5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3 my-4">
      {/* Institutional Bank Assist Icon */}
      <div className="w-7 h-7 rounded bg-bank-blue flex items-center justify-center shrink-0 text-white shadow-xs">
        <Building2 className="w-4 h-4" />
      </div>

      <div className="max-w-[95%] sm:max-w-[85%] space-y-3">
        {/* Main Response Box: Clean White Surface */}
        <div className="bg-white p-4 sm:p-5 rounded-sm border border-bank-border text-bank-textPrimary text-xs leading-relaxed shadow-xs">
          {/* Active Coercion / Duress Banner */}
          {message.coercion_flag && (
            <div className="mb-4 p-3.5 rounded bg-bank-alertRedBg border border-bank-alertRed/40 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertOctagon className="w-4 h-4 text-bank-alertRed shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="font-bold text-bank-alertRed block mb-1">
                    Emergency Coercion Alert: Active Social Engineering Patterns Detected
                  </strong>
                  <p className="text-bank-textSecondary text-[11px] mb-2 leading-normal">
                    This inquiry reflects common high-pressure impersonation tactics (demands for rapid transfers, remote desktop installs, or fake legal threats).
                  </p>
                  <button
                    onClick={onOpenEmergencyFreeze}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bank-alertRed hover:bg-red-800 text-white font-bold text-xs rounded transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Emergency 1-Tap Payment Rail Freeze</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sensitive Credential Warning */}
          {message.security_notes?.credential_warning && !message.coercion_flag && (
            <div className="mb-3 p-3 rounded bg-bank-warningAmberBg border border-bank-warningAmber/40 flex items-start gap-2 text-xs text-bank-warningAmber">
              <AlertTriangle className="w-4 h-4 text-bank-warningAmber shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Security Advisory: Confidential Data Safeguard</strong>
                {message.security_notes.disclaimer || "Please never share confidential passwords, PIN, or OTP."}
              </div>
            </div>
          )}

          {/* Render Answer Markdown */}
          <div className="prose prose-sm max-w-none text-bank-textPrimary prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-bank-navy prose-strong:text-bank-navy prose-a:text-bank-blue hover:prose-a:underline">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Human Escalation / Case Routing Card */}
          {message.escalation_offer && (
            <div className="mt-4 p-3 rounded bg-bank-lightGrey border border-bank-border text-xs">
              <div className="flex items-center gap-2 text-bank-navy font-bold mb-1">
                <PhoneCall className="w-3.5 h-3.5 text-bank-blue" />
                <span>Customer Assistance Required: {message.escalation_offer.suggested_action}</span>
              </div>
              <p className="text-bank-textSecondary text-[11px] mb-2.5">{message.escalation_offer.reason}</p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${message.escalation_offer.support_phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-bank-blue hover:bg-bank-blueHover text-white rounded text-xs font-semibold transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call {message.escalation_offer.support_phone}</span>
                </a>
                {message.escalation_offer.branch_locator_url && (
                  <a
                    href={message.escalation_offer.branch_locator_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-bank-lightGrey text-bank-textPrimary rounded text-xs border border-bank-border font-medium transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-bank-textSecondary" />
                    <span>Official Branch Locator</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Verified Official Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-4 pt-3 border-t border-bank-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-bank-navy">
                  <CheckCircle2 className="w-3.5 h-3.5 text-bank-teal" />
                  <span>Verified Regulatory Sources ({message.citations.length}):</span>
                </div>
                {message.attestation_hash && (
                  <button
                    onClick={() =>
                      onOpenAttestation &&
                      onOpenAttestation({
                        hash: message.attestation_hash || "",
                        consensus: message.consensus_verdict || "Dual-Agent Verified",
                        docTitle: message.citations?.[0]?.title,
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-bank-blue hover:underline"
                  >
                    <Key className="w-3 h-3" />
                    <span>Proof-of-Policy Receipt</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {message.citations.map((c, idx) => (
                  <button
                    key={c.chunk_id || idx}
                    onClick={() => onSelectCitation && onSelectCitation(c)}
                    className="text-left text-xs px-2.5 py-1.5 rounded bg-bank-lightGrey hover:bg-slate-200 border border-bank-border text-bank-textPrimary transition-all flex items-center gap-2 group"
                  >
                    <span className="w-4 h-4 rounded bg-bank-blue text-white flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[200px] font-medium text-bank-navy">{c.title}</span>
                    <ExternalLink className="w-3 h-3 text-bank-textSecondary group-hover:text-bank-blue" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta & Audit Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-bank-textSecondary">
          <div className="flex items-center gap-2">
            {message.intent && (
              <span className="px-2 py-0.5 rounded bg-bank-lightGrey text-bank-textPrimary border border-bank-border font-medium text-[10px]">
                {message.intent}
              </span>
            )}
            <span className="flex items-center gap-1 text-bank-teal font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>Consensus Audited</span>
            </span>
            {message.latency_ms !== undefined && (
              <span className="flex items-center gap-1 text-bank-textSecondary">
                <Clock className="w-3 h-3" />
                {message.latency_ms}ms
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback(true)}
              className={`p-1 rounded hover:bg-bank-lightGrey transition-colors ${
                feedback === "up" ? "text-bank-teal font-bold" : "text-bank-textSecondary hover:text-bank-textPrimary"
              }`}
              title="Helpful response"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className={`p-1 rounded hover:bg-bank-lightGrey transition-colors ${
                feedback === "down" ? "text-bank-alertRed font-bold" : "text-bank-textSecondary hover:text-bank-textPrimary"
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
