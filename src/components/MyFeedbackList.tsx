/**
 * MyFeedbackList Component
 * 
 * Displays user's submitted feedback with color-coded status badges
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Clock, Eye, CheckCircle, XCircle, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import * as feedbackService from '../services/feedback.service';

import { formatDisplayDate } from '../utils/formatting';

export interface MyFeedbackListProps {
  refreshTrigger?: number;
}

/**
 * MyFeedbackList Component
 */
export const MyFeedbackList: React.FC<MyFeedbackListProps> = ({ refreshTrigger = 0 }) => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [upvotingIds, setUpvotingIds] = useState<Set<string>>(new Set());

  // Fetch feedback list
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await feedbackService.fetchMyFeedback({ limit, offset });

      if (response.success && response.data) {
        // Ensure newest-first ordering by createdAt
        const items = Array.isArray(response.data.items) ? response.data.items : [];
        items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setFeedback(items);
        setTotal(typeof response.data.total === 'number' ? response.data.total : items.length);
      } else {
        setError(response.error?.message || 'Failed to load feedback');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  // Fetch on mount and when refreshTrigger changes
  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback, refreshTrigger]);

  // Status badge configuration
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'pending':
      case 'acknowledged':
        return {
          icon: <Clock className="h-3.5 w-3.5" />,
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        };
      case 'in_progress':
      case 'in-progress':
      case 'in progress':
        return {
          icon: <Eye className="h-3.5 w-3.5" />,
          label: 'In Progress',
          className: 'bg-blue-100 text-blue-700 border-blue-300',
        };
      case 'resolved':
      case 'closed':
        return {
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          label: 'Resolved',
          className: 'bg-green-100 text-green-700 border-green-300',
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-3.5 w-3.5" />,
          label: 'Rejected',
          className: 'bg-red-100 text-red-700 border-red-300',
        };
      default:
        return {
          icon: <Clock className="h-3.5 w-3.5" />,
          label: status || 'Unknown',
          className: 'bg-slate-100 text-slate-700 border-slate-300',
        };
    }
  };

  // Category labels
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'bug':
        return 'Bug Report';
      case 'feature':
      case 'feature_request':
        return 'Feature Request';
      case 'improvement':
      case 'general':
        return 'General Feedback';
      default:
        return category || 'Feedback';
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('feedback.myFeedback')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" text={t('myFeedback.loading')} />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('feedback.myFeedback')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-4">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (feedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('feedback.myFeedback')}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title={t('myFeedback.noFeedbackYet')}
            message={t('myFeedback.noFeedbackMessage')}
            icon={
              <svg
                className="h-12 w-12 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Feedback</CardTitle>
          <span className="text-sm text-slate-500">
            {feedback.length} submission{feedback.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback.map((item) => {
            const statusBadge = getStatusBadge(item.status || item.statusName || '');
            const typeLabel = getCategoryLabel(item.type || item.category || '');

            return (
              <div
                key={item.id}
                className="p-4 border border-slate-200 rounded-charming hover:border-electric-purple transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{item.title || item.message?.slice(0, 60) || 'Untitled'}</div>
                      <div className="text-xs text-slate-500">{typeLabel} • {item.priority || 'medium'}</div>
                    </div>

                    <Badge variant="pending" className={statusBadge.className}>
                      {statusBadge.icon}
                      <span className="ml-1 text-xs">{statusBadge.label}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">{formatDisplayDate(new Date(item.createdAt))}</div>
                    <div className="text-xs text-slate-500">{item.tags ? (Array.isArray(item.tags) ? item.tags.join(', ') : item.tags) : ''}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                  {item.description || item.message || ''}
                </p>

                {/* Footer: rating / upvotes / actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.rating ? (
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, index) => (
                          <span key={index} className={index < item.rating ? 'text-yellow-400' : 'text-slate-300'}>★</span>
                        ))}
                        <span className="text-xs text-slate-500 ml-2">{item.rating} star{item.rating !== 1 ? 's' : ''}</span>
                      </div>
                    ) : null}

                    <div className="text-sm text-slate-600">Upvotes: <span className="font-medium">{item.upvotes ?? 0}</span></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        // prevent duplicate clicks
                        if (upvotingIds.has(item.id)) return;

                        // optimistic update
                        try {
                          setUpvotingIds((prev) => new Set(prev).add(item.id));

                          const current = feedback.map((f) => ({ ...f }));
                          const idx = current.findIndex((f) => f.id === item.id);
                          if (idx !== -1) {
                            current[idx].upvotes = (current[idx].upvotes ?? 0) + 1;
                            setFeedback(current);
                          }

                          await feedbackService.upvoteFeedback(item.id);
                        } catch (err) {
                          // revert on error by refetching
                          fetchFeedback();
                        } finally {
                          setUpvotingIds((prev) => {
                            const next = new Set(prev);
                            next.delete(item.id);
                            return next;
                          });
                        }
                      }}
                      aria-label={"Upvote feedback"}
                      title={"Upvote"}
                      disabled={upvotingIds.has(item.id)}
                      className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-2 disabled:opacity-60"
                    >
                      <ThumbsUp className="h-4 w-4 text-slate-700" />
                      <span className="text-sm">Upvote</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-sm text-slate-600">Showing {Math.min(offset + 1, total || 0)} - {Math.min(offset + feedback.length, total || offset + feedback.length)} of {total}</div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Per page:</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-sm"
          >
            Previous
          </button>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
};
