/**
 * FeedbackForm Component
 * 
 * Form for submitting product feedback with validation
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { cn } from '../lib/utils';
import * as feedbackService from '../services/feedback.service';
import { FeedbackType, FeedbackPriority } from '../types/feedback';
import { useToast } from './Toast';
import { useAuth } from '../hooks/useAuth';

export interface FeedbackFormProps {
  onSuccess?: () => void;
}

/**
 * FeedbackForm Component
 */
export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [severity, setSeverity] = useState<string>(FeedbackPriority.MEDIUM);
  const [feature, setFeature] = useState<string>('search');
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form validation
  const validateForm = (): boolean => {
    if (!category) {
      setValidationError(t('feedbackForm.pleaseSelectCategory'));
      return false;
    }
    if (!title.trim()) {
      setValidationError(t('feedbackForm.title') + ' is required');
      return false;
    }
    if (message.trim().length < 10) {
      setValidationError(t('feedbackForm.messageTooShort'));
      return false;
    }
    if (rating < 1 || rating > 5) {
      setValidationError(t('feedbackForm.pleaseProvideRating'));
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?.id) {
      addToast('error', t('feedback.loginRequired'));
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    try {
      // Build payload according to new API contract
      const payload = {
        type: category || FeedbackType.GENERAL_FEEDBACK,
        severity: severity || FeedbackPriority.MEDIUM,
        title: title.trim(),
        rating,
        description: message.trim(),
        context: {
          platform: 'webapp',
          feature,
          timestamp: new Date().toISOString(),
        },
        metadata: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          language: i18n?.language || (typeof navigator !== 'undefined' ? navigator.language : 'en'),
        },
      };

      const response = await feedbackService.submitFeedback(payload);

      if (response.success) {
        addToast('success', t('feedback.submitted'));

        // Clear form
        setCategory('');
        setTitle('');
        setMessage('');
        setRating(0);
        setSeverity('medium');
        setFeature('search');
        setValidationError(null);

        // Notify parent to refresh list
        if (onSuccess) {
          onSuccess();
        }
      } else {
        addToast('error', response.error?.message || t('feedback.failed'));
      }
    } catch (err: any) {
      addToast('error', err?.message || t('feedback.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle retry after error
  const handleRetry = () => {
    handleSubmit(new Event('submit') as any);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('feedbackForm.title')}</CardTitle>
        <p className="mt-1 text-sm text-amber-600">{t('feedbackForm.anonymousNotice')}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
              {t('feedbackForm.category')} *
            </label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={cn(
                'w-full px-4 py-2 border rounded-charming text-sm',
                'focus:outline-none focus:ring-2 focus:ring-electric-purple focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                validationError?.includes('category') ? 'border-red-500' : 'border-slate-300'
              )}
              disabled={isSubmitting}
            >
              <option value="">{t('feedbackForm.selectCategory')}</option>
              <option value={FeedbackType.BUG_REPORT}>{t('feedbackForm.bugReport')}</option>
              <option value={FeedbackType.FEATURE_REQUEST}>{t('feedbackForm.featureRequest')}</option>
              <option value={FeedbackType.AI_ERROR}>{t('feedbackForm.aiError')}</option>
              <option value={FeedbackType.CATEGORIZATION_ERROR}>{t('feedbackForm.categorizationError')}</option>
              <option value={FeedbackType.SUMMARY_ERROR}>{t('feedbackForm.summaryError')}</option>
              <option value={FeedbackType.ENTITY_ERROR}>{t('feedbackForm.entityError')}</option>
              <option value={FeedbackType.URGENCY_ERROR}>{t('feedbackForm.urgencyError')}</option>
              <option value={FeedbackType.CONTENT_QUALITY}>{t('feedbackForm.contentQuality')}</option>
              <option value={FeedbackType.PERFORMANCE_ISSUE}>{t('feedbackForm.performanceIssue')}</option>
              <option value={FeedbackType.GENERAL_FEEDBACK}>{t('feedbackForm.generalFeedback')}</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              {t('feedbackForm.title')} *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-charming text-sm focus:outline-none focus:ring-2 focus:ring-electric-purple"
              placeholder={t('feedbackForm.title')}
              disabled={isSubmitting}
            />
          </div>

          {/* Severity + Feature */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-slate-700 mb-2">
                {t('feedbackForm.severity')}
              </label>
              <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-4 py-2 border rounded-charming text-sm focus:outline-none focus:ring-2 focus:ring-electric-purple"
                disabled={isSubmitting}
              >
                <option value={FeedbackPriority.CRITICAL}>{t('feedbackForm.priority.critical', 'Critical')}</option>
                <option value={FeedbackPriority.HIGH}>{t('feedbackForm.priority.high', 'High')}</option>
                <option value={FeedbackPriority.MEDIUM}>{t('feedbackForm.priority.medium', 'Medium')}</option>
                <option value={FeedbackPriority.LOW}>{t('feedbackForm.priority.low', 'Low')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="feature" className="block text-sm font-medium text-slate-700 mb-2">
                {t('feedbackForm.feature')}
              </label>
              <select
                id="feature"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                className="w-full px-4 py-2 border rounded-charming text-sm focus:outline-none focus:ring-2 focus:ring-electric-purple"
                disabled={isSubmitting}
              >
                <option value="dashboard">Dashboard</option>
                <option value="search">Search</option>
                <option value="tracking">Tracking</option>
                <option value="reminder">Reminder</option>
                <option value="review">Review</option>
                <option value="feedback">Feedback</option>
                <option value="account">Account</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('feedbackForm.rating')} *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  disabled={isSubmitting}
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      (hoveredRating >= star || rating >= star)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-slate-600 ml-2">
                  {rating} {rating === 1 ? t('feedbackForm.star') : t('feedbackForm.stars')}
                </span>
              )}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <TextArea
              label={`${t('feedbackForm.message')} *`}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t('feedback.placeholder')}
              rows={5}
              helperText={t('feedbackForm.charactersCount', { count: message.length })}
              error={validationError?.includes('Message') ? validationError : undefined}
              disabled={isSubmitting}
            />
          </div>

          {/* Validation Error */}
          {validationError && !validationError.includes('Message') && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-charming text-sm text-red-700">
              {validationError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              className="flex-1"
            >
              {t('feedbackForm.submitFeedback')}
            </Button>
            
            {validationError && (
              <Button
                type="button"
                onClick={handleRetry}
                variant="outline"
                disabled={isSubmitting}
              >
                {t('common.retry')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
