export type PageRoute =
  | 'home'
  | 'about'
  | 'nutrition'
  | 'diet-planner'
  | 'pre-survey'
  | 'learning'
  | 'quiz'
  | 'post-survey'
  | 'dashboard'
  | 'admin'
  | 'contact';

export type AgeGroup = 'Under 18' | '18-24' | '25-34' | '35-49' | '50+';
export type GenderOption = 'Prefer not to say' | 'Female' | 'Male' | 'Non-binary';
export type EducationLevel =
  | 'High School'
  | 'Undergraduate (VTU / College)'
  | 'Postgraduate'
  | 'Working Professional'
  | 'Other';
export type FoodHabitType = 'Vegetarian' | 'Eggetarian' | 'Non-Vegetarian' | 'Vegan';

export type EducationTopic =
  | 'Balanced Diet'
  | 'Macronutrients'
  | 'Micronutrients'
  | 'Healthy Habits'
  | 'Personal Hygiene'
  | 'Healthy Lifestyle';

export type FeedbackCategory =
  | 'General Feedback'
  | 'Program Experience'
  | 'Suggestion'
  | 'Technical Inquiry';

export interface SurveyQuestion {
  id: number;
  shortLabel: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface ParticipantRecord {
  participantId: string;
  ownerUid: string;
  ageGroup: AgeGroup;
  gender: GenderOption;
  educationLevel: EducationLevel;
  foodHabits: FoodHabitType;
  preSurveyCompleted: boolean;
  postSurveyCompleted: boolean;
  preScore: number;
  postScore: number;
  learningModulesCompleted: string[];
  consentGiven: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  isDemo?: boolean;
}

export interface PreSurveyRecord {
  participantId: string;
  ownerUid: string;
  surveyType: 'PRE-SURVEY';
  responses: number[];
  correctCount: number;
  totalQuestions: 10;
  percentage: number;
  adoptedHabits: string[];
  consentGiven: true;
  submissionDate: string;
  createdAt?: unknown;
  isDemo?: boolean;
}

export interface PostSurveyRecord {
  participantId: string;
  ownerUid: string;
  surveyType: 'POST-SURVEY';
  responses: number[];
  correctCount: number;
  totalQuestions: 10;
  percentage: number;
  adoptedHabits: string[];
  learningFeedback: string;
  rating: number;
  consentGiven: true;
  submissionDate: string;
  createdAt?: unknown;
  isDemo?: boolean;
}

export interface PublicSurveyMetric {
  participantId: string;
  ownerUid: string;
  surveyType: 'PRE-SURVEY' | 'POST-SURVEY';
  responses: number[];
  correctCount: number;
  totalQuestions: 10;
  percentage: number;
  adoptedHabits: string[];
  submissionDate: string;
  isPublicMetric: true;
  createdAt?: unknown;
  isDemo?: boolean;
}

export interface QuizResultRecord {
  resultId: string;
  ownerUid: string;
  participantId: string;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: 15;
  percentage: number;
  createdAt?: unknown;
}

export interface FeedbackRecord {
  feedbackId: string;
  ownerUid: string;
  name: string;
  email: string;
  category: FeedbackCategory;
  message: string;
  createdAt?: unknown;
}

export interface PublicTestimonial {
  testimonialId: string;
  authorName: string;
  roleLabel: string;
  quote: string;
  improvementSummary: string;
  isPublished: boolean;
  createdAt?: unknown;
}

export interface EducationalArticle {
  contentId: string;
  topic: EducationTopic;
  title: string;
  summary: string;
  body: string;
  keyPoints: string[];
  readTimeMinutes: number;
  isPublished: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  isBuiltIn?: boolean;
  imageUrl?: string;
}

export interface DietFoodItem {
  id: string;
  name: string;
  mealSlot: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  foodGroup: 'Complex Carbs' | 'Protein' | 'Vitamins & Fibre' | 'Calcium & Probiotics' | 'Healthy Fats';
  portion: string;
  approxCalories: number;
  benefit: string;
}

export interface LearningModuleItem {
  id: string;
  number: string;
  title: string;
  topic: EducationTopic;
  duration: string;
  imageUrl: string;
  summary: string;
  sections: { heading: string; content: string }[];
  actionTips: string[];
  activityQuestion: string;
  activityOptions: string[];
  activityCorrectIndex: number;
  activityFeedback: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface AnalyticsComputation {
  totalRegisteredParticipants: number;
  preSurveyCount: number;
  postSurveyCount: number;
  matchedCount: number;
  avgPreScoreAll: number;
  avgPreScoreMatched: number;
  avgPostScoreMatched: number;
  improvementPercentage: number | null;
  awarenessLevelsPre: { low: number; moderate: number; high: number };
  awarenessLevelsPost: { low: number; moderate: number; high: number };
  questionWisePre: number[];
  questionWisePost: number[];
  habitAdoptionPre: Record<string, number>;
  habitAdoptionPost: Record<string, number>;
  matchedPairs: {
    participantId: string;
    preScore: number;
    postScore: number;
    delta: number;
    preDate: string;
    postDate: string;
  }[];
}
