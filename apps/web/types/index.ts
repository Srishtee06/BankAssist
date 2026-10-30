export type IntentType =
  | "ACCOUNT_SERVICES"
  | "FEES_AND_CHARGES"
  | "LOAN_INFORMATION"
  | "DIGITAL_PAYMENTS"
  | "FINANCIAL_LITERACY"
  | "COMPLAINT"
  | "FRAUD_OR_SECURITY"
  | "ACCOUNT_SPECIFIC"
  | "DOCUMENT_OR_POLICY_QUERY"
  | "OTHER";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Citation {
  document_id: string;
  chunk_id: string;
  title: string;
  source_url?: string;
  issuing_organization: string;
  jurisdiction: string;
  product_category: string;
  effective_date?: string;
  section_title?: string;
  page_number?: number;
  snippet: string;
  relevance_score?: number;
}

export interface SecurityNote {
  is_account_specific: boolean;
  contains_pii_attempt: boolean;
  credential_warning: boolean;
  disclaimer: string;
}

export interface EscalationOffer {
  needed: boolean;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reason: string;
  suggested_action: string;
  support_phone: string;
  support_email: string;
  branch_locator_url: string;
}

export interface ChatMessage {
  id: string;
  conversation_id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  intent?: IntentType;
  risk_level?: RiskLevel;
  confidence_score?: number;
  latency_ms?: number;
  citations?: Citation[];
  security_notes?: SecurityNote;
  escalation_offer?: EscalationOffer;
  grounded?: boolean;
  attestation_hash?: string;
  consensus_verdict?: string;
  coercion_flag?: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  source_url?: string;
  issuing_organization: string;
  jurisdiction: string;
  product_category: string;
  effective_date?: string;
  version: string;
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";
  created_at: string;
  chunk_count?: number;
}

export interface AnalyticsSummary {
  total_queries: number;
  total_conversations: number;
  avg_latency_ms: number;
  unanswered_queries: number;
  escalations_count: number;
  intent_distribution: Record<string, number>;
  risk_distribution: Record<string, number>;
}
