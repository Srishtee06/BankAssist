"""
Intent classification and risk assessment.
Uses deterministic rules first, then optional LLM classification.
"""
from __future__ import annotations

import re
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class IntentLabel(str, Enum):
    ACCOUNT_SERVICES = "ACCOUNT_SERVICES"
    FEES_AND_CHARGES = "FEES_AND_CHARGES"
    LOAN_INFORMATION = "LOAN_INFORMATION"
    DIGITAL_PAYMENTS = "DIGITAL_PAYMENTS"
    FINANCIAL_LITERACY = "FINANCIAL_LITERACY"
    COMPLAINT = "COMPLAINT"
    FRAUD_OR_SECURITY = "FRAUD_OR_SECURITY"
    ACCOUNT_SPECIFIC = "ACCOUNT_SPECIFIC"
    DOCUMENT_OR_POLICY_QUERY = "DOCUMENT_OR_POLICY_QUERY"
    OTHER = "OTHER"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ClassificationResult(BaseModel):
    intent: IntentLabel
    risk_level: RiskLevel
    requires_human: bool
    requires_clarification: bool
    reason_codes: list[str]
    safe_to_retrieve: bool


# ─── Deterministic rule patterns ─────────────────────────────────────────────

_CRITICAL_PATTERNS = [
    r"\b(pin|otp|password|cvv|card\s*number|credentials)\b",
    r"\b(lost\s*card|stolen\s*card|compromised|hack(ed)?|fraud)\b",
    r"\b(unauthorized\s*transaction|money\s*(stolen|taken|deducted\s*without))\b",
    r"\b(account\s*(compromised|hacked|blocked))\b",
    r"\bscam\b",
]

_ACCOUNT_SPECIFIC_PATTERNS = [
    r"\b(my\s*(account|balance|statement|transactions?|loan\s*status))\b",
    r"\b(check\s*(my|the)\s*balance)\b",
    r"\b(why\s*was\s*(money|amount)\s*deducted)\b",
    r"\b(change\s*(my\s*)?(pin|password|mobile\s*number|address))\b",
    r"\b(am\s*i\s*eligible)\b",
    r"\b(my\s*emi|my\s*loan)\b",
]

_HIGH_RISK_PATTERNS = [
    r"\b(dispute|chargeback|complaint)\b",
    r"\b(loan\s*(approval|eligibility|rejection))\b",
    r"\b(personal\s*(financial\s*)?advice)\b",
]

_FRAUD_PATTERNS = [
    r"\b(fraud|scam|phishing|vishing|smishing)\b",
    r"\b(suspicious\s*(transaction|activity|call|message))\b",
    r"\b(not\s*authoriz(ed?|ing?))\b",
]

_DIGITAL_PAYMENT_PATTERNS = [
    r"\b(upi|neft|rtgs|imps|paytm|phonepe|googlepay|bhim)\b",
    r"\b(payment\s*(failed|pending|declined))\b",
    r"\b(transfer\s*money|send\s*money|receive\s*money)\b",
    r"\b(qr\s*code|virtual\s*payment\s*address|vpa)\b",
]

_FEES_PATTERNS = [
    r"\b(fee|charge|penalty|interest\s*rate|minimum\s*balance|service\s*charge)\b",
    r"\b(annual\s*fee|processing\s*fee|late\s*payment)\b",
    r"\b(schedule\s*of\s*charges)\b",
]

_LOAN_PATTERNS = [
    r"\b(loan|emi|emi\s*calculator|interest|repay(ment)?|principal|tenure)\b",
    r"\b(home\s*loan|personal\s*loan|car\s*loan|education\s*loan|credit\s*card\s*loan)\b",
    r"\b(apply\s*for\s*loan|loan\s*documents?)\b",
]

_ACCOUNT_SERVICE_PATTERNS = [
    r"\b(savings\s*account|current\s*account|fixed\s*deposit|recurring\s*deposit)\b",
    r"\b(open\s*account|close\s*account|kyc)\b",
    r"\b(atm|debit\s*card|credit\s*card|passbook)\b",
    r"\b(nomination|joint\s*account|minor\s*account)\b",
]

_FINANCIAL_LITERACY_PATTERNS = [
    r"\b(what\s*is|how\s*(does|do)|explain|definition\s*of|meaning\s*of)\b.*\b(banking|finance|interest|investment|inflation|compound)\b",
    r"\b(financial\s*(literacy|education|planning|goal))\b",
    r"\b(how\s*(to\s*)?(save|invest|budget))\b",
]


def _matches(text: str, patterns: list[str]) -> bool:
    t = text.lower()
    return any(re.search(p, t) for p in patterns)


