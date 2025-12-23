export const FeedbackType = {
  BUG_REPORT: 'bug_report',
  FEATURE_REQUEST: 'feature_request',
  AI_ERROR: 'ai_error',
  CATEGORIZATION_ERROR: 'categorization_error',
  SUMMARY_ERROR: 'summary_error',
  ENTITY_ERROR: 'entity_error',
  URGENCY_ERROR: 'urgency_error',
  GENERAL_FEEDBACK: 'general_feedback',
  CONTENT_QUALITY: 'content_quality',
  PERFORMANCE_ISSUE: 'performance_issue',
} as const;

export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];

export const FeedbackPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type FeedbackPriority = (typeof FeedbackPriority)[keyof typeof FeedbackPriority];

export const FeedbackStatus = {
  NEW: 'new',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export type FeedbackStatus = (typeof FeedbackStatus)[keyof typeof FeedbackStatus];

export type FeedbackPayload = {
  type: FeedbackType | string;
  severity?: FeedbackPriority | string;
  title?: string;
  rating?: number;
  description?: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
};
