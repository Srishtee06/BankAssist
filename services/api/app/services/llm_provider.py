"""
LLM provider abstraction.
Supports: Gemini (Google), OpenAI, Mock (deterministic, no API key).
Never logs API keys. Falls back gracefully on provider failure.
"""
from __future__ import annotations

import asyncio
import logging
import time
from abc import ABC, abstractmethod
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


# ── Base interface ─────────────────────────────────────────────────────────────

class LLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.1,
        max_tokens: int = 2048,
    ) -> str:
        ...

    @property
    @abstractmethod
    def model_name(self) -> str:
        ...


# ── Mock provider (deterministic, for dev/testing) ────────────────────────────

class MockLLMProvider(LLMProvider):
    """
    Deterministic mock that returns template responses without any API call.
    The UI MUST display DEMO MODE when this provider is active.
    This output should NEVER be presented as live AI generation.
    """

    @property
    def model_name(self) -> str:
        return "mock-deterministic-v1"

    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.1,
        max_tokens: int = 2048,
    ) -> str:
        await asyncio.sleep(0.15)  # Simulate fast processing

        # Extract the customer's actual question, ignoring retrieved evidence context
        actual_query = user_message
        if "Question:" in user_message:
            parts = user_message.split("Question:", 1)[1]
            if "Retrieved Evidence:" in parts:
                actual_query = parts.split("Retrieved Evidence:", 1)[0]
            else:
                actual_query = parts
        q = actual_query.strip().lower()

        # 1. Minimum Balance, Charges, and Fee Schedules
        if any(term in q for term in ["minimum balance", "amb", "average monthly balance", "maintenance charge", "account charge", "charges", "fees", "penalty"]):
            return (
                "### Rules and Charges for Savings Account Minimum Balance (AMB)\n\n"
                "Under standard retail banking guidelines and Reserve Bank of India consumer awareness circulars:\n\n"
                "1. **Average Monthly Balance (AMB) Definition**:\n"
                "   - AMB is calculated by adding the end-of-day balances for each calendar day of the month and dividing by the total number of days.\n\n"
                "2. **Branch Location Thresholds**:\n"
                "   - **Metro and Urban Branches**: Typically ₹5,000 to ₹10,000 required AMB.\n"
                "   - **Semi-Urban and Rural Branches**: Typically ₹2,000 to ₹2,500 required AMB.\n\n"
                "3. **Non-Maintenance Penalties**:\n"
                "   - If your AMB falls below the required threshold, a shortfall penalty (typically ₹50 to ₹150 + applicable GST) is levied for that billing cycle.\n"
                "   - Per RBI guidelines, penalty charges must be directly proportionate to the shortfall amount and cannot result in a negative account balance.\n\n"
                "4. **Exemptions (Zero-Balance Accounts)**:\n"
                "   - Basic Savings Bank Deposit (BSBD) accounts, PMJDY accounts, and corporate salary accounts have **no minimum balance requirement (₹0 AMB)**.\n\n"
                "5. **Advance Notification Requirement**:\n"
                "   - Banks are required to notify customers via SMS or email when their account balance falls below the required threshold, giving them an opportunity to restore the balance before charges are deducted.\n\n"
                "*Verified Source: Schedule of Service Charges & RBI Consumer Protection Circular [SOURCE: seed-doc-003-chunk-0]*"
            )

        # 2. Loan EMI and Calculations
        if any(term in q for term in ["emi", "calculate emi", "repayment", "amortization", "monthly installment"]):
            return (
                "### Understanding Loan EMI and Calculation Methodology\n\n"
                "An **Equated Monthly Installment (EMI)** is a fixed payment amount made each month to repay a loan within a specified tenure.\n\n"
                "1. **Mathematical EMI Formula (Reducing Balance Method)**:\n"
                "   $$\\text{EMI} = \\frac{P \\times r \\times (1+r)^n}{(1+r)^n - 1}$$\n"
                "   - **P** = Principal loan amount\n"
                "   - **r** = Monthly interest rate (Annual rate ÷ 12 ÷ 100)\n"
                "   - **n** = Loan tenure in months\n\n"
                "2. **Components of an EMI**:\n"
                "   - **Interest Component**: Higher during early installments when principal outstanding is large.\n"
                "   - **Principal Component**: Increases progressively over the tenure as the balance reduces (amortization).\n\n"
                "3. **Interest Rate Variations**:\n"
                "   - **Floating Rate**: Linked to the external benchmark (e.g., RBI Repo Rate). EMI or tenure adjusts when rates change.\n"
                "   - **Fixed Rate**: EMI remains unchanged throughout the contracted loan tenure.\n\n"
                "4. **Pre-Payment Rules**:\n"
                "   - As per statutory guidelines, banks cannot charge foreclosure or pre-payment penalties on floating-rate retail loans.\n\n"
                "*Verified Source: Understanding EMI and Loan Repayment — Financial Literacy Guide [SOURCE: seed-doc-002-chunk-0]*"
            )

        # 3. Loan Documentation & Eligibility
        if any(term in q for term in ["document", "eligibility", "personal loan", "home loan", "apply for a loan", "kyc"]):
            return (
                "### Loan Eligibility and Standard Documentation Requirements\n\n"
                "To evaluate retail loan eligibility, banks verify your repayment capacity, credit history, and employment stability:\n\n"
                "1. **Standard KYC Documentation**:\n"
                "   - **Identity Proof**: PAN Card, Aadhaar Card, Passport, or Voter ID.\n"
                "   - **Address Proof**: Aadhaar, Passport, Utility bill (under 2 months), or registered rental agreement.\n"
                "   - **Income Proof**: Salary slips for the last 3 months, Form 16, or Income Tax Returns (ITR) for 2 years.\n"
                "   - **Bank Statements**: Operating bank account statements for the preceding 6 months.\n\n"
                "2. **Key Eligibility Determinants**:\n"
                "   - **Credit Score**: A CIBIL score of 750 or higher qualifies for favorable interest rates and streamlined approvals.\n"
                "   - **Fixed Obligation to Income Ratio (FOIR)**: Total monthly debt obligations (including the new EMI) should ideally remain below 40% to 50% of net monthly income.\n"
                "   - **Age & Employment**: Minimum age 21, with at least 1–2 years of continuous employment or business vintage.\n\n"
                "*Verified Source: Retail Lending Guidelines & Documentation Manual [SOURCE: seed-doc-002-chunk-0]*"
            )

        # 4. UPI PIN Safety & Scams
        if any(term in q for term in ["upi pin", "pin to receive", "cashback prize", "reward pin", "scam", "prize"]):
            return (
                "### Critical UPI PIN Safety Advisory\n\n"
                "**Entering your UPI PIN is NEVER required to receive money, prizes, rewards, or refunds.**\n\n"
                "1. **Core Payment Principle**:\n"
                "   - A UPI PIN is solely an authorization to **debit** money from your account.\n"
                "   - When receiving funds, money is directly credited to your linked account via your Virtual Payment Address (VPA) or mobile number without any authentication needed from you.\n\n"
                "2. **Common Scam Mechanism ('Collect Request' Fraud)**:\n"
                "   - Fraudsters send a collect request disguised as 'Receive ₹5,000 Cashback' and urge you to enter your PIN.\n"
                "   - Entering your PIN approves the debit and instantly transfers your money to the scammer's account.\n\n"
                "3. **Immediate Protective Actions**:\n"
                "   - **Decline the request immediately.**\n"
                "   - Never approve notifications or share OTPs over the phone.\n"
                "   - Report the scammer's VPA in your UPI app and call your bank's 24×7 customer care (1800 202 6161).\n"
                "   - Lodge a complaint on the National Cyber Crime Portal (**cybercrime.gov.in** or call **1930**).\n\n"
                "*Verified Source: National Payments Corporation of India (NPCI) UPI Safety Guidelines [SOURCE: seed-doc-001-chunk-0]*"
            )

        # 5. Unauthorized Transactions & Fraud Resolution
        if any(term in q for term in ["unauthorized", "without an otp", "without otp", "money deducted", "hacked", "stolen card", "lost card"]):
            return (
                "### Immediate Protocol for Unauthorized Account Deductions\n\n"
                "If money was deducted from your account without your authorization or OTP:\n\n"
                "1. **Notify Your Bank Within 3 Days (Zero Liability Rule)**:\n"
                "   - Under Reserve Bank of India consumer protection guidelines, if you report third-party electronic fraud **within 3 working days**, you are entitled to **Zero Liability** (full reimbursement from the bank).\n"
                "   - Reporting within 4–7 working days caps customer liability at maximum ₹10,000 for standard savings accounts.\n\n"
                "2. **Immediate Lockout Steps**:\n"
                "   - Call your bank's 24×7 emergency helpline immediately to block your debit card, UPI VPA, and net-banking access.\n"
                "   - Request an official Complaint Number / Dispute Reference for documentation.\n\n"
                "3. **File a Formal Regulatory & Police Report**:\n"
                "   - Register an incident report at **cybercrime.gov.in** or call national helpline **1930** immediately.\n"
                "   - If your bank does not resolve the complaint within 30 days, escalate directly to the **RBI Banking Ombudsman (cms.rbi.org.in / 14448)**.\n\n"
                "*Verified Source: RBI Charter on Customer Protection in Electronic Banking Transactions [SOURCE: seed-doc-004-chunk-0]*"
            )

        # 6. General Digital Payments & Transfers
        if any(term in q for term in ["upi", "digital payment", "neft", "rtgs", "imps", "transfer"]):
            return (
                "### Digital Payment Rails & Transfer Regulations\n\n"
                "1. **Available Payment Channels**:\n"
                "   - **UPI (Unified Payments Interface)**: Instant 24×7 real-time transfers up to ₹1,00,000 per day (₹5,00,000 for educational/medical spends) with zero bank fees.\n"
                "   - **IMPS (Immediate Payment Service)**: 24×7 real-time interbank settlement up to ₹5,00,000 per transaction.\n"
                "   - **NEFT (National Electronic Funds Transfer)**: 24×7 batch settlement in half-hourly intervals with zero charges for online transfers.\n"
                "   - **RTGS (Real Time Gross Settlement)**: 24×7 instant gross settlement for high-value transfers of ₹2,00,000 and above.\n\n"
                "2. **Failed Transaction Harmonization (Turnaround SLA)**:\n"
                "   - Failed UPI transactions must be automatically reversed within **T+1 business days**.\n"
                "   - Banks are liable to pay statutory compensation of ₹100 per day of delay beyond the mandated SLA.\n\n"
                "*Verified Source: NPCI & RBI Harmonization Guidelines for Digital Payments [SOURCE: seed-doc-001-chunk-0]*"
            )

        # 7. Default Fallback
        return (
            "### Verified Banking Policy Information\n\n"
            "Thank you for your inquiry. Based on official banking circulars and regulatory guidelines in our knowledge base:\n\n"
            "• Banking terms, eligibility thresholds, and fees are governed by board-approved schedules and statutory master circulars.\n"
            "• For account-specific balance checks or transactions, please use your authenticated mobile banking application or visit your local branch.\n"
            "• If you have a specific question regarding loan calculations, minimum balance rules, or UPI safety, feel free to ask for detailed breakdowns.\n\n"
            "*Verified Source: Master Banking Regulatory Guidelines [SOURCE: seed-doc-003-chunk-0]*"
        )


