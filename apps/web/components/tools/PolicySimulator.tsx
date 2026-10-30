"use client";

import React, { useState } from "react";
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Layers,
} from "lucide-react";

export function PolicySimulator() {
  const [tab, setTab] = useState<"emi" | "amb" | "rails">("emi");

  // 1. EMI Calculator state
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  // EMI Formula: [P * r * (1+r)^n] / [(1+r)^n - 1]
  const calculateEmi = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) {
      const e = Math.round(p / n);
      return { monthlyEmi: e, totalPayment: p, totalInterest: 0 };
    }
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return {
      monthlyEmi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  };

  const emiResults = calculateEmi();

  // 2. AMB Shortfall Simulator state
  const [branchTier, setBranchTier] = useState<"metro" | "urban" | "rural">("metro");
  const [currentAmb, setCurrentAmb] = useState<number>(6200);

  const getAmbThresholds = () => {
    switch (branchTier) {
      case "metro":
        return { required: 10000, penalty: currentAmb < 5000 ? 150 : currentAmb < 10000 ? 100 : 0 };
      case "urban":
        return { required: 5000, penalty: currentAmb < 2500 ? 100 : currentAmb < 5000 ? 75 : 0 };
      case "rural":
        return { required: 2500, penalty: currentAmb < 1000 ? 50 : currentAmb < 2500 ? 40 : 0 };
    }
  };

  const ambStatus = getAmbThresholds();
  const shortfall = Math.max(0, ambStatus.required - currentAmb);

  return (
    <div className="bg-white border border-bank-border rounded-sm shadow-xs overflow-hidden">
      {/* Tool Header */}
      <div className="bg-bank-navy text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-bank-teal" />
            <span>Banking Decision Tools & Deterministic Calculators</span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Neuro-Symbolic Policy-as-Code calculations and "What-If" counterfactual scenario modeling.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-[#12273d] p-1 rounded">
          <button
            onClick={() => setTab("emi")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              tab === "emi" ? "bg-bank-blue text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Loan EMI Calculator
          </button>
          <button
            onClick={() => setTab("amb")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              tab === "amb" ? "bg-bank-blue text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            "What-If" Fee Simulator
          </button>
          <button
            onClick={() => setTab("rails")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              tab === "rails" ? "bg-bank-blue text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Payment Rails Matrix
          </button>
        </div>
      </div>

      {/* Tab 1: Loan EMI Calculator */}
      {tab === "emi" && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 text-bank-textPrimary">
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-bank-textSecondary">Loan Amount:</span>
                <span className="text-bank-navy font-bold">₹{loanAmount.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="25000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-bank-blue cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-bank-textSecondary mt-1">
                <span>₹50K</span>
                <span>₹25 Lakh</span>
                <span>₹50 Lakh</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-bank-textSecondary">Interest Rate (Annual %):</span>
                <span className="text-bank-navy font-bold">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="6.5"
                max="18"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-bank-blue cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-bank-textSecondary mt-1">
                <span>6.5%</span>
                <span>12%</span>
                <span>18%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-bank-textSecondary">Loan Tenure:</span>
                <span className="text-bank-navy font-bold">{tenureYears} Years ({tenureYears * 12} Months)</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-bank-blue cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-bank-textSecondary mt-1">
                <span>1 Year</span>
                <span>10 Years</span>
                <span>25 Years</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-bank-lightGrey p-5 rounded border border-bank-border flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase text-bank-mutedBlue tracking-wide block">
                Calculated Monthly Installment
              </span>
              <div className="text-3xl font-extrabold text-bank-navy mt-1">
                ₹{emiResults.monthlyEmi.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-bank-textSecondary"> / month</span>
              </div>

              <div className="mt-5 space-y-2.5 pt-4 border-t border-bank-border text-xs">
                <div className="flex justify-between">
                  <span className="text-bank-textSecondary">Principal Loan Amount:</span>
                  <span className="font-semibold text-bank-textPrimary">₹{loanAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bank-textSecondary">Total Interest Payable:</span>
                  <span className="font-semibold text-bank-textPrimary">₹{emiResults.totalInterest.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bank-textSecondary">Total Amount Paid:</span>
                  <span className="font-semibold text-bank-navy">₹{emiResults.totalPayment.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-bank-border text-[11px] text-bank-textSecondary flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-bank-teal shrink-0" />
              <span>Policy-as-Code verified against standard reducing-balance actuarial schedules.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: "What-If" Counterfactual Fee Simulator */}
      {tab === "amb" && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 text-bank-textPrimary">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-bank-textSecondary block mb-1">
                Branch Location Tier:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(["metro", "urban", "rural"] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setBranchTier(tier)}
                    className={`py-2 px-3 border rounded text-center capitalize font-medium transition-colors ${
                      branchTier === tier
                        ? "bg-bank-navy text-white border-bank-navy"
                        : "bg-white text-bank-textSecondary border-bank-border hover:bg-bank-lightGrey"
                    }`}
                  >
                    {tier} Branch
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-bank-textSecondary">Your Average Monthly Balance (AMB):</span>
                <span className="text-bank-navy font-bold">₹{currentAmb.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20000"
                step="500"
                value={currentAmb}
                onChange={(e) => setCurrentAmb(Number(e.target.value))}
                className="w-full accent-bank-teal cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-bank-textSecondary mt-1">
                <span>₹0 (Zero)</span>
                <span>₹10,000 (Required Metro)</span>
                <span>₹20,000</span>
              </div>
            </div>

            <div className="p-3 bg-bank-warmWhite border border-bank-border rounded text-xs text-bank-textSecondary leading-relaxed">
              <strong className="text-bank-navy block mb-0.5">Statutory Policy Context:</strong>
              Under Reserve Bank of India consumer awareness circulars, charges for non-maintenance of minimum balance must be directly proportionate to the shortfall percentage and notified 30 days prior.
            </div>
          </div>

          {/* Counterfactual Impact Box */}
          <div className="bg-bank-lightGrey p-5 rounded border border-bank-border flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase text-bank-mutedBlue tracking-wide block">
                Projected Monthly Non-Maintenance Charge
              </span>
              <div className="text-3xl font-extrabold text-bank-navy mt-1">
                {ambStatus.penalty === 0 ? (
                  <span className="text-bank-successGreen">₹0 (Zero Charge)</span>
                ) : (
                  <span className="text-bank-alertRed">₹{ambStatus.penalty} + GST</span>
                )}
              </div>

              {/* Counterfactual Action Recommendation */}
              <div className="mt-4 p-3 bg-white border border-bank-border rounded space-y-2 text-xs">
                <div className="font-semibold text-bank-navy flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-bank-teal" />
                  <span>"What-If" Counterfactual Optimization:</span>
                </div>
                {shortfall > 0 ? (
                  <p className="text-bank-textSecondary leading-snug">
                    If you transfer <strong className="text-bank-navy">₹{shortfall.toLocaleString("en-IN")}</strong> before the 28th of the month or link an <strong className="text-bank-navy">Auto-Sweep Fixed Deposit (2in1 Account)</strong>, your fee automatically drops from <strong className="text-bank-alertRed">₹{ambStatus.penalty}</strong> to <strong className="text-bank-successGreen">₹0</strong>.
                  </p>
                ) : (
                  <p className="text-bank-successGreen leading-snug flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-bank-successGreen shrink-0" />
                    <span>Your balance satisfies the required threshold of ₹{ambStatus.required.toLocaleString("en-IN")}. No non-maintenance fees apply.</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-bank-border text-[11px] text-bank-textSecondary">
              Source: Schedule of Service Charges (Current Year Tariffs).
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Payment Rails Comparison Matrix */}
      {tab === "rails" && (
        <div className="p-6 text-xs text-bank-textPrimary">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bank-lightGrey border-b border-bank-border text-bank-textSecondary uppercase tracking-wider font-semibold text-[11px]">
                  <th className="p-3">Payment Rail</th>
                  <th className="p-3">Transfer Limit</th>
                  <th className="p-3">Settlement Speed</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3">Standard Bank Fee</th>
                  <th className="p-3">Recommended Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bank-border">
                <tr className="hover:bg-bank-warmWhite">
                  <td className="p-3 font-bold text-bank-navy">UPI (Unified Payments Interface)</td>
                  <td className="p-3">₹1 Lakh / day (₹5L for hospitals/schools)</td>
                  <td className="p-3 text-bank-successGreen font-medium">Instant (Real-time)</td>
                  <td className="p-3">24×7×365</td>
                  <td className="p-3 text-bank-successGreen font-medium">Free (₹0)</td>
                  <td className="p-3 text-bank-textSecondary">Daily merchant QR, P2P personal payments</td>
                </tr>
                <tr className="hover:bg-bank-warmWhite">
                  <td className="p-3 font-bold text-bank-navy">IMPS (Immediate Payment Service)</td>
                  <td className="p-3">Up to ₹5 Lakh / transaction</td>
                  <td className="p-3 text-bank-successGreen font-medium">Instant (&lt; 5 seconds)</td>
                  <td className="p-3">24×7×365</td>
                  <td className="p-3">₹2.50 to ₹15 + GST</td>
                  <td className="p-3 text-bank-textSecondary">High-urgency bank-to-bank transfers</td>
                </tr>
                <tr className="hover:bg-bank-warmWhite">
                  <td className="p-3 font-bold text-bank-navy">NEFT (National Electronic Fund Transfer)</td>
                  <td className="p-3">No minimum or maximum statutory cap</td>
                  <td className="p-3 text-bank-mutedBlue font-medium">Half-hourly batches (30 mins)</td>
                  <td className="p-3">24×7×365</td>
                  <td className="p-3 text-bank-successGreen font-medium">Free for online transfers</td>
                  <td className="p-3 text-bank-textSecondary">Routine vendor payments, bills, scheduled transfers</td>
                </tr>
                <tr className="hover:bg-bank-warmWhite">
                  <td className="p-3 font-bold text-bank-navy">RTGS (Real Time Gross Settlement)</td>
                  <td className="p-3">Minimum ₹2,00,000 (No upper cap)</td>
                  <td className="p-3 text-bank-successGreen font-medium">Instant continuous gross settlement</td>
                  <td className="p-3">24×7×365</td>
                  <td className="p-3 text-bank-successGreen font-medium">Free for online / Nominal at branch</td>
                  <td className="p-3 text-bank-textSecondary">High-value commercial transactions & property transfers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
