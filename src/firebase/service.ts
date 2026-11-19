import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  AgeGroup,
  AnalyticsComputation,
  EducationalArticle,
  EducationLevel,
  EducationTopic,
  FeedbackCategory,
  FeedbackRecord,
  FoodHabitType,
  GenderOption,
  ParticipantRecord,
  PostSurveyRecord,
  PreSurveyRecord,
  PublicSurveyMetric,
  PublicTestimonial,
  QuizResultRecord,
} from '../types/portal';
import { HEALTHY_HABITS_LIST, SURVEY_QUESTIONS } from '../data/curriculum';
import { auth, BOOTSTRAPPED_ADMIN_EMAIL, db, handleFirestoreError, OperationType } from './config';

// Verbatim validation regex constants from firebase-blueprint.json
export const PARTICIPANT_ID_REGEX = /^HN-[0-9]{4}-[A-Z0-9]{4,8}$/;
export const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
export const DATE_STRING_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

const LOCAL_SANDBOX_KEY = 'nutriaware_local_sandbox_v1';

export function generateParticipantId(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `HN-${year}-${suffix}`;
}

export function generateDocId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const ts = Date.now().toString(36);
  return `${prefix}_${ts}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60);
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function scoreSurveyResponses(responses: number[]): {
  correctCount: number;
  totalQuestions: 10;
  percentage: number;
} {
  let correctCount = 0;
  for (let i = 0; i < SURVEY_QUESTIONS.length; i++) {
    if (responses[i] === SURVEY_QUESTIONS[i].correctIndex) {
      correctCount += 1;
    }
  }
  const percentage = Math.round((correctCount / SURVEY_QUESTIONS.length) * 100);
  return { correctCount, totalQuestions: 10, percentage };
}

/**
 * Computes all required VTU evaluation metrics strictly from provided survey metrics.
 * Only compares valid matched participant records (those having BOTH PRE-SURVEY and POST-SURVEY).
 */
export function computeAnalyticsFromMetrics(
  metrics: PublicSurveyMetric[],
  registeredParticipantCount?: number
): AnalyticsComputation {
  const preMap = new Map<string, PublicSurveyMetric>();
  const postMap = new Map<string, PublicSurveyMetric>();

  for (const m of metrics) {
    if (m.surveyType === 'PRE-SURVEY') {
      preMap.set(m.participantId, m);
    } else if (m.surveyType === 'POST-SURVEY') {
      postMap.set(m.participantId, m);
    }
  }

  const preList = Array.from(preMap.values());
  const postList = Array.from(postMap.values());

  const matchedPairs: AnalyticsComputation['matchedPairs'] = [];
  for (const [participantId, preDoc] of preMap.entries()) {
    const postDoc = postMap.get(participantId);
    if (postDoc) {
      matchedPairs.push({
        participantId,
        preScore: preDoc.percentage,
        postScore: postDoc.percentage,
        delta: Number((postDoc.percentage - preDoc.percentage).toFixed(1)),
        preDate: preDoc.submissionDate,
        postDate: postDoc.submissionDate,
      });
    }
  }

  const avgPreScoreAll =
    preList.length > 0
      ? Number((preList.reduce((acc, cur) => acc + cur.percentage, 0) / preList.length).toFixed(1))
      : 0;

  const avgPreScoreMatched =
    matchedPairs.length > 0
      ? Number((matchedPairs.reduce((acc, cur) => acc + cur.preScore, 0) / matchedPairs.length).toFixed(1))
      : 0;

  const avgPostScoreMatched =
    matchedPairs.length > 0
      ? Number((matchedPairs.reduce((acc, cur) => acc + cur.postScore, 0) / matchedPairs.length).toFixed(1))
      : 0;

  // Formula: ((Post-Survey Average - Pre-Survey Average) / Pre-Survey Average) * 100
  // Handle zero baseline safely.
  let improvementPercentage: number | null = null;
  if (matchedPairs.length > 0 && avgPreScoreMatched > 0) {
    improvementPercentage = Number(
      (((avgPostScoreMatched - avgPreScoreMatched) / avgPreScoreMatched) * 100).toFixed(1)
    );
  }

  const classify = (list: PublicSurveyMetric[]) => {
    let low = 0;
    let moderate = 0;
    let high = 0;
    for (const item of list) {
      if (item.percentage < 50) low += 1;
      else if (item.percentage < 80) moderate += 1;
      else high += 1;
    }
    return { low, moderate, high };
  };

  // Question-wise accuracy (%) across matched or available respondents
  const qPreBase = matchedPairs.length > 0 ? matchedPairs.map((p) => preMap.get(p.participantId)!) : preList;
  const qPostBase = matchedPairs.length > 0 ? matchedPairs.map((p) => postMap.get(p.participantId)!) : postList;

  const questionWisePre = SURVEY_QUESTIONS.map((q, idx) => {
    if (qPreBase.length === 0) return 0;
    const correct = qPreBase.filter((doc) => doc.responses[idx] === q.correctIndex).length;
    return Number(((correct / qPreBase.length) * 100).toFixed(1));
  });

  const questionWisePost = SURVEY_QUESTIONS.map((q, idx) => {
    if (qPostBase.length === 0) return 0;
    const correct = qPostBase.filter((doc) => doc.responses[idx] === q.correctIndex).length;
    return Number(((correct / qPostBase.length) * 100).toFixed(1));
  });

  // Healthy Practice Adoption: (Adopted / Total valid respondents) * 100
  const habitAdoptionPre: Record<string, number> = {};
  const habitAdoptionPost: Record<string, number> = {};
  for (const habit of HEALTHY_HABITS_LIST) {
    habitAdoptionPre[habit] =
      preList.length > 0
        ? Number(((preList.filter((d) => d.adoptedHabits.includes(habit)).length / preList.length) * 100).toFixed(1))
        : 0;
    habitAdoptionPost[habit] =
      postList.length > 0
        ? Number(((postList.filter((d) => d.adoptedHabits.includes(habit)).length / postList.length) * 100).toFixed(1))
        : 0;
  }

  return {
    totalRegisteredParticipants:
      registeredParticipantCount !== undefined
        ? Math.max(registeredParticipantCount, preList.length)
        : preList.length,
    preSurveyCount: preList.length,
    postSurveyCount: postList.length,
    matchedCount: matchedPairs.length,
    avgPreScoreAll,
    avgPreScoreMatched,
    avgPostScoreMatched,
    improvementPercentage,
    awarenessLevelsPre: classify(preList),
    awarenessLevelsPost: classify(postList),
    questionWisePre,
    questionWisePost,
    habitAdoptionPre,
    habitAdoptionPost,
    matchedPairs,
  };
}

// =========================================================
// User Profile & RBAC Admin Verification
// =========================================================

export async function syncUserProfile(): Promise<{ isAdmin: boolean }> {
  const user = auth.currentUser;
  if (!user) return { isAdmin: false };

  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: (user.displayName || 'Portal Participant').trim().slice(0, 100),
        email: (user.email || 'user@example.com').trim().slice(0, 160),
        role: 'participant',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }

  // Check admin privilege via verified bootstrapped email OR /admins/{uid}
  if (user.emailVerified && user.email === BOOTSTRAPPED_ADMIN_EMAIL) {
    return { isAdmin: true };
  }

  try {
    const adminSnap = await getDoc(doc(db, 'admins', user.uid));
    return { isAdmin: adminSnap.exists() };
  } catch {
    return { isAdmin: false };
  }
}

// =========================================================
// Pre-Survey & Post-Survey Atomic Firestore Submissions
// =========================================================

export interface PreSurveySubmitInput {
  participantId: string;
  ageGroup: AgeGroup;
  gender: GenderOption;
  educationLevel: EducationLevel;
  foodHabits: FoodHabitType;
  responses: number[];
  adoptedHabits: string[];
  consentGiven: boolean;
}

export async function submitPreSurveyFirestore(input: PreSurveySubmitInput): Promise<{
  participantId: string;
  correctCount: number;
  percentage: number;
}> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Please sign in with Google to save your Pre-Survey to the Firestore database.');
  }

  const pid = input.participantId.trim().toUpperCase();
  if (!PARTICIPANT_ID_REGEX.test(pid)) {
    throw new Error('Invalid Participant ID format.');
  }
  if (!input.consentGiven) {
    throw new Error('Please confirm data consent before submitting.');
  }
  if (input.responses.length !== 10 || input.responses.some((r) => r < 0 || r > 3)) {
    throw new Error('Please answer all 10 awareness questions.');
  }

  // Duplicate prevention check
  const existingPreRef = doc(db, 'pre_surveys', pid);
  try {
    const existingSnap = await getDoc(existingPreRef);
    if (existingSnap.exists()) {
      throw new Error(`A Pre-Survey has already been recorded for Participant ID ${pid}.`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('already been recorded')) {
      throw error;
    }
    // If permission denied on reading non-owned doc with same ID, treat as duplicate/conflict
    if (error instanceof Error && error.message.toLowerCase().includes('permission')) {
      throw new Error(`Participant ID ${pid} is already taken. Please generate a new Participant ID.`);
    }
  }

  const { correctCount, totalQuestions, percentage } = scoreSurveyResponses(input.responses);
  const submissionDate = getTodayIsoDate();
  const boundedHabits = input.adoptedHabits.slice(0, 8).map((h) => h.slice(0, 120));

  const batch = writeBatch(db);

  batch.set(doc(db, 'participants', pid), {
    participantId: pid,
    ownerUid: user.uid,
    ageGroup: input.ageGroup,
    gender: input.gender,
    educationLevel: input.educationLevel,
    foodHabits: input.foodHabits,
    preSurveyCompleted: true,
    postSurveyCompleted: false,
    preScore: percentage,
    postScore: 0,
    learningModulesCompleted: [],
    consentGiven: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.set(existingPreRef, {
    participantId: pid,
    ownerUid: user.uid,
    surveyType: 'PRE-SURVEY',
    responses: input.responses,
    correctCount,
    totalQuestions,
    percentage,
    adoptedHabits: boundedHabits,
    consentGiven: true,
    submissionDate,
    createdAt: serverTimestamp(),
  });

  batch.set(doc(db, 'public_survey_metrics', `${pid}_PRE`), {
    participantId: pid,
    ownerUid: user.uid,
    surveyType: 'PRE-SURVEY',
    responses: input.responses,
    correctCount,
    totalQuestions,
    percentage,
    adoptedHabits: boundedHabits,
    submissionDate,
    isPublicMetric: true,
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `pre_surveys/${pid}`);
  }

  return { participantId: pid, correctCount, percentage };
}

export interface PostSurveySubmitInput {
  participantId: string;
  responses: number[];
  adoptedHabits: string[];
  learningFeedback: string;
  rating: number;
  consentGiven: boolean;
}

export async function submitPostSurveyFirestore(input: PostSurveySubmitInput): Promise<{
  participantId: string;
  preScore: number;
  postScore: number;
  correctCount: number;
}> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Please sign in with Google to save your Post-Survey to the Firestore database.');
  }

  const pid = input.participantId.trim().toUpperCase();
  if (!PARTICIPANT_ID_REGEX.test(pid)) {
    throw new Error('Enter a valid Participant ID (e.g., HN-2026-AB12CD).');
  }
  if (!input.consentGiven) {
    throw new Error('Please confirm data consent before submitting.');
  }
  if (input.responses.length !== 10 || input.responses.some((r) => r < 0 || r > 3)) {
    throw new Error('Please answer all 10 knowledge questions.');
  }

  // Verify matching Pre-Survey exists and belongs to user
  const preRef = doc(db, 'pre_surveys', pid);
  let preScore = 0;
  try {
    const preSnap = await getDoc(preRef);
    if (!preSnap.exists()) {
      throw new Error(
        `No matching Pre-Survey found for Participant ID ${pid}. Please complete the Pre-Program Survey first.`
      );
    }
    const preData = preSnap.data() as PreSurveyRecord;
    preScore = preData.percentage;
  } catch (error) {
    if (error instanceof Error && error.message.includes('No matching Pre-Survey')) {
      throw error;
    }
    throw new Error(
      `Could not verify Pre-Survey for ${pid}. Ensure you are signed in with the same account used for the Pre-Survey.`
    );
  }

  // Prevent duplicate Post-Survey
  const postRef = doc(db, 'post_surveys', pid);
  try {
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      throw new Error(`A Post-Survey has already been completed for Participant ID ${pid}.`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('already been completed')) {
      throw error;
    }
  }

  const { correctCount, totalQuestions, percentage } = scoreSurveyResponses(input.responses);
  const submissionDate = getTodayIsoDate();
  const boundedHabits = input.adoptedHabits.slice(0, 8).map((h) => h.slice(0, 120));
  const sanitizedFeedback = input.learningFeedback.trim().slice(0, 1000);
  const boundedRating = Math.min(5, Math.max(1, Math.round(input.rating)));

  const batch = writeBatch(db);

  batch.set(postRef, {
    participantId: pid,
    ownerUid: user.uid,
    surveyType: 'POST-SURVEY',
    responses: input.responses,
    correctCount,
    totalQuestions,
    percentage,
    adoptedHabits: boundedHabits,
    learningFeedback: sanitizedFeedback,
    rating: boundedRating,
    consentGiven: true,
    submissionDate,
    createdAt: serverTimestamp(),
  });

  batch.set(doc(db, 'public_survey_metrics', `${pid}_POST`), {
    participantId: pid,
    ownerUid: user.uid,
    surveyType: 'POST-SURVEY',
    responses: input.responses,
    correctCount,
    totalQuestions,
    percentage,
    adoptedHabits: boundedHabits,
    submissionDate,
    isPublicMetric: true,
    createdAt: serverTimestamp(),
  });

  batch.update(doc(db, 'participants', pid), {
    postSurveyCompleted: true,
    postScore: percentage,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `post_surveys/${pid}`);
  }

  return { participantId: pid, preScore, postScore: percentage, correctCount };
}

export async function updateParticipantLearningProgress(
  participantId: string,
  completedModules: string[]
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !PARTICIPANT_ID_REGEX.test(participantId)) return;

  const bounded = Array.from(new Set(completedModules)).slice(0, 6);
  const partRef = doc(db, 'participants', participantId);
  try {
    await updateDoc(partRef, {
      learningModulesCompleted: bounded,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `participants/${participantId}`);
  }
}

// =========================================================
// Quiz Results & Feedback Submissions
// =========================================================

export async function saveQuizResultFirestore(
  correctCount: number,
  totalQuestions: 15,
  participantId: string
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to save your quiz score to Firestore.');

  const resultId = generateDocId('quiz');
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  try {
    await setDoc(doc(db, 'quiz_results', resultId), {
      resultId,
      ownerUid: user.uid,
      participantId: participantId.trim().slice(0, 32),
      correctCount,
      incorrectCount,
      totalQuestions,
      percentage,
      createdAt: serverTimestamp(),
    });
    return resultId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `quiz_results/${resultId}`);
  }
}

export async function submitFeedbackFirestore(input: {
  name: string;
  email: string;
  category: FeedbackCategory;
  message: string;
}): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in with Google to submit feedback to Firestore.');

  const feedbackId = generateDocId('fb');
  const cleanName = input.name.trim().slice(0, 100);
  const cleanEmail = input.email.trim().slice(0, 160);
  const cleanMessage = input.message.trim().slice(0, 1500);

  if (cleanName.length < 1 || cleanMessage.length < 5) {
    throw new Error('Please provide your name and a message of at least 5 characters.');
  }

  try {
    await setDoc(doc(db, 'feedback', feedbackId), {
      feedbackId,
      ownerUid: user.uid,
      name: cleanName,
      email: cleanEmail,
      category: input.category,
      message: cleanMessage,
      createdAt: serverTimestamp(),
    });
    return feedbackId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `feedback/${feedbackId}`);
  }
}

// =========================================================
// Public Reads (Zero-PII Collections) & User Own Reads
// =========================================================

export async function fetchPublicSurveyMetrics(): Promise<PublicSurveyMetric[]> {
  try {
    const q = query(
      collection(db, 'public_survey_metrics'),
      where('isPublicMetric', '==', true)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as PublicSurveyMetric);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'public_survey_metrics');
  }
}

export async function fetchPublishedTestimonials(): Promise<PublicTestimonial[]> {
  try {
    const q = query(collection(db, 'testimonials'), where('isPublished', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as PublicTestimonial);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'testimonials');
  }
}

export async function fetchPublishedEducationContent(): Promise<EducationalArticle[]> {
  try {
    const q = query(collection(db, 'educational_content'), where('isPublished', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as EducationalArticle);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'educational_content');
  }
}

export async function fetchUserOwnParticipants(uid: string): Promise<ParticipantRecord[]> {
  try {
    const q = query(collection(db, 'participants'), where('ownerUid', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ParticipantRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'participants');
  }
}

// =========================================================
// Admin-Only Queries & Mutations (Protected by RBAC Rules)
// =========================================================

export async function fetchAdminDashboardBundle(): Promise<{
  participants: ParticipantRecord[];
  preSurveys: PreSurveyRecord[];
  postSurveys: PostSurveyRecord[];
  quizResults: QuizResultRecord[];
  feedback: FeedbackRecord[];
  testimonials: PublicTestimonial[];
  educationalContent: EducationalArticle[];
}> {
  const safeList = async <T,>(colName: string): Promise<T[]> => {
    try {
      const snap = await getDocs(collection(db, colName));
      return snap.docs.map((d) => d.data() as T);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colName);
    }
  };

  const [participants, preSurveys, postSurveys, quizResults, feedback, testimonials, educationalContent] =
    await Promise.all([
      safeList<ParticipantRecord>('participants'),
      safeList<PreSurveyRecord>('pre_surveys'),
      safeList<PostSurveyRecord>('post_surveys'),
      safeList<QuizResultRecord>('quiz_results'),
      safeList<FeedbackRecord>('feedback'),
      safeList<PublicTestimonial>('testimonials'),
      safeList<EducationalArticle>('educational_content'),
    ]);

  return {
    participants,
    preSurveys,
    postSurveys,
    quizResults,
    feedback,
    testimonials,
    educationalContent,
  };
}

export async function adminSaveEducationalArticle(input: {
  contentId?: string;
  topic: EducationTopic;
  title: string;
  summary: string;
  body: string;
  keyPoints: string[];
  readTimeMinutes: number;
  isPublished: boolean;
}): Promise<string> {
  const isUpdate = Boolean(input.contentId);
  const contentId = input.contentId || generateDocId('article');
  const docRef = doc(db, 'educational_content', contentId);

  const boundedPoints = input.keyPoints
    .map((p) => p.trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, 8);

  const payload = {
    contentId,
    topic: input.topic,
    title: input.title.trim().slice(0, 140),
    summary: input.summary.trim().slice(0, 400),
    body: input.body.trim().slice(0, 5000),
    keyPoints: boundedPoints.length > 0 ? boundedPoints : ['Key health awareness insight'],
    readTimeMinutes: Math.min(30, Math.max(1, Math.round(input.readTimeMinutes || 4))),
    isPublished: Boolean(input.isPublished),
    updatedAt: serverTimestamp(),
  };

  try {
    if (isUpdate) {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        await updateDoc(docRef, payload);
        return contentId;
      }
    }
    await setDoc(docRef, {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return contentId;
  } catch (error) {
    handleFirestoreError(
      error,
      isUpdate ? OperationType.UPDATE : OperationType.CREATE,
      `educational_content/${contentId}`
    );
  }
}

export async function adminDeleteEducationalArticle(contentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'educational_content', contentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `educational_content/${contentId}`);
  }
}

export async function adminPublishTestimonial(input: {
  authorName: string;
  roleLabel: string;
  quote: string;
  improvementSummary: string;
}): Promise<string> {
  const testimonialId = generateDocId('testim');
  try {
    await setDoc(doc(db, 'testimonials', testimonialId), {
      testimonialId,
      authorName: input.authorName.trim().slice(0, 80),
      roleLabel: input.roleLabel.trim().slice(0, 80),
      quote: input.quote.trim().slice(0, 500),
      improvementSummary: input.improvementSummary.trim().slice(0, 120),
      isPublished: true,
      createdAt: serverTimestamp(),
    });
    return testimonialId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `testimonials/${testimonialId}`);
  }
}

export async function adminDeleteTestimonial(testimonialId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'testimonials', testimonialId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `testimonials/${testimonialId}`);
  }
}

// =========================================================
// Local Demonstration Sandbox (Clearly Labelled Fallback)
// =========================================================

export interface LocalSandboxData {
  participants: ParticipantRecord[];
  metrics: PublicSurveyMetric[];
}

export function loadLocalSandbox(): LocalSandboxData {
  try {
    const raw = localStorage.getItem(LOCAL_SANDBOX_KEY);
    if (!raw) return { participants: [], metrics: [] };
    const parsed = JSON.parse(raw) as LocalSandboxData;
    return {
      participants: Array.isArray(parsed.participants) ? parsed.participants : [],
      metrics: Array.isArray(parsed.metrics) ? parsed.metrics : [],
    };
  } catch {
    return { participants: [], metrics: [] };
  }
}

export function savePreSurveyLocalSandbox(input: PreSurveySubmitInput): {
  participantId: string;
  correctCount: number;
  percentage: number;
} {
  const pid = input.participantId.trim().toUpperCase();
  const data = loadLocalSandbox();
  if (data.metrics.some((m) => m.participantId === pid && m.surveyType === 'PRE-SURVEY')) {
    throw new Error(`Local sandbox already contains a Pre-Survey for ${pid}.`);
  }
  const { correctCount, totalQuestions, percentage } = scoreSurveyResponses(input.responses);
  const submissionDate = getTodayIsoDate();

  data.participants.push({
    participantId: pid,
    ownerUid: 'local-sandbox',
    ageGroup: input.ageGroup,
    gender: input.gender,
    educationLevel: input.educationLevel,
    foodHabits: input.foodHabits,
    preSurveyCompleted: true,
    postSurveyCompleted: false,
    preScore: percentage,
    postScore: 0,
    learningModulesCompleted: [],
    consentGiven: true,
    isDemo: true,
  });

  data.metrics.push({
    participantId: pid,
    ownerUid: 'local-sandbox',
    surveyType: 'PRE-SURVEY',
    responses: input.responses,
    correctCount,
    totalQuestions,
    percentage,
    adoptedHabits: input.adoptedHabits.slice(0, 8),
    submissionDate,
    isPublicMetric: true,
    isDemo: true,
  });

  localStorage.setItem(LOCAL_SANDBOX_KEY, JSON.stringify(data));
  return { participantId: pid, correctCount, percentage };
}

export function savePostSurveyLocalSandbox(input: PostSurveySubmitInput): {
  participantId: string;
  preScore: number;
  postScore: number;
  correctCount: number;
} {
  const pid = input.participantId.trim().toUpperCase();
  const data = loadLocalSandbox();
  const preDoc = data.metrics.find((m) => m.participantId === pid && m.surveyType === 'PRE-SURVEY');
  if (!preDoc) {
    throw new Error(`No Local Sandbox Pre-Survey found for ${pid}. Complete the Pre-Survey first.`);
  }
  if (data.metrics.some((m) => m.participantId === pid && m.surveyType === 'POST-SURVEY')) {
    throw new Error(`Local Sandbox Post-Survey already completed for ${pid}.`);
  }
  const { correctCount, totalQuestions, percentage } = scoreSurveyResponses(input.responses);
  const submissionDate = getTodayIsoDate();

  data.metrics.push({
    participantId: pid,
    ownerUid: 'local-sandbox',
    surveyType: 'POST-SURVEY',
    responses: input.responses,
    correctCount,
    totalQuestions,
    percentage,
    adoptedHabits: input.adoptedHabits.slice(0, 8),
    submissionDate,
    isPublicMetric: true,
    isDemo: true,
  });

  const pIdx = data.participants.findIndex((p) => p.participantId === pid);
  if (pIdx >= 0) {
    data.participants[pIdx].postSurveyCompleted = true;
    data.participants[pIdx].postScore = percentage;
  }

  localStorage.setItem(LOCAL_SANDBOX_KEY, JSON.stringify(data));
  return { participantId: pid, preScore: preDoc.percentage, postScore: percentage, correctCount };
}

// =========================================================
// CSV Report Generator
// =========================================================

export function downloadCsvFile(filename: string, headers: string[], rows: (string | number | boolean)[][]): void {
  const escapeCell = (val: string | number | boolean) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvLines = [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))];
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
