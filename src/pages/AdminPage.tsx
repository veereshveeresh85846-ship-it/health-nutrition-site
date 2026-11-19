import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Download,
  Lock,
  LogIn,
  Plus,
  Printer,
  RefreshCw,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import {
  adminDeleteEducationalArticle,
  adminDeleteTestimonial,
  adminPublishTestimonial,
  adminSaveEducationalArticle,
  computeAnalyticsFromMetrics,
  downloadCsvFile,
  fetchAdminDashboardBundle,
} from '../firebase/service';
import {
  EducationalArticle,
  EducationTopic,
  FeedbackRecord,
  ParticipantRecord,
  PostSurveyRecord,
  PreSurveyRecord,
  PublicSurveyMetric,
  PublicTestimonial,
  QuizResultRecord,
} from '../types/portal';

type AdminTab = 'overview' | 'surveys' | 'feedback' | 'content';

const TOPICS: EducationTopic[] = [
  'Balanced Diet',
  'Macronutrients',
  'Micronutrients',
  'Healthy Habits',
  'Personal Hygiene',
  'Healthy Lifestyle',
];

export const AdminPage: React.FC = () => {
  const {
    user,
    authReady,
    isAdmin,
    signingIn,
    signInWithGoogle,
    pushToast,
    refreshEducationalContent,
    refreshTestimonials,
  } = usePortal();

  const [tab, setTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [participants, setParticipants] = useState<ParticipantRecord[]>([]);
  const [preSurveys, setPreSurveys] = useState<PreSurveyRecord[]>([]);
  const [postSurveys, setPostSurveys] = useState<PostSurveyRecord[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResultRecord[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);
  const [articles, setArticles] = useState<EducationalArticle[]>([]);

  // Educational Content Form State
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [artTopic, setArtTopic] = useState<EducationTopic>('Balanced Diet');
  const [artTitle, setArtTitle] = useState('');
  const [artSummary, setArtSummary] = useState('');
  const [artBody, setArtBody] = useState('');
  const [artKeyPoints, setArtKeyPoints] = useState('');
  const [artReadTime, setArtReadTime] = useState(4);
  const [savingArt, setSavingArt] = useState(false);

  // Testimonial Publisher State
  const [testimName, setTestimName] = useState('');
  const [testimRole, setTestimRole] = useState('VTU Student Participant');
  const [testimQuote, setTestimQuote] = useState('');
  const [testimImprovement, setTestimImprovement] = useState('');
  const [publishingTestim, setPublishingTestim] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const bundle = await fetchAdminDashboardBundle();
      setParticipants(bundle.participants);
      setPreSurveys(bundle.preSurveys);
      setPostSurveys(bundle.postSurveys);
      setQuizResults(bundle.quizResults);
      setFeedbackList(bundle.feedback);
      setTestimonials(bundle.testimonials);
      setArticles(bundle.educationalContent);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to load admin data.';
      pushToast('error', msg);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, pushToast]);

  useEffect(() => {
    if (authReady && isAdmin) {
      void loadAdminData();
    }
  }, [authReady, isAdmin, loadAdminData]);

  const combinedMetrics: PublicSurveyMetric[] = useMemo(() => {
    const pre: PublicSurveyMetric[] = preSurveys.map((p) => ({
      ...p,
      isPublicMetric: true,
    }));
    const post: PublicSurveyMetric[] = postSurveys.map((p) => ({
      participantId: p.participantId,
      ownerUid: p.ownerUid,
      surveyType: 'POST-SURVEY',
      responses: p.responses,
      correctCount: p.correctCount,
      totalQuestions: 10,
      percentage: p.percentage,
      adoptedHabits: p.adoptedHabits,
      submissionDate: p.submissionDate,
      isPublicMetric: true,
    }));
    return [...pre, ...post];
  }, [preSurveys, postSurveys]);

  const stats = useMemo(
    () => computeAnalyticsFromMetrics(combinedMetrics, participants.length),
    [combinedMetrics, participants.length]
  );

  const filteredParticipants = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter(
      (p) =>
        p.participantId.toLowerCase().includes(q) ||
        p.ageGroup.toLowerCase().includes(q) ||
        p.educationLevel.toLowerCase().includes(q) ||
        p.foodHabits.toLowerCase().includes(q)
    );
  }, [participants, searchTerm]);

  const handleExportFullReport = () => {
    const headers = [
      'Participant ID',
      'Age Group',
      'Gender',
      'Education Level',
      'Food Habits',
      'Pre Completed',
      'Pre Score (%)',
      'Post Completed',
      'Post Score (%)',
      'Point Change',
      'Modules Completed',
    ];
    const rows = participants.map((p) => [
      p.participantId,
      p.ageGroup,
      p.gender,
      p.educationLevel,
      p.foodHabits,
      p.preSurveyCompleted ? 'Yes' : 'No',
      p.preScore,
      p.postSurveyCompleted ? 'Yes' : 'No',
      p.postSurveyCompleted ? p.postScore : '',
      p.postSurveyCompleted ? p.postScore - p.preScore : '',
      p.learningModulesCompleted.length,
    ]);
    downloadCsvFile(
      `vtu_admin_survey_report_${new Date().toISOString().slice(0, 10)}.csv`,
      headers,
      rows
    );
    pushToast('success', 'Full participant report downloaded as CSV.');
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (artTitle.trim().length < 3 || artSummary.trim().length < 10 || artBody.trim().length < 20) {
      pushToast('error', 'Please fill title (3+ chars), summary (10+ chars), and body (20+ chars).');
      return;
    }
    setSavingArt(true);
    try {
      const points = artKeyPoints
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      await adminSaveEducationalArticle({
        contentId: editingId,
        topic: artTopic,
        title: artTitle,
        summary: artSummary,
        body: artBody,
        keyPoints: points,
        readTimeMinutes: artReadTime,
        isPublished: true,
      });
      pushToast('success', editingId ? 'Educational article updated.' : 'Educational article published.');
      setEditingId(undefined);
      setArtTitle('');
      setArtSummary('');
      setArtBody('');
      setArtKeyPoints('');
      setArtReadTime(4);
      await Promise.all([loadAdminData(), refreshEducationalContent()]);
    } catch (err) {
      pushToast('error', err instanceof Error ? err.message : 'Failed to save article.');
    } finally {
      setSavingArt(false);
    }
  };

  const handleDeleteArticle = async (contentId: string) => {
    try {
      await adminDeleteEducationalArticle(contentId);
      pushToast('info', 'Article removed from Firestore.');
      await Promise.all([loadAdminData(), refreshEducationalContent()]);
    } catch (err) {
      pushToast('error', err instanceof Error ? err.message : 'Could not delete article.');
    }
  };

  const handlePublishTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testimName.trim().length < 2 || testimQuote.trim().length < 10) {
      pushToast('error', 'Provide author name and a genuine quote (10+ characters).');
      return;
    }
    setPublishingTestim(true);
    try {
      await adminPublishTestimonial({
        authorName: testimName,
        roleLabel: testimRole,
        quote: testimQuote,
        improvementSummary: testimImprovement,
      });
      pushToast('success', 'Sanitized testimonial published to Home page.');
      setTestimName('');
      setTestimQuote('');
      setTestimImprovement('');
      await Promise.all([loadAdminData(), refreshTestimonials()]);
    } catch (err) {
      pushToast('error', err instanceof Error ? err.message : 'Failed to publish testimonial.');
    } finally {
      setPublishingTestim(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      await adminDeleteTestimonial(testimonialId);
      pushToast('info', 'Testimonial removed.');
      await Promise.all([loadAdminData(), refreshTestimonials()]);
    } catch (err) {
      pushToast('error', err instanceof Error ? err.message : 'Could not delete testimonial.');
    }
  };

  // Unauthenticated gate
  if (!authReady) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-sm text-slate-500">
        Verifying authentication session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-950 py-16">
        <div className="max-w-lg mx-auto px-4">
          <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard Sign-In
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Administrative access is enforced via Firebase Authentication and Firestore Role-Based Access Control (RBAC). No hardcoded passwords are stored in client code.
              </p>
            </div>
            <button
              type="button"
              disabled={signingIn}
              onClick={() => void signInWithGoogle()}
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {signingIn ? 'Authenticating...' : 'Sign In with Authorized Admin Google Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated non-admin RBAC block
  if (!isAdmin) {
    return (
      <div className="bg-white dark:bg-slate-950 py-16">
        <div className="max-w-lg mx-auto px-4">
          <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Admin Access Restricted
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Signed in as <strong className="text-slate-900 dark:text-white">{user.email}</strong>. Your account has standard <span className="font-mono">participant</span> privileges. Firestore security rules restrict administrative participant lists, raw feedback, and content management strictly to verified program administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
              RBAC Verified Administrator · {user.email}
            </p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Admin Evaluation & Content Dashboard
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 no-print">
            <button
              type="button"
              onClick={() => void loadAdminData()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Records
            </button>
            <button
              type="button"
              onClick={handleExportFullReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Download className="w-3.5 h-3.5" />
              Export Survey Report (CSV)
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Summary
            </button>
          </div>
        </div>

        {/* Admin Sub-Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 no-print">
          {(
            [
              ['overview', `Overview & Participants (${participants.length})`],
              ['surveys', `Pre/Post Surveys (${preSurveys.length + postSurveys.length})`],
              ['feedback', `Feedback & Testimonials (${feedbackList.length})`],
              ['content', `Educational Content (${articles.length})`],
            ] as [AdminTab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                tab === id
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & PARTICIPANTS */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Participants', value: participants.length },
                { label: 'Pre-Surveys', value: preSurveys.length },
                { label: 'Post-Surveys', value: postSurveys.length },
                { label: 'Quiz Attempts', value: quizResults.length },
                {
                  label: 'Matched Improvement',
                  value:
                    stats.improvementPercentage !== null
                      ? `${stats.improvementPercentage >= 0 ? '+' : ''}${stats.improvementPercentage}%`
                      : 'N/A',
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400">{kpi.label}</p>
                  <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Registered Participants & Score Comparison
                </h2>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by ID, age, diet..."
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 sm:w-64"
                />
              </div>

              {filteredParticipants.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No participant records stored in Firestore yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <th className="py-3 px-4">Participant ID</th>
                        <th className="py-3 px-4">Age · Edu</th>
                        <th className="py-3 px-4">Diet</th>
                        <th className="py-3 px-4 text-right">Pre Score</th>
                        <th className="py-3 px-4 text-right">Post Score</th>
                        <th className="py-3 px-4 text-right">Modules</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
                      {filteredParticipants.map((p) => (
                        <tr key={p.participantId}>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                            {p.participantId}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {p.ageGroup} · {p.educationLevel}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {p.foodHabits}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-sky-700 dark:text-sky-400">
                            {p.preScore}%
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                            {p.postSurveyCompleted ? `${p.postScore}%` : 'Pending'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                            {p.learningModulesCompleted.length}/6
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRE & POST SURVEY RESPONSES */}
        {tab === 'surveys' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Pre-Survey Responses ({preSurveys.length})
                </h2>
              </div>
              {preSurveys.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No Pre-Surveys submitted yet.</p>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {preSurveys.map((s) => (
                    <div key={s.participantId} className="p-4 flex items-center justify-between text-sm">
                      <div>
                        <div className="font-mono font-semibold text-slate-900 dark:text-white">
                          {s.participantId}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Date: {s.submissionDate} · Habits reported: {s.adoptedHabits.length}
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <div className="font-bold text-sky-700 dark:text-sky-400">{s.percentage}%</div>
                        <div className="text-xs text-slate-500">{s.correctCount}/10</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Post-Survey Responses ({postSurveys.length})
                </h2>
              </div>
              {postSurveys.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No Post-Surveys submitted yet.</p>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {postSurveys.map((s) => (
                    <div key={s.participantId} className="p-4 space-y-1.5 text-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            {s.participantId}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                            {s.submissionDate} · Rating {s.rating}/5
                          </span>
                        </div>
                        <span className="font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                          {s.percentage}% ({s.correctCount}/10)
                        </span>
                      </div>
                      {s.learningFeedback && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          “{s.learningFeedback}”
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 3: FEEDBACK & PUBLIC TESTIMONIAL PUBLISHER */}
        {tab === 'feedback' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Submitted Contact & Program Feedback ({feedbackList.length})
                </h2>
              </div>
              {feedbackList.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No feedback submissions yet.</p>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {feedbackList.map((fb) => (
                    <div key={fb.feedbackId} className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {fb.name} {fb.email ? `(${fb.email})` : ''}
                        </span>
                        <span>{fb.category}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{fb.message}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setTestimName(fb.name);
                          setTestimQuote(fb.message.slice(0, 480));
                        }}
                        className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        Copy into Testimonial Publisher →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="lg:col-span-5 space-y-6">
              <form
                onSubmit={(e) => void handlePublishTestimonial(e)}
                className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5"
              >
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Publish Verified Testimonial (Zero PII)
                </h2>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={testimName}
                  onChange={(e) => setTestimName(e.target.value)}
                  placeholder="Participant Name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={testimRole}
                  onChange={(e) => setTestimRole(e.target.value)}
                  placeholder="Role (e.g., VTU 5th Sem Student)"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
                <input
                  type="text"
                  maxLength={120}
                  value={testimImprovement}
                  onChange={(e) => setTestimImprovement(e.target.value)}
                  placeholder="Outcome note (e.g., Score rose 50% → 90%)"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
                <textarea
                  rows={3}
                  required
                  maxLength={500}
                  value={testimQuote}
                  onChange={(e) => setTestimQuote(e.target.value)}
                  placeholder="Genuine participant quote..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
                <button
                  type="submit"
                  disabled={publishingTestim}
                  className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg"
                >
                  {publishingTestim ? 'Publishing...' : 'Publish to Home Page'}
                </button>
              </form>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Published Testimonials ({testimonials.length})
                </h3>
                {testimonials.length === 0 ? (
                  <p className="text-xs text-slate-500">None published yet.</p>
                ) : (
                  testimonials.map((t) => (
                    <div
                      key={t.testimonialId}
                      className="flex items-start justify-between gap-2 pb-2.5 border-b last:border-b-0 border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {t.authorName} · {t.roleLabel}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">{t.quote}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleDeleteTestimonial(t.testimonialId)}
                        aria-label="Delete testimonial"
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: EDUCATIONAL CONTENT MANAGER */}
        {tab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={(e) => void handleSaveArticle(e)}
              className="lg:col-span-5 p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Edit Educational Article' : 'Add Educational Article'}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(undefined);
                      setArtTitle('');
                      setArtSummary('');
                      setArtBody('');
                      setArtKeyPoints('');
                    }}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Topic
                  </label>
                  <select
                    value={artTopic}
                    onChange={(e) => setArtTopic(e.target.value as EducationTopic)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Read Time (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={artReadTime}
                    onChange={(e) => setArtReadTime(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <input
                type="text"
                required
                maxLength={140}
                value={artTitle}
                onChange={(e) => setArtTitle(e.target.value)}
                placeholder="Article title (e.g., Hydration Tips for Summer)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
              <input
                type="text"
                required
                maxLength={400}
                value={artSummary}
                onChange={(e) => setArtSummary(e.target.value)}
                placeholder="Short summary (10–400 characters)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
              <textarea
                rows={4}
                required
                maxLength={5000}
                value={artBody}
                onChange={(e) => setArtBody(e.target.value)}
                placeholder="Full educational explanation (20–5000 characters)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
              <textarea
                rows={3}
                value={artKeyPoints}
                onChange={(e) => setArtKeyPoints(e.target.value)}
                placeholder="Key takeaways (one per line, up to 8 points)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />

              <button
                type="submit"
                disabled={savingArt}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                {savingArt ? 'Saving...' : editingId ? 'Update Article' : 'Publish to Nutrition Library'}
              </button>
            </form>

            <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Custom Firestore Educational Articles ({articles.length})
                </h2>
              </div>
              {articles.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">
                  No custom admin articles published yet. Built-in curriculum topics A–F remain active on the Nutrition Education page.
                </p>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {articles.map((art) => (
                    <div key={art.contentId} className="p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                          {art.topic} · {art.readTimeMinutes} min read
                        </p>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                          {art.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {art.summary}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(art.contentId);
                            setArtTopic(art.topic);
                            setArtTitle(art.title);
                            setArtSummary(art.summary);
                            setArtBody(art.body);
                            setArtKeyPoints(art.keyPoints.join('\n'));
                            setArtReadTime(art.readTimeMinutes);
                          }}
                          className="text-xs font-medium text-sky-700 dark:text-sky-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteArticle(art.contentId)}
                          aria-label="Delete article"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