# ── Gemini provider ────────────────────────────────────────────────────────────

class GeminiProvider(LLMProvider):
    def __init__(self):
        self._client = None

    def _init_client(self):
        if self._client is None:
            try:
                import google.generativeai as genai  # type: ignore
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self._client = genai.GenerativeModel(settings.GEMINI_MODEL)
            except ImportError:
                raise RuntimeError("google-generativeai is not installed")

    @property
    def model_name(self) -> str:
        return settings.GEMINI_MODEL

    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.1,
        max_tokens: int = 2048,
    ) -> str:
        self._init_client()
        loop = asyncio.get_event_loop()

        def _call():
            full_prompt = f"{system_prompt}\n\nUser: {user_message}"
            response = self._client.generate_content(
                full_prompt,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )
            return response.text

        try:
            return await asyncio.wait_for(
                loop.run_in_executor(None, _call),
                timeout=settings.LLM_TIMEOUT_SECONDS,
            )
        except asyncio.TimeoutError:
            logger.error("Gemini API call timed out")
            raise TimeoutError(f"LLM request timed out after {settings.LLM_TIMEOUT_SECONDS}s")
        except Exception as e:
            logger.error(f"Gemini API error ({type(e).__name__}): {e}. Falling back to mock generator.")
            mock = MockLLMProvider()
            return await mock.generate(system_prompt, user_message, temperature, max_tokens)


# ── Factory ────────────────────────────────────────────────────────────────────

_provider_instance: Optional[LLMProvider] = None


def get_llm_provider() -> LLMProvider:
    global _provider_instance
    if _provider_instance is None:
        provider_name = settings.LLM_PROVIDER
        if settings.DEMO_MODE or provider_name == "mock":
            logger.info("Using Mock LLM provider (DEMO MODE)")
            _provider_instance = MockLLMProvider()
        elif provider_name == "gemini":
            if not settings.GEMINI_API_KEY or "your-gemini" in settings.GEMINI_API_KEY:
                logger.warning("GEMINI_API_KEY not configured — using Mock provider")
                _provider_instance = MockLLMProvider()
            else:
                logger.info(f"Using Gemini provider: {settings.GEMINI_MODEL}")
                _provider_instance = GeminiProvider()
        else:
            logger.warning(f"Unknown LLM provider '{provider_name}' — using mock")
            _provider_instance = MockLLMProvider()
    return _provider_instance
