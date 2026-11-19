# Security Specification — Health and Nutrition Awareness Portal

## 1. Data Invariants

1. **Default Deny**: All unmatched Firestore paths are strictly denied (`allow read, write: if false`).
2. **Verified Identity**: All authenticated writes require `request.auth != null && request.auth.token.email_verified == true`.
3. **Role Protection**: No user can self-assign `role: "admin"` in `/users/{userId}` or write to `/admins/{userId}`. Admin privileges are verified strictly via `/admins/{uid}` or the bootstrapped verified admin email (`veereshveeresh85846@gmail.com` with `email_verified == true`).
4. **Participant & Survey Matching**: A `post_surveys/{participantId}` document cannot be created unless the corresponding `pre_surveys/{participantId}` already exists and belongs to the same `ownerUid`.
5. **Duplicate Prevention & Immutability**: `pre_surveys/{participantId}` and `post_surveys/{participantId}` are immutable once submitted (`allow update: if false` for participants; admin correction only if needed), preventing duplicate or tampered submissions.
6. **Atomic Public Metrics**: Creating `pre_surveys/{participantId}` or `post_surveys/{participantId}` MUST atomically create the corresponding zero-PII `public_survey_metrics/{participantId}_PRE` or `{participantId}_POST` document in the same batch (`existsAfter`).
7. **PII Isolation**: `/users/{userId}` and `/feedback/{feedbackId}` (which store email addresses) can only be read by `isOwner()` or `isAdmin()`. Public testimonials live in `/testimonials/{testimonialId}` with zero PII and admin-only writes.
8. **Temporal Integrity**: All `createdAt` and `updatedAt` timestamps must equal `request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Attack Vector | Target Collection | Malicious Payload / Condition | Expected Result |
|---|---------------|-------------------|-------------------------------|-----------------|
| 1 | Self-Assigned Admin Privilege Escalation | `/users/{uid}` | `{ uid, displayName: "Eve", email: "eve@x.com", role: "admin", createdAt: serverTimestamp, updatedAt: serverTimestamp }` | `PERMISSION_DENIED` |
| 2 | Shadow Ghost Field Injection | `/feedback/{id}` | Valid feedback + `{ isApproved: true, isAdmin: true }` | `PERMISSION_DENIED` |
| 3 | Unverified Email Admin Spoof | `/admins/{uid}` or `/educational_content/{id}` | Auth token with `email: "veereshveeresh85846@gmail.com"`, `email_verified: false` | `PERMISSION_DENIED` |
| 4 | Cross-User PII Scraping (`get`) | `/users/{otherUid}` | Authenticated non-admin reading another user's profile | `PERMISSION_DENIED` |
| 5 | Cross-User Feedback Listing (`list`) | `/feedback` | Authenticated non-admin querying all feedback without `ownerUid == uid` filter | `PERMISSION_DENIED` |
| 6 | Orphaned Post-Survey Without Pre-Survey | `/post_surveys/HN-2026-FAKE` | Valid PostSurvey payload where `pre_surveys/HN-2026-FAKE` does not exist | `PERMISSION_DENIED` |
| 7 | Identity Spoofing (`ownerUid` hijack) | `/participants/HN-2026-AB12` | `{ participantId: "HN-2026-AB12", ownerUid: "victim_uid", ... }` | `PERMISSION_DENIED` |
| 8 | Client Timestamp Backdating | `/quiz_results/{id}` | Valid QuizResult with `createdAt: Timestamp(2020-01-01)` instead of `request.time` | `PERMISSION_DENIED` |
| 9 | Resource Poisoning (1MB ID / Oversized String) | `/feedback/{id}` | `message` of length 2000 (> 1500 maxLength) or invalid doc ID `../hack` | `PERMISSION_DENIED` |
| 10 | Array Bombing (Unbounded `adoptedHabits`) | `/pre_surveys/HN-2026-AB12` | `adoptedHabits` with 50 items (> max 8) or `responses` with 100 items (!= 10) | `PERMISSION_DENIED` |
| 11 | Non-Atomic Metric Bypass | `/pre_surveys/HN-2026-AB12` | Creating `pre_surveys` without atomic `public_survey_metrics/HN-2026-AB12_PRE` | `PERMISSION_DENIED` |
| 12 | Value Poisoning on Participant Update | `/participants/HN-2026-AB12` | Updating whitelisted `postScore` with `"100%"` (string instead of number) or mutating `createdAt` | `PERMISSION_DENIED` |
