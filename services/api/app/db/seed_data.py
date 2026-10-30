"""
Seed data for BankAssist AI knowledge base.
These are synthetic/illustrative documents for local development and demo.
They are CLEARLY LABELED as sample content and NOT presented as official banking policies.
"""
SAMPLE_DOCUMENTS = [
    {
        "id": "seed-doc-001",
        "title": "UPI Safety Guidelines — Consumer Awareness (DEMO CONTENT)",
        "issuing_organization": "Sample Financial Literacy Resource",
        "jurisdiction": "IN",
        "product_category": "DIGITAL_PAYMENTS",
        "effective_date": "2024-01-01",
        "source_url": "https://npci.org.in/fraud-awareness",
        "text": """
# UPI Safety Guidelines

## What is UPI?
UPI (Unified Payments Interface) is a real-time payment system developed by the National Payments Corporation of India (NPCI).
It enables instant money transfers between bank accounts using a Virtual Payment Address (VPA).

## How to Make a Safe UPI Payment
1. Only use UPI apps registered and listed by NPCI (e.g., BHIM, PhonePe, Google Pay, Paytm)
2. Verify the recipient's VPA (Virtual Payment Address) before confirming payment
3. Never share your UPI PIN with anyone — not even bank employees
4. Do not click on UPI payment links from unknown sources
5. Enable UPI transaction notifications to monitor activity

## UPI Security Features
- Two-factor authentication using mobile number and UPI PIN
- Real-time transaction alerts via SMS and app notifications
- Daily transaction limits set by NPCI and your bank
- Dispute resolution process through your bank or NPCI

## Common UPI Frauds to Avoid
- Collect request fraud: Fraudsters send a collect request asking you to enter your PIN to "receive" money. Never enter your UPI PIN for receiving money.
- Screen mirroring: Fraudsters may ask you to install screen-sharing apps under the guise of help. Never install unknown apps.
- Fake customer care: Always use official bank helpline numbers. Genuine bank staff never ask for your PIN or OTP.

## Reporting UPI Fraud
If you suspect UPI fraud:
1. Immediately call your bank's 24x7 helpline
2. Report at cybercrime.gov.in or call 1930
3. File a complaint with NPCI at npci.org.in
4. Report to your nearest police station

⚠️ DEMO CONTENT: This document is synthetic sample data for development and testing purposes only.
""",
    },
    {
        "id": "seed-doc-002",
        "title": "Understanding EMI and Loan Repayment — Financial Literacy Guide (DEMO CONTENT)",
        "issuing_organization": "Sample Financial Education Resource",
        "jurisdiction": "IN",
        "product_category": "LOAN_INFORMATION",
        "effective_date": "2024-01-01",
        "source_url": "https://rbi.org.in/commonperson",
        "text": """
# Understanding EMI and Loan Repayment

## What is an EMI?
An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each month.
It is used to pay off loans within a specified tenure.

## EMI Calculation Formula
EMI = [P × r × (1+r)^n] / [(1+r)^n – 1]

Where:
- P = Principal loan amount
- r = Monthly interest rate (Annual rate ÷ 12 ÷ 100)
- n = Loan tenure in months

## Example Calculation
For a loan of ₹5,00,000 at 12% annual interest for 5 years:
- P = 5,00,000
- r = 12/12/100 = 0.01
- n = 60 months
- EMI = ₹11,122 approximately

## Types of Loan Interest
1. Fixed Rate: EMI remains constant throughout the loan tenure
2. Floating Rate: EMI or tenure changes with market interest rates (linked to RBI's repo rate)

## Loan Repayment Schedule
- Each EMI has two components: principal and interest
- In early months, interest component is higher
- As loan progresses, principal component increases
- This is called an amortization schedule

## Pre-Payment and Foreclosure
- Pre-payment: Paying extra amount toward principal reduces total interest
- Foreclosure: Paying off the entire loan before tenure ends
- Banks may charge foreclosure fees (check your loan agreement)
- RBI mandates no prepayment penalty on floating rate home loans

## Documents Generally Required for Personal Loans
- Identity Proof: Aadhaar Card, PAN Card, Passport, Voter ID
- Address Proof: Utility bill, rent agreement, Aadhaar
- Income Proof: Salary slips (3 months), Form 16, ITR (2 years)
- Bank Statements: Last 6 months
- Employment Proof: Offer letter or employment certificate
Note: Exact requirements vary by bank and loan product.

## Understanding Your Credit Score
- Credit score range: 300–900 (CIBIL Score)
- Score above 750 is generally considered good
- Higher score = better loan eligibility and lower interest rates
- Check your free credit report annually at CIBIL or credit bureau websites

⚠️ DEMO CONTENT: This document is synthetic sample data for development and testing purposes only.
""",
    },
    {
        "id": "seed-doc-003",
        "title": "Banking Fees and Charges — General Guide (DEMO CONTENT)",
        "issuing_organization": "Sample Consumer Banking Education Resource",
        "jurisdiction": "IN",
        "product_category": "FEES_AND_CHARGES",
        "effective_date": "2024-01-01",
        "source_url": "https://rbi.org.in/commonperson/english/Scripts/FAQs.aspx",
        "text": """
# Banking Fees and Charges — General Consumer Guide

## Minimum Balance Requirements
Most savings accounts require maintaining a minimum Average Monthly Balance (AMB).
- Metro/Urban branches: Typically higher minimum balance (varies by bank)
- Semi-urban/Rural branches: Generally lower minimum balance requirements
- Non-maintenance charges: Levied if balance falls below minimum (varies by bank)
- Zero-balance accounts: Basic Savings Bank Deposit (BSBD) accounts have no minimum balance requirement

## ATM Transaction Charges
As per RBI guidelines:
- Free ATM transactions per month: 5 free at own bank ATMs, 3 free at other bank ATMs (metro cities) or 5 (non-metro)
- Beyond free limit: Banks charge per transaction (check your bank's schedule of charges)
- Cash withdrawal, balance inquiry, and mini statements may each count as a transaction

## NEFT Charges
NEFT (National Electronic Funds Transfer) charges from January 2020:
- RBI has mandated no charges for online NEFT transactions
- Branch-initiated NEFT: Banks may charge (typically ₹2-25 depending on amount)
- Transaction timing: NEFT operates in half-hourly batches throughout the day

## RTGS Charges  
RTGS (Real Time Gross Settlement) — for high-value transfers (minimum ₹2 lakh):
- Online RTGS: No charges mandated by RBI
- Branch RTGS: Banks may charge ₹25-50 per transaction
- Settlement is immediate (real-time)

## IMPS Charges
IMPS (Immediate Payment Service) — for 24/7 instant transfers:
- Available round the clock including holidays
- Banks set their own charges (typically ₹5-15 per transaction)

## Common Fee Types
- Account maintenance fee: Annual charge for account upkeep
- SMS alert charges: Monthly fee for transaction SMS notifications
- Cheque book fee: Charges beyond free cheque leaves
- DD/Pay Order fee: Demand draft issuance charges
- Locker fee: Annual safe deposit locker rental
- Credit card annual fee: Yearly charge for credit card (many cards offer fee waiver based on spending)

## How to Find Your Bank's Charges
1. Visit your bank's official website > Schedule of Charges
2. Check your account opening documents
3. Call your bank's customer care
4. Visit nearest branch for latest schedule

⚠️ DEMO CONTENT: This document is synthetic sample data for development purposes only. Always verify current fees with your bank.
""",
    },
    {
        "id": "seed-doc-004",
        "title": "Fraud Prevention and Consumer Protection — RBI Guidelines Summary (DEMO CONTENT)",
        "issuing_organization": "Sample Consumer Protection Resource",
        "jurisdiction": "IN",
        "product_category": "FRAUD_OR_SECURITY",
        "effective_date": "2024-01-01",
        "source_url": "https://rbikehtahai.rbi.org.in",
        "text": """
# Fraud Prevention and Consumer Rights in Banking

## RBI's Consumer Protection Framework
The Reserve Bank of India has established guidelines to protect banking customers from fraud and unauthorized transactions.

## Zero Liability for Unauthorized Transactions
Under RBI's circular on Customer Protection (July 2017):
- If fraud occurs due to bank negligence or third-party breach (not customer negligence): Customer has ZERO liability
- If customer notifies bank within 3 working days of unauthorized transaction: Zero liability (even if fraud is due to customer negligence for card/internet/mobile banking)
- Reporting within 4-7 days: Maximum liability capped as per RBI guidelines
- Reporting after 7 days: Liability as per bank's board-approved policy

## Immediate Steps if You Suspect Fraud
1. Block your card/account immediately through banking app, net banking, or calling helpline
2. Report to bank helpline within 24 hours
3. Register complaint in writing at the bank branch
4. File cybercrime complaint at cybercrime.gov.in or call 1930
5. Note the complaint reference/FIR number for follow-up

## Phishing Awareness
Phishing = Fraudsters impersonating banks to steal credentials
- Banks NEVER ask for: PIN, OTP, CVV, full card number, passwords via SMS/email/phone
- Always check URL: Bank website URLs should use HTTPS and match official domain
- Never click links in SMS/WhatsApp/email claiming to be your bank

## Safe Banking Practices
1. Register your mobile number with the bank for transaction alerts
2. Set transaction limits for online banking and cards
3. Never share banking credentials with anyone, including family members
4. Regularly check your account statement for unauthorized transactions
5. Use strong, unique passwords for internet banking

## Banking Ombudsman
If your bank does not resolve a complaint within 30 days:
- File a complaint with RBI's Banking Ombudsman (free of charge)
- Online: cms.rbi.org.in
- Helpline: 14448
- Covers unauthorized transactions, non-credit of funds, failures of ATM/digital payments

## KYC Requirements
Know Your Customer (KYC) is mandatory for all bank accounts:
- Documents: Aadhaar, PAN, Passport, Voter ID (any one for identity + address)
- Re-KYC: Banks periodically require updating KYC information
- Simplified KYC: Available for basic accounts with limited transactions

⚠️ DEMO CONTENT: This document is synthetic sample data for development purposes only. Refer to RBI's official website for current guidelines.
""",
    },
]
