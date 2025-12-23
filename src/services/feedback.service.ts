/**
 * Feedback API Service
 * 
 * Service layer for feedback-related API operations
 */

import { apiService, type ApiResponse } from './api';
import type { FeedbackPayload } from '../types/feedback';

/**
 * Submit feedback
 *
 * @param feedback - Feedback data to submit
 * @returns Promise with submitted feedback
 */
export async function submitFeedback(
  feedback: FeedbackPayload,
  userId?: string
): Promise<ApiResponse<any>> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  return apiService.post(`/feedback/submit${query}`, feedback);
}

/**
 * Fetch feedback items from the backend using GET /feedback
 * Supports optional query params: type, status, priority, userId, dumpId, tags, limit, offset
 * Returns { items: [...], total }
 *
 * @param params - Optional query parameters and pagination
 */
export async function fetchMyFeedback(
  params?: {
    type?: string;
    status?: string;
    priority?: string;
    userId?: string;
    dumpId?: string;
    tags?: string | string[];
    limit?: number;
    offset?: number;
  }
): Promise<ApiResponse<{ items: any[]; total: number }>> {
  const qs = new URLSearchParams();

  if (params) {
    if (params.type) qs.set('type', params.type);
    if (params.status) qs.set('status', params.status);
    if (params.priority) qs.set('priority', params.priority);
    if (params.userId) qs.set('userId', params.userId);
    if (params.dumpId) qs.set('dumpId', params.dumpId);
    if (params.tags) {
      if (Array.isArray(params.tags)) qs.set('tags', params.tags.join(','));
      else qs.set('tags', params.tags);
    }
    if (typeof params.limit === 'number') qs.set('limit', String(params.limit));
    if (typeof params.offset === 'number') qs.set('offset', String(params.offset));
  }

  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiService.get(`/feedback${query}`) as Promise<
    ApiResponse<{ items: any[]; total: number }>
  >;
}

/**
 * Upvote a feedback item
 * POST /feedback/:feedbackId/upvote
 */
export async function upvoteFeedback(
  feedbackId: string
): Promise<ApiResponse<any>> {
  return apiService.post(`/feedback/${feedbackId}/upvote`);
}
