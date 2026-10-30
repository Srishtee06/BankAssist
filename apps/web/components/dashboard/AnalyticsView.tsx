"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  ShieldAlert,
  Clock,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { AnalyticsSummary } from "@/types";
import { fetchAnalyticsApi } from "@/lib/api";

export function AnalyticsView() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsApi()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const intentData = [
    { name: "Digital Payments", count: 48 },
    { name: "Loan & EMI", count: 35 },
    { name: "Fees & Charges", count: 28 },
    { name: "Account Inquiries", count: 22 },
    { name: "Fraud/Security", count: 14 },
    { name: "Financial Literacy", count: 18 },
  ];

  const riskPieData = [
    { name: "Standard Information", value: 72, color: "#15803D" },
    { name: "Regulatory Caveats", value: 20, color: "#B45309" },
    { name: "High Sensitivity", value: 6, color: "#EA580C" },
    { name: "Emergency Escalated", value: 2, color: "#B91C1C" },
  ];

  return (
    <div className="space-y-6 text-bank-textPrimary">
      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="banking-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-bank-textSecondary uppercase tracking-wider">
              Total Inquiries Handled
            </span>
            <div className="p-2 rounded bg-bank-lightGrey text-bank-blue">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-bank-navy">165</span>
            <span className="text-xs text-bank-teal font-semibold">+14% this week</span>
          </div>
        </div>

        <div className="banking-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-bank-textSecondary uppercase tracking-wider">
              Avg Processing Latency
            </span>
            <div className="p-2 rounded bg-bank-lightGrey text-bank-navy">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-bank-navy">340 ms</span>
            <span className="text-xs text-bank-teal font-semibold">Sub-second SLA</span>
          </div>
        </div>

        <div className="banking-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-bank-textSecondary uppercase tracking-wider">
              Grounded Citation Rate
            </span>
            <div className="p-2 rounded bg-bank-lightGrey text-bank-teal">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-bank-navy">99.4%</span>
            <span className="text-xs text-bank-textSecondary">Regulatory backed</span>
          </div>
        </div>

        <div className="banking-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-bank-textSecondary uppercase tracking-wider">
              Security Interceptions
            </span>
            <div className="p-2 rounded bg-bank-alertRedBg text-bank-alertRed">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-bank-navy">18</span>
            <span className="text-xs text-bank-alertRed font-semibold">Zero credentials leaked</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intent Distribution Bar Chart */}
        <div className="lg:col-span-2 banking-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-bank-border">
            <div>
              <h3 className="text-sm font-bold text-bank-navy">Customer Intent Frequency</h3>
              <p className="text-xs text-bank-textSecondary">Inquiry volume across banking subject domains</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-bank-lightGrey text-bank-navy rounded border border-bank-border font-medium">
              Last 30 Days
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E5E9" />
                <XAxis dataKey="name" stroke="#687581" fontSize={11} tickLine={false} />
                <YAxis stroke="#687581" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E0E5E9", borderRadius: "4px", fontSize: "12px", color: "#202A34" }}
                />
                <Bar dataKey="count" fill="#1B5E8A" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="banking-card p-5 flex flex-col">
          <div className="mb-4 pb-2 border-b border-bank-border">
            <h3 className="text-sm font-bold text-bank-navy">Risk Assessment Breakdown</h3>
            <p className="text-xs text-bank-textSecondary">Queries categorised by detected risk tier</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E0E5E9", borderRadius: "4px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5 text-xs text-bank-textSecondary">
            {riskPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-bold text-bank-navy">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
