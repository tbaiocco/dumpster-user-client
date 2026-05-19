# Clutter.AI User Web Interface - Product Overview (v1.0)

**The Personal Control Center for Your Universal Life Inbox**

*Last Updated: May 19, 2026*

---

## Executive Summary

The **Clutter.AI User Web Interface** is the authenticated frontend application where end users manage everything captured by Clutter.AI.

It is built for people who need a fast, forgiving interface to:
- review what AI captured,
- find important information quickly,
- take action on reminders and package tracking,
- and keep their account preferences aligned with daily life.

This client is the user-facing complement to the backend and bot capture channels (WhatsApp, Telegram, email). The bots capture data; this web app helps users organize, verify, and act on it.

---

## Problem This Interface Solves

Users can capture information from anywhere, but they still need a practical control center to:
- see what needs attention now,
- verify or correct AI interpretation,
- search naturally when memory is fuzzy,
- and track commitments without context switching.

Without this interface, users depend only on chat threads and ad-hoc reminders, which increases cognitive load and creates missed actions.

---

## Core Capabilities

### 1. Secure User Access and Session Management

**Phone-Based Authentication**
- Sign-in starts with phone number verification code flow.
- Verification code and login are handled through API endpoints.
- Successful login stores access and refresh tokens for session continuity.

**Protected Navigation**
- Authenticated routes are guarded with a dedicated protected route layer.
- Unauthenticated users are redirected to login.
- Session failures (e.g., token expiration) trigger refresh, then safe fallback to login.

**What This Enables**
- Personal data isolation per authenticated user.
- Smooth re-entry for returning users.
- Lower friction than password-heavy flows.

---

### 2. Action-Oriented Dashboard

**Time-Bucketed Prioritization**
- Dashboard groups items into practical time buckets (e.g., immediate and upcoming windows).
- Focuses the user on actionable work instead of a flat list.

**Fast Review Interactions**
- Users can open item detail modals directly from cards.
- Accept/reject and item updates are reflected quickly with local/optimistic behavior and refetch support.

**Resilience States**
- Strong handling for loading, empty, and error states.
- Retry paths are available when data retrieval fails.

---

### 3. Natural Language Search and Filtering

**Conversational Search Input**
- Users can search with natural language rather than strict query syntax.
- Search is backed by query + filters and paginated result sets.

**Advanced Filters**
- Filter by content type, category, date ranges, confidence, urgency, and status.
- Requests omit undefined filters to reduce backend validation noise.

**Search UX Quality**
- Includes loading overlays, no-query guidance, no-result states, and pagination controls.
- Supports result detail modal navigation via URL params.

---

### 4. Review Queue for Flagged Content

**Manual Validation Workflow**
- Dedicated review page for flagged dumps requiring user approval or rejection.
- Supports status filtering (pending, approved, rejected).

**Priority and Confidence Signals**
- Review list surfaces urgency and confidence-derived relevance.
- Helps users resolve low-confidence AI outcomes first.

**Action APIs**
- Approve flow for accepting reviewed items.
- Reject flow with minimum rejection-reason validation.
- Optional update patch before final approval.

---

### 5. Reminder and Package Tracking Hub

**Unified Tracking Surface**
- Combines reminders and package tracking items in a dedicated page.
- Loads from separate services and supports independent retries.

**Reminder Management**
- Users can view active reminders and edit reminder details in modal workflows.

**Package Status Visibility**
- Active trackable items are shown with current state and refresh support.
- Empty/error states are handled per section.

---

### 6. Feedback Loop Built Into Product

**Submit Product Feedback**
- Users can submit structured feedback directly from the app.

**Feedback History and Voting**
- Users can view their feedback list and refresh after new submissions.
- Upvote capability exists for feedback items.

**Outcome**
- Product team gets continuous qualitative signal from real usage.
- Users get a visible channel for influence and issue reporting.

---

### 7. Profile and Personalization Controls

**Preference Management**
- User profile includes timezone, language, digest timing, and notification preferences.

**Localization Support**
- Interface is configured for English, Portuguese, and Spanish.
- Language changes can be applied from user profile settings.

**Current Backend Dependency Note**
- Profile page is implemented in frontend and includes graceful handling when profile endpoints are unavailable.

---

### 8. Responsive, Modern UX Foundation

**Frontend Experience**
- Built with React + TypeScript and route-level lazy loading.
- Suspense fallback patterns reduce perceived wait times.

**UI System and Components**
- Shared reusable UI components (button, card, input, modal, badge, textarea).
- Brand-token-driven styling and consistent interaction language.

**Device Coverage**
- Mobile-first layout with desktop and tablet support.
- Separate mobile navigation treatment for core sections.

---

### 9. Security and Privacy Posture (Frontend Scope)

**Token Handling**
- Access and refresh tokens are managed by a centralized API service.
- Request interceptors attach auth headers.
- 401 paths trigger refresh attempt and controlled sign-out fallback.

