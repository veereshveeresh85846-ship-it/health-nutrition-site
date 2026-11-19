import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  LogIn,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { HEALTHY_HABITS_LIST, SURVEY_QUESTIONS } from '../data/curriculum';
import {
  generateParticipantId,
  savePreSurveyLocalSandbox,
  submitPreSurveyFirestore,
} from '../firebase/service';
import { AgeGroup, EducationLevel, FoodHabitType, GenderOption } from '../types/portal';

const AGE_GROUPS: AgeGroup[] = ['Under 18', '18-24', '25-34', '35-49', '50+'];
const GENDERS: GenderOption[] = ['Prefer not to say', 'Female', 'Male', 'Non-binary'];
const EDUCATION_LEVELS: EducationLevel[] = [
  'High School',
  'Undergraduate (VTU / College)',
  'Postgraduate',
  'Working Professional',
  'Other',
];
const FOOD_HABITS: FoodHabitType[] = ['Vegetarian', 'Eggetarian', 'Non-Vegetarian', 'Vegan'];

export const PreSurveyPage: React.FC = () => {
  const {
    user,
    signInWithGoogle,
    signingIn,
    navigate,
    pushToast,
    setActiveParticipantId,
    refreshPublicMetrics,
    refreshMyParticipants,
  } = usePortal();

  const [participantId, setParticipantId] = useState<string>(() => generateParticipantId());
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('18-24');
  const [gender, setGender] = useState<GenderOption>('Prefer not to say');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Undergraduate (VTU / College)');
  const [foodHabits, setFoodHabits] = useState<FoodHabitType>('Vegetarian');
  const [responses, setResponses] = useState<(number | null)[]>(() =>
    Array(SURVEY_QUESTIONS.length).fill(null)
  );
  const [adoptedHabits, setAdoptedHabits] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<{
    participantId: string;
    correctCount: number;
    percentage: number;
    mode: 'firestore' | 'local';
  } | null>(null);

  const answeredCount = responses.filter((r) => r !== null).length;

  const toggleHabit = (habit: string) => {
    setAdoptedHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  const handleCopyId = async (idToCopy: string) => {
    try {
      await navigator.clipboard.writeText(idToCopy);
      pushToast('info', `Participant ID ${idToCopy} copied to clipboard.`);
    } catch {
      pushToast('info', `Save your Participant ID: ${idToCopy}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent, useLocalSandbox = false) => {
    e.preventDefault();
    setErrorMsg('');

    if (responses.some((r) => r === null)) {
      setErrorMsg('Please select an answer for all 10 awareness questions before submitting.');
      return;
    }
    if (!consentGiven) {
      setErrorMsg('Please accept the privacy and data consent confirmation before submitting.');
      return;
    }

    const finalResponses = responses as number[];
    setSubmitting(true);

    try {
      if (!useLocalSandbox && user) {
        const res = await submitPreSurveyFirestore({
          participantId,
          ageGroup,
          gender,
          educationLevel,
          foodHabits,
          responses: finalResponses,
          adoptedHabits,
          consentGiven: true,
        });
        setActiveParticipantId(res.participantId);
        setResult({ ...res, mode: 'firestore' });
        pushToast('success', 'Pre-Program Survey recorded in Firebase Firestore.');
        await Promise.all([refreshPublicMetrics(), refreshMyParticipants()]);
      } else {
        const res = savePreSurveyLocalSandbox({
          participantId,
          ageGroup,
          gender,
          educationLevel,
          foodHabits,
          responses: finalResponses,
          adoptedHabits,
          consentGiven: true,
        });
        setActiveParticipantId(res.participantId);
        setResult({ ...res, mode: 'local' });
        pushToast('info', 'Pre-Survey saved to Local Demonstration Sandbox.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to submit survey. Please try again.';
      setErrorMsg(msg);
      pushToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="bg-white dark:bg-slate-950 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                PRE-SURVEY Completed ·{' '}
                {result.mode === 'firestore'
                  ? 'Saved to Firebase Firestore'
                  : 'Saved to Local Sandbox (Demo Mode)'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Baseline Awareness Score Recorded
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Thank you for completing the initial health awareness assessment. Now explore our educational resources to improve your knowledge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Your Participant ID</div>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {result.participantId}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleCopyId(result.participantId)}
                    aria-label="Copy Participant ID"
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Correct Answers</div>
                <div className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                  {result.correctCount} / 10
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Baseline Score</div>
                <div className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-sky-700 dark:text-sky-400">
                  {result.percentage}%
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 text-sm text-slate-700 dark:text-slate-300">
              Keep your Participant ID (<span className="font-mono font-semibold">{result.participantId}</span>) handy. It is automatically linked for your Post-Program Survey so we can measure your exact awareness improvement.
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('learning')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Start Learning Modules
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('nutrition')}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Explore Nutrition Library
              </button>
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="px-5 py-2.5 text-sm font-medium text-sky-700 dark:text-sky-400 hover:underline"
              >
                View Analytics Dashboard
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
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Step 1 of 3 · Baseline Knowledge Measurement (PRE-SURVEY)
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Pre-Program Awareness Survey
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Answer 10 multiple-choice questions to establish your baseline nutrition and hygiene awareness before completing the learning modules.
          </p>
        </div>

        {/* Auth Status Banner */}
        {!user ? (
          <div className="p-5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Sign in with Google to save official responses to Firebase Firestore
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Verified sign-in links your Participant ID securely for matched post-program comparison and live VTU evaluation charts. You may also test locally in Local Sandbox mode below.
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
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-sm">
            <span className="text-slate-700 dark:text-slate-200">
              Signed in as <strong className="font-semibold">{user.displayName || user.email}</strong> · Submission will be stored securely in Firebase Firestore.
            </span>
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e, !user)} className="space-y-8">
          {/* Participant Profile Section */}
          <section className="p-6 sm:p-7 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  1. Participant Information (Anonymous ID)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No sensitive personal identifiers (phone, address) are collected.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">ID:</span>
                <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {participantId}
                </span>
                <button
                  type="button"
                  onClick={() => setParticipantId(generateParticipantId())}
                  title="Generate new ID"
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="pre-age"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Age Group
                </label>
                <select
                  id="pre-age"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {AGE_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="pre-gender"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Gender (Optional)
                </label>
                <select
                  id="pre-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as GenderOption)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="pre-edu"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Education Level
                </label>
                <select
                  id="pre-edu"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="pre-food"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  General Food Habits
                </label>
                <select
                  id="pre-food"
                  value={foodHabits}
                  onChange={(e) => setFoodHabits(e.target.value as FoodHabitType)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {FOOD_HABITS.map((fh) => (
                    <option key={fh} value={fh}>
                      {fh}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 10 Knowledge Questions */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                2. Baseline Health & Nutrition Knowledge (10 Questions)
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
                            name={`pre-q-${q.id}`}
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

          {/* Current Healthy Practices Baseline */}
          <section className="p-6 sm:p-7 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                3. Current Daily Healthy Practices (Optional Baseline)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select the healthy habits you already practise regularly today so we can track habit adoption after the program.
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

          {/* Privacy & Data Consent */}
          <section className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Privacy Notice & Data Consent</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your responses are linked strictly to your anonymous Participant ID ({participantId}) for academic VTU AEC Lab evaluation of awareness improvement. No unnecessary personal details are collected, and aggregated analytics contain zero personally identifiable information.
            </p>
            <label className="flex items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 accent-emerald-600"
              />
              <span>
                I understand the privacy notice and consent to my anonymized responses being included in the Health and Nutrition Awareness Program evaluation.
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

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user
                ? 'Target storage: Live Firebase Firestore'
                : 'Not signed in: Submit will save to Local Sandbox (or sign in above for Firestore)'}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg transition-colors"
            >
              {submitting
                ? 'Submitting Pre-Survey...'
                : user
                ? 'Submit Pre-Program Survey'
                : 'Submit to Local Sandbox'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
