/**
 * Phase 0 Security Verification Specification Test Suite
 * Verifies all 12 "Dirty Dozen" adversarial payloads against firestore.rules.
 * Run against the Firebase Emulator Suite (`firebase emulators:exec`) when testing locally.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  collection: string;
  operation: 'create' | 'update' | 'get' | 'list' | 'delete';
  expectedOutcome: 'PERMISSION_DENIED';
  rationale: string;
  payload?: Record<string, unknown>;
}

export const DIRTY_DOZEN_PAYLOADS: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Self-Assigned Admin Privilege Escalation',
    collection: 'users/user_eve',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'Users may only register with role == "participant"; role == "admin" is blocked.',
    payload: {
      uid: 'user_eve',
      displayName: 'Eve Attacker',
      email: 'eve@example.com',
      role: 'admin',
    },
  },
  {
    id: 2,
    name: 'Shadow Ghost Field Injection',
    collection: 'feedback/fb_shadow_1',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'Strict hasOnly() schema gate rejects undeclared ghost keys.',
    payload: {
      feedbackId: 'fb_shadow_1',
      ownerUid: 'user_eve',
      name: 'Eve',
      email: '',
      category: 'General Feedback',
      message: 'Valid length feedback message.',
      isVerified: true,
    },
  },
  {
    id: 3,
    name: 'Unverified Email Admin Spoof',
    collection: 'educational_content/article_spoof',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'isAdmin() requires request.auth.token.email_verified == true.',
  },
  {
    id: 4,
    name: 'Cross-User PII Scraping',
    collection: 'users/user_victim',
    operation: 'get',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'PII isolation restricts /users/{userId} reads strictly to owner or verified admin.',
  },
  {
    id: 5,
    name: 'Blanket Feedback Collection Scrape',
    collection: 'feedback',
    operation: 'list',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'allow list enforces existing().ownerUid == request.auth.uid || isAdmin().',
  },
  {
    id: 6,
    name: 'Orphaned Post-Survey Without Pre-Survey',
    collection: 'post_surveys/HN-2026-FAKE',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'Master gate checks exists(/pre_surveys/$(participantId)) with matching ownerUid.',
  },
  {
    id: 7,
    name: 'Identity Spoofing on Participant Registration',
    collection: 'participants/HN-2026-AB12',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'ownerUid in incoming payload must strictly equal request.auth.uid.',
    payload: {
      participantId: 'HN-2026-AB12',
      ownerUid: 'victim_uid',
    },
  },
  {
    id: 8,
    name: 'Client Timestamp Backdating',
    collection: 'quiz_results/quiz_backdate',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'createdAt must strictly equal server request.time.',
  },
  {
    id: 9,
    name: 'Oversized Message / Resource Poisoning',
    collection: 'feedback/fb_huge',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'message.size() <= 1500 rejects oversized strings.',
    payload: {
      message: 'A'.repeat(2000),
    },
  },
  {
    id: 10,
    name: 'Array Bombing on Survey Responses',
    collection: 'pre_surveys/HN-2026-AB12',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'responses.size() == 10 and adoptedHabits.size() <= 8 strictly bound list lengths.',
  },
  {
    id: 11,
    name: 'Non-Atomic Public Metric Bypass',
    collection: 'pre_surveys/HN-2026-AB12',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'existsAfter(/public_survey_metrics/$(participantId + "_PRE")) enforces batch atomicity.',
  },
  {
    id: 12,
    name: 'Value Poisoning on Participant Update',
    collection: 'participants/HN-2026-AB12',
    operation: 'update',
    expectedOutcome: 'PERMISSION_DENIED',
    rationale: 'isValidParticipant() wraps the entire update block and blocks wrong types or immutable field mutation.',
    payload: {
      postScore: '100%',
    },
  },
];
