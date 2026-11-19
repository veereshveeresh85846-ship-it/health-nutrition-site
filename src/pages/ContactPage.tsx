import React, { useState } from 'react';
import { CheckCircle2, LogIn, Mail, MapPin, Send, ShieldCheck } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { submitFeedbackFirestore } from '../firebase/service';
import { FeedbackCategory } from '../types/portal';

const CATEGORIES: FeedbackCategory[] = [
  'General Feedback',
  'Program Experience',
  'Suggestion',
  'Technical Inquiry',
];

export const ContactPage: React.FC = () => {
  const { user, signingIn, signInWithGoogle, pushToast } = usePortal();

  const [name, setName] = useState(() => user?.displayName || '');
  const [email, setEmail] = useState(() => user?.email || '');
  const [category, setCategory] = useState<FeedbackCategory>('Program Experience');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('Please sign in with Google first to store your feedback securely in Firestore.');
      return;
    }
    if (name.trim().length < 1 || message.trim().length < 5) {
      setErrorMsg('Please enter your name and a message of at least 5 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedbackFirestore({
        name,
        email,
        category,
        message,
      });
      setSubmitted(true);
      setMessage('');
      pushToast('success', 'Thank you! Your feedback has been saved to Firebase Firestore.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to send feedback.';
      setErrorMsg(msg);
      pushToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Project Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Contact & Participant Feedback
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Share Your Experience or Questions
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Have feedback about the Health and Nutrition Awareness Portal, a suggestion for a new Indian nutrition topic, or questions regarding our VTU AEC Lab evaluation? Send us a note below.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Academic Project Information
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Ability Enhancement Course (AEC) Lab · Visvesvaraya Technological University (VTU) Curriculum
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Program Coordinator Contact
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Submitted messages are stored directly in the Firestore <span className="font-mono text-xs">feedback</span> collection for project review.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Privacy & PII Protection
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Email is optional and strictly isolated from public views via Firestore security rules. Only authorized administrators can review raw submissions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Form Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              {submitted ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Feedback Recorded Successfully
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Thank you for contributing to the Health and Nutrition Awareness Portal. Your submission has been saved securely in Firebase Firestore.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    Submit Another Message
                  </button>
                </div>
              ) : (
                <>
                  {!user && (
                    <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        Sign in with Google to submit verified feedback to the Firestore database.
                      </p>
                      <button
                        type="button"
                        disabled={signingIn}
                        onClick={() => void signInWithGoogle()}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg whitespace-nowrap shrink-0"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Sign In with Google
                      </button>
                    </div>
                  )}

                  <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="fb-name"
                          className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                        >
                          Your Name *
                        </label>
                        <input
                          id="fb-name"
                          type="text"
                          required
                          maxLength={100}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="fb-email"
                          className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                        >
                          Email (Optional)
                        </label>
                        <input
                          id="fb-email"
                          type="email"
                          maxLength={160}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="fb-category"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Feedback Category
                      </label>
                      <select
                        id="fb-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="fb-message"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Message * (5–1500 characters)
                      </label>
                      <textarea
                        id="fb-message"
                        rows={5}
                        required
                        minLength={5}
                        maxLength={1500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your experience with the surveys, nutrition lessons, or diet planner..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {errorMsg && (
                      <div
                        role="alert"
                        className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300"
                      >
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
