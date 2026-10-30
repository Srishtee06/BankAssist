"use client";

import React, { useState } from "react";
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";
import { DocumentsView } from "@/components/dashboard/DocumentsView";
import { BarChart3, BookOpen, Building2, ShieldCheck, Database } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "documents">("analytics");

  return (
    <div className="flex-1 banking-container py-8 space-y-6">
      {/* Dashboard Institutional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-bank-border">
        <div>
          <div className="flex items-center gap-2 text-bank-navy">
            <Building2 className="w-5 h-5 text-bank-blue" />
            <h1 className="text-xl font-bold tracking-tight">
              Apex Trust Operations & Policy Governance Portal
            </h1>
          </div>
          <p className="text-xs text-bank-textSecondary mt-1">
            Real-time inspection of customer inquiry volumes, intent distribution, safety interceptions, and vector knowledge repositories.
          </p>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center gap-1 p-1 bg-bank-lightGrey border border-bank-border rounded">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "analytics"
                ? "bg-bank-navy text-white shadow-xs"
                : "text-bank-textSecondary hover:text-bank-textPrimary"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Operational Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "documents"
                ? "bg-bank-navy text-white shadow-xs"
                : "text-bank-textSecondary hover:text-bank-textPrimary"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Policy Document Library</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "analytics" ? <AnalyticsView /> : <DocumentsView />}
    </div>
  );
}
