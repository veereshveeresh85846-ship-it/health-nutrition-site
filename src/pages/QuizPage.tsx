import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { QUIZ_QUESTIONS } from '../data/curriculum';
import { saveQuizResultFirestore } from '../firebase/service';

export const QuizPage: React.FC = () => {
  const { user, activeParticipantId, navigate, pushToast } = usePortal();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(QUIZ_QUESTIONS.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedToCloud, setSavedToCloud] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];
  const answeredCount = answers.filter((a) => a !== null).length;

  const correctCount = QUIZ_QUESTIONS.reduce(
    (acc, q, idx) => (answers[idx] === q.correctIndex ? acc + 1 : acc),
    0
  );
  const incorrectCount = QUIZ_QUESTIONS.length - correctCount;
  const percentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  const performanceMessage =
    percentage >= 85
      ? 'Excellent mastery! You have a strong, well-rounded understanding of nutrition, micronutrients, and daily food safety.'
      : percentage >= 65
      ? 'Good work! Review the explanations below to strengthen a few key concepts before taking your Post-Survey.'
      : 'Good start! Revisit the Nutrition Education library and Learning Modules to reinforce essential dietary habits.';

  const handleSelectOption = (optIdx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = optIdx;
      return next;
    });
  };

  const handleSubmitQuiz = async () => {
    if (answers.some((a) => a === null)) {
      pushToast('info', 'Please answer all 15 questions before submitting the quiz.');
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (user) {
      setSaving(true);
      try {
        await saveQuizResultFirestore(correctCount, 15, activeParticipantId || '');
        setSavedToCloud(true);
        pushToast('success', 'Quiz score saved to Firebase Firestore.');
      } catch (err) {
        console.error('Quiz save warning:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleReset = () => {
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setCurrentIdx(0);
    setSubmitted(false);
    setSavedToCloud(false);
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Score Summary */}
          <section className="p-7 sm:p-9 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Nutrition Quiz Results {savedToCloud ? '· Saved to Firestore' : saving ? '· Saving...' : ''}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Quiz Completed
                </h1>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Total Questions</div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                  15
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Correct Answers</div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {correctCount}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Incorrect Answers</div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-rose-700 dark:text-rose-400">
                  {incorrectCount}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Percentage Score</div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-sky-700 dark:text-sky-400">
                  {percentage}%
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {performanceMessage}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('post-survey')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Take Post-Program Survey
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
            </div>
          </section>

          {/* Complete Answer Review */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Question-by-Question Answer Review
            </h2>
            {QUIZ_QUESTIONS.map((q, idx) => {
              const userChoice = answers[idx];
              const isCorrect = userChoice === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                      {q.id}. {q.question}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                        isCorrect
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Incorrect
                        </>
                      )}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-slate-600 dark:text-slate-400">
                      Your answer:{' '}
                      <span
                        className={`font-medium ${
                          isCorrect
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {userChoice !== null ? q.options[userChoice] : 'Not answered'}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-slate-700 dark:text-slate-300">
                        Correct answer:{' '}
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {q.options[q.correctIndex]}
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    );
  }

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800">
          <p className="text-sm font-medium text-sky-700 dark:text-sky-400">
            Interactive Assessment · 15 Multiple-Choice Questions
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Nutrition & Health Knowledge Quiz
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Test your understanding of macronutrients, vitamins, hygiene, Indian food pairings, and healthy lifestyle practices.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>
              Question <span className="font-mono font-semibold text-slate-900 dark:text-white">{currentIdx + 1}</span> of {QUIZ_QUESTIONS.length} · {currentQuestion.category}
            </span>
            <span className="font-mono tabular-nums">
              {answeredCount} / {QUIZ_QUESTIONS.length} answered
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-sky-600 transition-all duration-200"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQuestion.id}. {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const selected = answers[currentIdx] === idx;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  aria-pressed={selected}
                  className={`w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-colors text-sm sm:text-base ${
                    selected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-500 dark:border-emerald-500 text-slate-900 dark:text-white font-medium'
                      : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-semibold shrink-0 mt-0.5 ${
                      selected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {letters[idx]}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => Math.min(QUIZ_QUESTIONS.length - 1, i + 1))}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleSubmitQuiz()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Submit Quiz ({answeredCount}/15)
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Number Quick Navigator */}
        <div className="flex flex-wrap gap-1.5">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const isCurrent = idx === currentIdx;
            const isAnswered = answers[idx] !== null;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`w-9 h-9 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  isCurrent
                    ? 'bg-sky-600 text-white'
                    : isAnswered
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
