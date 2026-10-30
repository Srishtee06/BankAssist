"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";
import { DocumentItem } from "@/types";
import { fetchDocumentsApi } from "@/lib/api";

const SAMPLE_DOCS: DocumentItem[] = [
  {
    id: "doc-upi-001",
    title: "UPI Safety & Digital Payment Consumer Awareness Guidelines",
    issuing_organization: "National Payments Corporation of India (NPCI)",
    jurisdiction: "India",
    product_category: "PAYMENTS",
    effective_date: "01-01-2024",
    version: "v2.4",
    status: "PUBLISHED",
    created_at: "2024-01-15T00:00:00Z",
    chunk_count: 8,
  },
  {
    id: "doc-emi-002",
    title: "Understanding EMI, Loan Repayment & Actuarial Schedules",
    issuing_organization: "Retail Lending Regulatory Desk",
    jurisdiction: "India",
    product_category: "LOANS",
    effective_date: "15-02-2024",
    version: "v1.8",
    status: "PUBLISHED",
    created_at: "2024-02-20T00:00:00Z",
    chunk_count: 12,
  },
  {
    id: "doc-fees-003",
    title: "Master Tariff Schedule: Account Maintenance & Transaction Fees",
    issuing_organization: "Apex Trust Operations Board",
    jurisdiction: "Global/India",
    product_category: "ACCOUNTS",
    effective_date: "01-04-2024",
    version: "v3.1",
    status: "PUBLISHED",
    created_at: "2024-04-05T00:00:00Z",
    chunk_count: 6,
  },
  {
    id: "doc-fraud-004",
    title: "Customer Protection: Limiting Liability in Unauthorized Electronic Banking Transactions",
    issuing_organization: "Reserve Bank of India (RBI)",
    jurisdiction: "India",
    product_category: "SECURITY",
    effective_date: "10-11-2023",
    version: "v2.0",
    status: "PUBLISHED",
    created_at: "2023-11-15T00:00:00Z",
    chunk_count: 10,
  },
];

export function DocumentsView() {
  const [docs, setDocs] = useState<DocumentItem[]>(SAMPLE_DOCS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    fetchDocumentsApi()
      .then((data) => {
        if (data && data.length > 0) setDocs(data);
      })
      .catch((e) => console.error(e));
  }, []);

  const filteredDocs = docs.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.issuing_organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || d.product_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-bank-textPrimary">
      {/* Top Search & Filter Bar */}
      <div className="banking-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-bank-textSecondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search policy titles, gazettes, authorities..."
              className="w-full bg-bank-warmWhite border border-bank-border rounded pl-9 pr-4 py-2 text-xs text-bank-textPrimary placeholder-bank-textSecondary focus:outline-none focus:border-bank-blue focus:bg-white"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-bank-warmWhite border border-bank-border text-bank-textPrimary rounded px-3 py-2 text-xs focus:outline-none focus:border-bank-blue"
          >
            <option value="ALL">All Categories</option>
            <option value="PAYMENTS">Payments</option>
            <option value="LOANS">Loans</option>
            <option value="ACCOUNTS">Accounts</option>
            <option value="SECURITY">Security</option>
          </select>
        </div>

        <button
          onClick={() => alert("Ingestion Pipeline: Document uploaded to compliance parsing stage. Vector embeddings generated and indexed.")}
          className="flex items-center gap-2 px-4 py-2 bg-bank-navy hover:bg-bank-blue text-white rounded text-xs font-semibold transition-all shrink-0 w-full sm:w-auto justify-center"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Ingest Policy Circular</span>
        </button>
      </div>

      {/* Documents Table */}
      <div className="banking-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-bank-lightGrey border-b border-bank-border text-bank-textSecondary uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Document Title & Record ID</th>
                <th className="px-4 py-3.5">Issuing Authority</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Jurisdiction</th>
                <th className="px-4 py-3.5">Effective Date</th>
                <th className="px-4 py-3.5">Vector Chunks</th>
                <th className="px-5 py-3.5 text-right">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bank-border text-bank-textPrimary">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-bank-warmWhite transition-colors">
                  <td className="px-5 py-4 font-medium text-bank-navy flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-bank-lightGrey border border-bank-border flex items-center justify-center text-bank-blue shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-bold truncate max-w-xs">{doc.title}</span>
                      <span className="text-[10px] text-bank-textSecondary font-mono">{doc.id} • {doc.version}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-bank-textSecondary">{doc.issuing_organization}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded bg-bank-lightGrey text-bank-textPrimary border border-bank-border text-[10px] font-semibold">
                      {doc.product_category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-bank-textSecondary">{doc.jurisdiction}</td>
                  <td className="px-4 py-4 text-bank-textSecondary">{doc.effective_date || "Current"}</td>
                  <td className="px-4 py-4 font-mono text-bank-blue font-semibold">{doc.chunk_count || 1} chunks</td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-bank-successGreenBg text-bank-successGreen border border-bank-successGreen/40 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{doc.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