**Data Access Model**
- All user views and actions are tied to authenticated user context.
- Frontend behavior assumes backend-side authorization checks per endpoint.

**Error Safety**
- Global and page-level error boundaries reduce crash impact.
- Failure states avoid silent data corruption and provide retry options.

---

### 10. Technical Infrastructure (User Client)

**Runtime and Framework**
- React 19 + TypeScript
- Vite build pipeline
- React Router for route orchestration
- Axios for API access with interceptors
- i18next + react-i18next for localization

**Styling and Component Utilities**
- Tailwind CSS
- Headless UI
- Class Variance Authority
- Lucide React and react-icons

**Operational Delivery**
- Local dev via Vite
- Production build via TypeScript build + Vite bundle
- Containerized deployment supported via Docker
- Railway deployment path documented and ready

---

## Key Differentiators of the User Interface

### 1. Action-First Information Design
Not a generic inbox. The dashboard and review flow are designed to push completion and verification.

### 2. Search for Imperfect Memory
Natural language search and practical filters are optimized for recall under uncertainty.

### 3. AI + Human Correction Loop
Users can directly approve, reject, and refine AI-processed captures without leaving context.

### 4. Operational Cohesion
Dashboard, search, review, tracking, feedback, and profile are integrated in one authenticated surface.

### 5. Built for Real-World Friction
Handles empty/error/loading states explicitly and supports retry-based recovery in critical views.

---

## Primary User Journeys

### 1. Daily Triage
1. User signs in.
2. Lands on dashboard.
3. Reviews time-bucketed items.
4. Accepts/rejects/edits high-priority items.

### 2. Find-and-Act
1. User opens search.
2. Enters natural query with filters.
3. Opens result detail.
4. Updates item and returns to results.

### 3. Resolve Flagged AI Items
1. User opens review queue.
2. Filters pending items.
3. Approves confident fixes or rejects with reason.
4. Queue updates and remaining work is reprioritized.

### 4. Tracking Check-In
1. User opens tracking page.
2. Reviews reminders and active packages.
3. Edits reminder schedule if needed.

### 5. Product Feedback Contribution
1. User submits feedback.
2. Reviews prior submissions.
3. Upvotes relevant items.

---

## Route Map

- `/login` - phone verification and sign-in
- `/` - dashboard
- `/search` - natural language search and filters
- `/tracking` - reminders and package tracking
- `/review` - flagged item review queue
- `/feedback` - feedback form and history
- `/profile` - user settings and preferences

---

## API Surface (Frontend Consumption)

**Authentication**
- verification code send
- login
- token refresh
- logout

**Dumps and Review**
- fetch user dumps
- fetch/update/delete dump
- approve/reject review actions
- enhanced dump creation and file upload

**Search**
- natural language search endpoint with pagination and filter payload

**Tracking and Reminders**
- reminder retrieval and edits
- active trackable item retrieval

**Feedback**
- submit feedback
- query feedback list
- upvote feedback

**Profile**
- fetch/update profile preferences (backend availability dependent)

---

## Non-Functional Goals

**Performance Targets (Current Product Intent)**
- Dashboard first meaningful content: under 2 seconds on typical broadband.
- Search response cycle: under 3 seconds for common queries.
- Smooth interaction during modal and navigation transitions.

**Reliability Goals**
- No silent failures on major user actions.
- Recoverable UX states for network/API interruptions.

**Maintainability Goals**
- Typed service and model layers.
- Modular pages, contexts, hooks, and shared UI components.
- Route-level code splitting for scalable growth.

---

## Current Status and Near-Term Roadmap

### Status (Implemented)
- Authentication flow and protected routes
- Dashboard, search, tracking, review, feedback, and profile pages
- API service abstraction with auth interceptors
- i18n initialization (EN/PT/ES)
- Responsive dashboard layout and shared component library

### Next Priorities
- Stabilize profile endpoint contract for full settings reliability
- Expand advanced search relevance UX and saved filters
- Improve analytics instrumentation for user journey health
- Continue polish for mobile-first interactions and accessibility audits

---

## Success Metrics for the User Interface

**Adoption and Engagement**
- Daily active authenticated users
- Session frequency per user
- Percentage of users completing at least one dashboard action per session

**Workflow Effectiveness**
- Review queue throughput (approved/rejected per day)
- Reminder interaction rate
- Time-to-resolution for flagged items

**Search Quality**
- Search-to-click conversion
- Search refinement rate
- Zero-result query ratio

**Experience Quality**
- Frontend error rate
- Failed action retry success rate
- Profile and settings save success rate

---

## Conclusion

The Clutter.AI User Web Interface transforms captured information into day-to-day action.

It gives users a practical control center with secure access, prioritized workflows, natural search, review capabilities, tracking visibility, and direct feedback channels. As backend contracts and telemetry mature, this interface is positioned to become the primary operational surface for personal organization at scale.

---

*This document reflects the user client implementation state in May 2026 and should be updated as routes, contracts, and experience priorities evolve.*
