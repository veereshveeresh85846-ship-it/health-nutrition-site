import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  LogIn,
  ShieldCheck,
  Star,
  TrendingUp,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { HEALTHY_HABITS_LIST, SURVEY_QUESTIONS } from '../data/curriculum';
import {
  savePostSurveyLocalSandbox,
  submitPostSurveyFirestore,
} from '../firebase/service';

export const PostSurveyPage: React.FC = () => {
  const {
    user,
    signInWithGoogle,
    signingIn,
    activeParticipantId,
    myParticipants,
    navigate,
    pushToast,
    refreshPublicMetrics,
    refreshMyParticipants,
  } = usePortal();

  const [participantId, setParticipantId] = useState<string>(activeParticipantId || '');
  const [responses, setResponses] = useState<(number | null)[]>(() =>
    Array(SURVEY_QUESTIONS.length).fill(null)
  );
  const [adoptedHabits, setAdoptedHabits] = useState<string[]>([]);
  const [learningFeedback, setLearningFeedback] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [consentGiven, setConsentGiven] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<{
    participantId: string;
    preScore: number;
    postScore: number;
    correctCount: number;
    mode: 'firestore' | 'local';
  } | null>(null);

  const answeredCount = responses.filter((r) => r !== null).length;

  const toggleHabit = (habit: string) => {
    setAdoptedHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  const handleSubmit = async (e: React.FormEvent, useLocalSandbox = false) => {
    e.preventDefault();
    setErrorMsg('');

    if (!participantId.trim()) {
      setErrorMsg('Please enter your unique Participant ID from your Pre-Program Survey.');
      return;
    }
    if (responses.some((r) => r === null)) {
      setErrorMsg('Please answer all 10 awareness questions before submitting.');
      return;
    }
    if (!consentGiven) {
      setErrorMsg('Please confirm data consent before submitting your Post-Program Survey.');
      return;
    }

    setSubmitting(true);
    try {
      if (!useLocalSandbox && user) {
        const res = await submitPostSurveyFirestore({
          participantId,
          responses: responses as number[],
          adoptedHabits,
          learningFeedback,
          rating,
          consentGiven: true,
        });
        setResult({ ...res, mode: 'firestore' });
        pushToast('success', 'Post-Program Survey saved and matched with your Pre-Survey!');
        await Promise.all([refreshPublicMetrics(), refreshMyParticipants()]);
      } else {
        const res = savePostSurveyLocalSandbox({
          participantId,
          responses: responses as number[],
          adoptedHabits,
          learningFeedback,
          rating,
          consentGiven: true,
        });
        setResult({ ...res, mode: 'local' });
        pushToast('info', 'Post-Survey matched and saved in Local Demonstration Sandbox.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to submit Post-Survey.';
      setErrorMsg(msg);
      pushToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    const pointDelta = Number((result.postScore - result.preScore).toFixed(1));
    const pctGain =
      result.preScore > 0
        ? Number((((result.postScore - result.preScore) / result.preScore) * 100).toFixed(1))
        : null;

    return (
      <div className="bg-white dark:bg-slate-950 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                POST-SURVEY Matched · Participant {result.participantId} ·{' '}
                {result.mode === 'firestore' ? 'Firebase Firestore' : 'Local Sandbox'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Congratulations! You have completed the Health and Nutrition Awareness Program.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Your post-program responses have been paired with your baseline record to calculate verified awareness growth.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Pre-Survey Score</div>
                <div className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-sky-700 dark:text-sky-400">
                  {result.preScore}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Post-Survey Score</div>
                <div className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {result.postScore}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {result.correctCount} / 10 correct
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Measured Change</div>
                <div className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                  {pointDelta >= 0 ? `+${pointDelta}` : pointDelta} pts
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {pctGain !== null
                    ? `${pctGain >= 0 ? '+' : ''}${pctGain}% relative gain`
                    : 'Baseline was 0%'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                View Results & Analytics Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('diet-planner')}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Explore Indian Diet Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Step 3 of 3 · Matched Post-Program Evaluation (POST-SURVEY)
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Post-Program Awareness Survey
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Use the exact Participant ID assigned during your Pre-Program Survey to measure your awareness growth after completing the educational modules.
          </p>
        </div>

        {!user && (
          <div className="p-5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Sign in with the same Google account used for your Pre-Survey
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Required to match and save official Firestore records. If you used Local Sandbox mode for your Pre-Survey, submit below directly.
              </p>
            </div>
            <button
              type="button"
              disabled={signingIn}
              onClick={() => void signInWithGoogle()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <LogIn className="w-4 h-4" />
              {signingIn ? 'Signing in...' : 'Sign In with Google'}
            </button>
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e, !user)} className="space-y-8">
          {/* Participant ID Match Box */}
          <section className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Match Your Unique Participant ID
            </h2>
            <div>
              <label
                htmlFor="post-pid"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Participant ID (from Pre-Survey)
              </label>
              <input
                id="post-pid"
                type="text"
                required
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value.toUpperCase())}
                placeholder="e.g., HN-2026-AB12CD"
                className="w-full sm:max-w-sm px-3.5 py-2.5 font-mono text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {myParticipants.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your registered Participant IDs on this account:
                </p>
                <div className="flex flex-wrap gap-2">
                  {myParticipants.map((p) => (
                    <button
                      key={p.participantId}
                      type="button"
                      onClick={() => setParticipantId(p.participantId)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                        participantId === p.participantId
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {p.participantId}{' '}
                      {p.postSurveyCompleted ? '(Completed)' : `(Pre: ${p.preScore}%)`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Same 10 Knowledge Questions */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                2. Post-Program Knowledge Assessment (Same 10 Questions)
              </h2>
              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {answeredCount} / 10 answered
              </span>
            </div>

            <div className="space-y-4">
              {SURVEY_QUESTIONS.map((q, qIndex) => (
                <fieldset
                  key={q.id}
                  className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <legend className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {q.id}. {q.question}
                  </legend>
                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const selected = responses[qIndex] === optIdx;
                      return (
                        <label
                          key={opt}
                          className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                            selected
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-500 dark:border-emerald-600 text-slate-900 dark:text-white'
                              : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`post-q-${q.id}`}
                            checked={selected}
                            onChange={() => {
                              setResponses((prev) => {
                                const next = [...prev];
                                next[qIndex] = optIdx;
                                return next;
                              });
                            }}
                            className="mt-0.5 accent-emerald-600"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          </section>

          {/* Healthy Habits Adopted */}
          <section className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                3. Healthy Practices Adopted or Committed To
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select the healthy nutrition and hygiene habits you now practise or commit to adopting after the program.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HEALTHY_HABITS_LIST.map((habit) => {
                const checked = adoptedHabits.includes(habit);
                return (
                  <label
                    key={habit}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer text-sm transition-colors ${
                      checked
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-500 text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleHabit(habit)}
                      className="accent-emerald-600"
                    />
                    <span>{habit}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Learning Experience Feedback */}
          <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Program Learning Experience Feedback
            </h2>
            <div>
              <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Overall Program Usefulness Rating
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} out of 5`}
                    className={`p-2 rounded-lg border transition-colors ${
                      star <= rating
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-1">
                  {rating} / 5
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="post-feedback"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                What did you find most useful or change in your daily habits? (Optional, max 1000 chars)
              </label>
              <textarea
                id="post-feedback"
                rows={3}
                maxLength={1000}
                value={learningFeedback}
                onChange={(e) => setLearningFeedback(e.target.value)}
                placeholder="Share what helped you most in the nutrition modules or diet planner..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </section>

          {/* Consent */}
          <section className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Post-Program Data Consent</span>
            </div>
            <label className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 accent-emerald-600"
              />
              <span>
                I confirm these are my own post-program responses and consent to anonymous pre/post score aggregation for VTU AEC Lab impact analysis.
              </span>
            </label>
          </section>

          {errorMsg && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-sm text-rose-700 dark:text-rose-300"
            >
              {errorMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {user
                ? 'Submitting to Live Firebase Firestore'
                : 'Submitting to Local Demonstration Sandbox'}
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg transition-colors"
            >
              {submitting ? 'Matching & Submitting...' : 'Submit Post-Program Survey'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
