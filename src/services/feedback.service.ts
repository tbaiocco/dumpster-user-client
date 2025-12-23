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
  feedback: FeedbackPayload
): Promise<ApiResponse<any>> {
  // New backend endpoint expects payload at /feedback/submit
  return apiService.post('/feedback/submit', feedback);
}

/**
 * Fetch user's feedback submissions
 * 
 * @param userId - User identifier
 * @returns Promise with feedback array
 */
export async function fetchMyFeedback(
  userId: string
): Promise<ApiResponse<any>> {
  return apiService.get(`/feedback/user/${userId}`);
}
