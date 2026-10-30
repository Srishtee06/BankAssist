import React from "react";
import { Lock, ShieldAlert, AlertTriangle, EyeOff } from "lucide-react";

interface SecurityBannerProps {
  onOpenSecurity?: () => void;
  onOpenPii?: () => void;
}

export function SecurityBanner({ onOpenSecurity, onOpenPii }: SecurityBannerProps) {
  return (
    <div className="bg-bank-warmWhite border border-bank-border px-4 py-2.5 text-xs text-bank-textSecondary rounded-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-bank-navy shrink-0" />
          <span className="font-bold text-bank-navy">Zero-Credential Advisory:</span>
          <span>Never disclose PIN, OTP, CVV, or passwords. Apex Trust Bank will never request these via chat.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={onOpenSecurity}
            className="text-bank-blue hover:underline font-semibold"
          >
            Security Safeguards
          </button>
          <span className="text-bank-border">|</span>
          <button
            onClick={onOpenPii}
            className="text-bank-blue hover:underline font-semibold"
          >
            Data Privacy Standards
          </button>
        </div>
      </div>
    </div>
  );
}
