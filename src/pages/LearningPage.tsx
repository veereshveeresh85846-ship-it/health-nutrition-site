import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { LEARNING_MODULES } from '../data/curriculum';
import { MediaFrame } from '../components/MediaFrame';

export const LearningPage: React.FC = () => {
  const { navigate, completedModules, markModuleCompleted, pushToast } = usePortal();
  const [expandedId, setExpandedId] = useState<string>(LEARNING_MODULES[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [activityStatus, setActivityStatus] = useState<Record<string, 'correct' | 'retry'>>({});

  const progressPct = Math.round((completedModules.length / LEARNING_MODULES.length) * 100);

  const handleCheckActivity = async (moduleId: string, correctIdx: number) => {
    const picked = selectedAnswers[moduleId];
    if (picked === undefined) {
      pushToast('info', 'Select an option to check your understanding.');
      return;
    }
    if (picked === correctIdx) {
      setActivityStatus((prev) => ({ ...prev, [moduleId]: 'correct' }));
      await markModuleCompleted(moduleId);
      pushToast('success', 'Learning module marked as completed.');
    } else {
      setActivityStatus((prev) => ({ ...prev, [moduleId]: 'retry' }));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Overall Progress Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Step 2 of 3 · Guided Awareness Program
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Health Awareness Learning Modules
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Work through all six interactive modules and complete each short learning activity before taking the Post-Program Awareness Survey.
            </p>
          </div>

          <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900 dark:text-white">
                Module Progress
              </span>
              <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                {completedModules.length} / {LEARNING_MODULES.length} ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedModules.length === LEARNING_MODULES.length
                ? 'All modules completed! You are ready for the Nutrition Quiz and Post-Program Survey.'
                : 'Complete the short check-in inside each module to record progress.'}
            </p>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-5">
          {LEARNING_MODULES.map((mod) => {
            const isExpanded = expandedId === mod.id;
            const isDone = completedModules.includes(mod.id);
            const checkState = activityStatus[mod.id];

            return (
              <article
                key={mod.id}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        Module {mod.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{mod.topic}</span>
                      <span aria-hidden="true">·</span>
                      <span>{mod.duration}</span>
                      {isDone && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {mod.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{mod.summary}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? '' : mod.id)}
                    aria-expanded={isExpanded}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    {isExpanded ? 'Hide Lesson' : 'Read More'}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-7 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
                      <div className="lg:col-span-5">
                        <MediaFrame
                          src={mod.imageUrl}
                          alt={mod.title}
                          aspectClass="aspect-[4/3]"
                          className="border border-slate-200 dark:border-slate-800"
                          fallbackTitle={mod.title}
                        />
                      </div>
                      <div className="lg:col-span-7 space-y-5">
                        {mod.sections.map((sec) => (
                          <div key={sec.heading}>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
                              {sec.heading}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {sec.content}
                            </p>
                          </div>
                        ))}

                        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-900/70">
                          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                            Practical Everyday Actions
                          </p>
                          <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
                            {mod.actionTips.map((tip) => (
                              <li key={tip}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Short Interactive Learning Activity */}
                    <div className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                      <div>
                        <p className="text-xs font-medium text-sky-700 dark:text-sky-400">
                          Quick Learning Check
                        </p>
                        <h4 className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                          {mod.activityQuestion}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {mod.activityOptions.map((opt, idx) => (
                          <label
                            key={opt}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer text-sm transition-colors ${
                              selectedAnswers[mod.id] === idx
                                ? 'bg-sky-50/70 dark:bg-sky-950/35 border-sky-500 text-slate-900 dark:text-white'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`activity-${mod.id}`}
                              checked={selectedAnswers[mod.id] === idx}
                              onChange={() =>
                                setSelectedAnswers((prev) => ({ ...prev, [mod.id]: idx }))
                              }
                              className="mt-0.5 accent-sky-600"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => void handleCheckActivity(mod.id, mod.activityCorrectIndex)}
                          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                        >
                          Check Answer & Complete Module
                        </button>
                        {!isDone && (
                          <button
                            type="button"
                            onClick={() => void markModuleCompleted(mod.id)}
                            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:underline"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>

                      {checkState === 'correct' && (
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          {mod.activityFeedback}
                        </p>
                      )}
                      {checkState === 'retry' && (
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                          Not quite — review the lesson points above and try another option.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom Progression CTA */}
        <div className="p-7 rounded-xl bg-sky-50/70 dark:bg-sky-950/25 border border-sky-200 dark:border-sky-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Finished exploring the learning modules?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Test your mastery with the 15-question Nutrition Quiz or complete the Post-Program Awareness Survey to record your improvement.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('quiz')}
              className="px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              Take 15-Question Quiz
            </button>
            <button
              type="button"
              onClick={() => navigate('post-survey')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Proceed to Post-Survey
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