def classify_intent_and_risk(query: str) -> ClassificationResult:
    """
    Deterministic rule-based classification.
    This runs before any LLM call to ensure safety-critical routing
    is not dependent on an external model.
    """
    q = query.strip()
    reason_codes: list[str] = []

    # ── CRITICAL: urgent security / credential exposure ─────────────────────
    if _matches(q, _CRITICAL_PATTERNS):
        return ClassificationResult(
            intent=IntentLabel.FRAUD_OR_SECURITY,
            risk_level=RiskLevel.CRITICAL,
            requires_human=True,
            requires_clarification=False,
            reason_codes=["SENSITIVE_CREDENTIAL_OR_FRAUD_INDICATOR"],
            safe_to_retrieve=False,
        )

    # ── Account-specific: requires authenticated channel ────────────────────
    if _matches(q, _ACCOUNT_SPECIFIC_PATTERNS):
        return ClassificationResult(
            intent=IntentLabel.ACCOUNT_SPECIFIC,
            risk_level=RiskLevel.HIGH,
            requires_human=True,
            requires_clarification=False,
            reason_codes=["ACCOUNT_SPECIFIC_DATA_REQUIRED"],
            safe_to_retrieve=False,
        )

    # ── Fraud/security (general awareness, not credential incident) ─────────
    if _matches(q, _FRAUD_PATTERNS):
        reason_codes.append("FRAUD_SECURITY_TOPIC")
        return ClassificationResult(
            intent=IntentLabel.FRAUD_OR_SECURITY,
            risk_level=RiskLevel.HIGH,
            requires_human=False,
            requires_clarification=False,
            reason_codes=reason_codes,
            safe_to_retrieve=True,
        )

    # ── High-risk policy queries ────────────────────────────────────────────
    if _matches(q, _HIGH_RISK_PATTERNS):
        reason_codes.append("HIGH_RISK_QUERY")
        intent = IntentLabel.COMPLAINT if _matches(q, [r"\b(dispute|chargeback|complaint)\b"]) else IntentLabel.LOAN_INFORMATION
        return ClassificationResult(
            intent=intent,
            risk_level=RiskLevel.HIGH,
            requires_human=True,
            requires_clarification=False,
            reason_codes=reason_codes,
            safe_to_retrieve=False,
        )

    # ── Digital payments ────────────────────────────────────────────────────
    if _matches(q, _DIGITAL_PAYMENT_PATTERNS):
        return ClassificationResult(
            intent=IntentLabel.DIGITAL_PAYMENTS,
            risk_level=RiskLevel.LOW,
            requires_human=False,
            requires_clarification=False,
            reason_codes=[],
            safe_to_retrieve=True,
        )

    # ── Fees and charges ────────────────────────────────────────────────────
    if _matches(q, _FEES_PATTERNS):
        return ClassificationResult(
            intent=IntentLabel.FEES_AND_CHARGES,
            risk_level=RiskLevel.MEDIUM,
            requires_human=False,
            requires_clarification=True,
            reason_codes=["BANK_SPECIFIC_CLARIFICATION_NEEDED"],
            safe_to_retrieve=True,
        )

    # ── Loans ────────────────────────────────────────────────────────────────
    if _matches(q, _LOAN_PATTERNS):
        return ClassificationResult(
            intent=IntentLabel.LOAN_INFORMATION,
            risk_level=RiskLevel.MEDIUM,
            requires_human=False,
            requires_clarification=False,
            reason_codes=[],
            safe_to_retrieve=True,
        )

    # ── Account services ────────────────────────────────────────────────────
    if _matches(q, _ACCOUNT_SERVICE_PATTERNS):
        return ClassificationResult(
            intent=IntentLabel.ACCOUNT_SERVICES,
            risk_level=RiskLevel.LOW,
            requires_human=False,
            requires_clarification=False,
            reason_codes=[],
            safe_to_retrieve=True,
        )

    # ── Financial literacy ──────────────────────────────────────────────────
    if _matches(q, _FINANCIAL_LITERACY_PATTERNS):
        return ClassificationResult(
            intent=IntentLabel.FINANCIAL_LITERACY,
            risk_level=RiskLevel.LOW,
            requires_human=False,
            requires_clarification=False,
            reason_codes=[],
            safe_to_retrieve=True,
        )

    # ── Prompt injection detection ──────────────────────────────────────────
    injection_patterns = [
        r"\bignore\s+(all\s+)?(previous\s+)?instructions\b",
        r"\bsystem\s*prompt\b",
        r"\byou\s+are\s+now\b",
        r"\bact\s+as\b",
        r"\bpretend\s+(you\s+are|to\s+be)\b",
        r"\bDAN\b",
        r"\bjailbreak\b",
    ]
    if _matches(q, injection_patterns):
        return ClassificationResult(
            intent=IntentLabel.OTHER,
            risk_level=RiskLevel.HIGH,
            requires_human=False,
            requires_clarification=False,
            reason_codes=["PROMPT_INJECTION_DETECTED"],
            safe_to_retrieve=False,
        )

    # ── Default: general / unclear ──────────────────────────────────────────
    return ClassificationResult(
        intent=IntentLabel.FINANCIAL_LITERACY,
        risk_level=RiskLevel.LOW,
        requires_human=False,
        requires_clarification=len(q.split()) < 4,  # very short queries need clarification
        reason_codes=["DEFAULT_CLASSIFICATION"],
        safe_to_retrieve=True,
    )
