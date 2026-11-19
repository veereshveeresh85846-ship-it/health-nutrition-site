import React, { useMemo, useState } from 'react';
import { ChartConfiguration } from 'chart.js';
import {
  AlertCircle,
  Database,
  Download,
  FlaskConical,
  Printer,
  RefreshCw,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { HEALTHY_HABITS_LIST, SAMPLE_DEMO_METRICS, SURVEY_QUESTIONS } from '../data/curriculum';
import {
  computeAnalyticsFromMetrics,
  downloadCsvFile,
  loadLocalSandbox,
} from '../firebase/service';
import { ChartCanvas } from '../components/ChartCanvas';

type DataSourceMode = 'live' | 'local' | 'sample';

export const DashboardPage: React.FC = () => {
  const { publicMetrics, metricsLoading, refreshPublicMetrics, darkMode, navigate, pushToast } =
    usePortal();

  const [sourceMode, setSourceMode] = useState<DataSourceMode>('live');

  const localSandbox = useMemo(() => loadLocalSandbox(), [sourceMode]);

  const activeMetrics = useMemo(() => {
    if (sourceMode === 'sample') return SAMPLE_DEMO_METRICS;
    if (sourceMode === 'local') return localSandbox.metrics;
    return publicMetrics;
  }, [sourceMode, publicMetrics, localSandbox.metrics]);

  const stats = useMemo(
    () =>
      computeAnalyticsFromMetrics(
        activeMetrics,
        sourceMode === 'local' ? localSandbox.participants.length : undefined
      ),
    [activeMetrics, sourceMode, localSandbox.participants.length]
  );

  const textColor = darkMode ? '#cbd5e1' : '#334155';
  const gridColor = darkMode ? 'rgba(148, 163, 184, 0.14)' : 'rgba(15, 23, 42, 0.08)';

  // Chart 1: Pre-Survey vs Post-Survey Score Comparison
  const preVsPostConfig: ChartConfiguration = useMemo(
    () => ({
      type: 'bar',
      data: {
        labels: ['Matched Pre-Survey Average', 'Matched Post-Survey Average'],
        datasets: [
          {
            label: 'Average Awareness Score (%)',
            data: [stats.avgPreScoreMatched, stats.avgPostScoreMatched],
            backgroundColor: ['#0284c7', '#059669'],
            borderRadius: 8,
            maxBarThickness: 72,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.y}% average score`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: textColor, callback: (v) => `${v}%` },
            grid: { color: gridColor },
          },
          x: {
            ticks: { color: textColor },
            grid: { display: false },
          },
        },
      },
    }),
    [stats.avgPreScoreMatched, stats.avgPostScoreMatched, textColor, gridColor]
  );

  // Chart 2: Participant Awareness Levels (Pre vs Post)
  const awarenessLevelsConfig: ChartConfiguration = useMemo(
    () => ({
      type: 'bar',
      data: {
        labels: ['Needs Improvement (<50%)', 'Moderate (50%–79%)', 'High Awareness (80%–100%)'],
        datasets: [
          {
            label: 'Pre-Survey Participants',
            data: [
              stats.awarenessLevelsPre.low,
              stats.awarenessLevelsPre.moderate,
              stats.awarenessLevelsPre.high,
            ],
            backgroundColor: '#0284c7',
            borderRadius: 6,
          },
          {
            label: 'Post-Survey Participants',
            data: [
              stats.awarenessLevelsPost.low,
              stats.awarenessLevelsPost.moderate,
              stats.awarenessLevelsPost.high,
            ],
            backgroundColor: '#059669',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: textColor, stepSize: 1, precision: 0 },
            grid: { color: gridColor },
          },
          x: {
            ticks: { color: textColor },
            grid: { display: false },
          },
        },
      },
    }),
    [stats.awarenessLevelsPre, stats.awarenessLevelsPost, textColor, gridColor]
  );

  // Chart 3: Question-wise Performance Q1-Q10
  const questionWiseConfig: ChartConfiguration = useMemo(
    () => ({
      type: 'bar',
      data: {
        labels: SURVEY_QUESTIONS.map((q) => q.shortLabel),
        datasets: [
          {
            label: 'Pre-Survey Correct (%)',
            data: stats.questionWisePre,
            backgroundColor: 'rgba(2, 132, 199, 0.85)',
            borderRadius: 4,
          },
          {
            label: 'Post-Survey Correct (%)',
            data: stats.questionWisePost,
            backgroundColor: 'rgba(5, 150, 105, 0.9)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: textColor, callback: (v) => `${v}%` },
            grid: { color: gridColor },
          },
          x: {
            ticks: { color: textColor, font: { size: 11 } },
            grid: { display: false },
          },
        },
      },
    }),
    [stats.questionWisePre, stats.questionWisePost, textColor, gridColor]
  );

  // Chart 4: Healthy Habit Adoption Statistics
  const habitAdoptionConfig: ChartConfiguration = useMemo(
    () => ({
      type: 'bar',
      data: {
        labels: HEALTHY_HABITS_LIST.map((h) => (h.length > 34 ? `${h.slice(0, 32)}…` : h)),
        datasets: [
          {
            label: 'Pre-Program Baseline (%)',
            data: HEALTHY_HABITS_LIST.map((h) => stats.habitAdoptionPre[h] || 0),
            backgroundColor: 'rgba(2, 132, 199, 0.78)',
            borderRadius: 4,
          },
          {
            label: 'Post-Program Adoption (%)',
            data: HEALTHY_HABITS_LIST.map((h) => stats.habitAdoptionPost[h] || 0),
            backgroundColor: 'rgba(5, 150, 105, 0.9)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: { color: textColor, callback: (v) => `${v}%` },
            grid: { color: gridColor },
          },
          y: {
            ticks: { color: textColor, font: { size: 11 } },
            grid: { display: false },
          },
        },
      },
    }),
    [stats.habitAdoptionPre, stats.habitAdoptionPost, textColor, gridColor]
  );

  // Chart 5: Survey Participation Statistics
  const participationConfig: ChartConfiguration = useMemo(
    () => ({
      type: 'doughnut',
      data: {
        labels: ['Matched (Pre + Post Completed)', 'Pre-Survey Only (In Progress)'],
        datasets: [
          {
            data: [
              stats.matchedCount,
              Math.max(0, stats.preSurveyCount - stats.matchedCount),
            ],
            backgroundColor: ['#059669', '#0284c7'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, padding: 16 },
          },
        },
      },
    }),
    [stats.matchedCount, stats.preSurveyCount, textColor]
  );

  const handleExportCsv = () => {
    if (activeMetrics.length === 0) {
      pushToast('info', 'No data available to export in the current view.');
      return;
    }
    const headers = [
      'Dataset Source',
      'Participant ID',
      'Pre-Survey Score (%)',
      'Post-Survey Score (%)',
      'Point Change',
      'Pre-Survey Date',
      'Post-Survey Date',
    ];
    const sourceLabel =
      sourceMode === 'live'
        ? 'Live Firestore'
        : sourceMode === 'local'
        ? 'Local Sandbox'
        : 'Sample Demonstration Data';

    const rows =
      stats.matchedPairs.length > 0
        ? stats.matchedPairs.map((pair) => [
            sourceLabel,
            pair.participantId,
            pair.preScore,
            pair.postScore,
            pair.delta,
            pair.preDate,
            pair.postDate,
          ])
        : activeMetrics.map((m) => [
            sourceLabel,
            m.participantId,
            m.surveyType === 'PRE-SURVEY' ? m.percentage : '',
            m.surveyType === 'POST-SURVEY' ? m.percentage : '',
            '',
            m.surveyType === 'PRE-SURVEY' ? m.submissionDate : '',
            m.surveyType === 'POST-SURVEY' ? m.submissionDate : '',
          ]);

    downloadCsvFile(
      `health_nutrition_analytics_${sourceMode}_${new Date().toISOString().slice(0, 10)}.csv`,
      headers,
      rows
    );
    pushToast('success', 'Analytics CSV report exported.');
  };

  return (
    <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Measurable Engineering Outcomes · Chart.js Impact Analytics
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Results & Awareness Analytics Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Compares strictly matched Pre-Program and Post-Program survey records using unique Participant IDs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 no-print">
            <button
              type="button"
              onClick={() => void refreshPublicMetrics()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Live Data
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </button>
          </div>
        </div>

        {/* Data Source Selector — Strict Transparency Between Live Data vs Sample Demo Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 no-print">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSourceMode('live')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                sourceMode === 'live'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Live Firestore Data ({publicMetrics.length})
            </button>
            <button
              type="button"
              onClick={() => setSourceMode('local')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                sourceMode === 'local'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Local Sandbox ({localSandbox.metrics.length})
            </button>
            <button
              type="button"
              onClick={() => setSourceMode('sample')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                sourceMode === 'sample'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Sample Demo Dataset
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            {sourceMode === 'live' && 'Showing strictly real responses stored in Firebase Firestore.'}
            {sourceMode === 'local' && 'Showing local browser sandbox test entries (not live Firestore).'}
            {sourceMode === 'sample' &&
              'SAMPLE DEMONSTRATION DATA ONLY — 12 simulated VTU student records for evaluation preview.'}
          </p>
        </div>

        {/* Explicit Warning Banner When Viewing Sample Data */}
        {sourceMode === 'sample' && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-300 dark:border-amber-800 flex items-start gap-3 text-sm text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
            <p>
              <strong>Demonstration Dataset Active:</strong> The charts and metrics below reflect clearly labelled sample demonstration data (12 simulated participants, 10 matched pre/post pairs) to preview Chart.js analytics during VTU project walkthroughs. Switch back to <strong>Live Firestore Data</strong> to view genuine collected participant records.
            </p>
          </div>
        )}

        {/* Loading or Empty State */}
        {sourceMode === 'live' && metricsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : activeMetrics.length === 0 ? (
          <div className="p-10 sm:p-14 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              No participant data available yet.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              This portal strictly computes analytics from real collected submissions and never fabricates statistics. Complete a Pre-Survey and matching Post-Survey to populate live results, or preview the clearly labelled sample demonstration dataset.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('pre-survey')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Record First Pre-Survey
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('sample')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                Preview Sample Demonstration Dataset
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 6 KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Registered Participants
                </p>
                <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                  {stats.totalRegisteredParticipants}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Unique Participant IDs
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Pre-Survey Completed
                </p>
                <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-sky-700 dark:text-sky-400">
                  {stats.preSurveyCount}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Overall baseline avg: {stats.avgPreScoreAll}%
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Post-Survey Completed (Matched)
                </p>
                <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {stats.matchedCount}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Paired via Participant ID
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Average Pre-Survey Score (Matched)
                </p>
                <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-sky-700 dark:text-sky-400">
                  {stats.matchedCount > 0 ? `${stats.avgPreScoreMatched}%` : '—'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Baseline of matched cohort
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Average Post-Survey Score (Matched)
                </p>
                <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {stats.matchedCount > 0 ? `${stats.avgPostScoreMatched}%` : '—'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Post-program matched cohort
                </p>
              </div>

              <div className="p-5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                  Awareness Improvement Percentage
                </p>
                <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {stats.improvementPercentage !== null
                    ? `${stats.improvementPercentage >= 0 ? '+' : ''}${stats.improvementPercentage}%`
                    : 'N/A'}
                </p>
                <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-300/80">
                  ((Post Avg − Pre Avg) / Pre Avg) × 100
                </p>
              </div>
            </div>

            {/* Charts Grid — All 5 Required Chart.js Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    1. Pre-Survey vs. Post-Survey Comparison
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Matched cohort average knowledge scores (%)
                  </p>
                </div>
                <ChartCanvas
                  config={preVsPostConfig}
                  height={270}
                  ariaLabel="Bar chart comparing average matched Pre-Survey and Post-Survey scores"
                />
              </div>

              <div className="lg:col-span-6 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    2. Participant Awareness Levels
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribution across Low (&lt;50%), Moderate (50–79%), and High (80–100%) tiers
                  </p>
                </div>
                <ChartCanvas
                  config={awarenessLevelsConfig}
                  height={270}
                  ariaLabel="Grouped bar chart of participant awareness score tiers before and after program"
                />
              </div>

              <div className="lg:col-span-12 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    3. Question-Wise Performance Analysis (Q1–Q10)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Percentage of respondents answering each standardized question correctly before vs. after learning modules
                  </p>
                </div>
                <ChartCanvas
                  config={questionWiseConfig}
                  height={300}
                  ariaLabel="Question-wise accuracy comparison from Q1 to Q10"
                />
              </div>

              <div className="lg:col-span-8 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    4. Healthy Habit Adoption Statistics
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Percentage of valid respondents practising each healthy daily habit
                  </p>
                </div>
                <ChartCanvas
                  config={habitAdoptionConfig}
                  height={320}
                  ariaLabel="Horizontal bar chart comparing healthy habit adoption percentages"
                />
              </div>

              <div className="lg:col-span-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    5. Survey Participation Breakdown
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Completion funnel from baseline to matched post-survey
                  </p>
                </div>
                <ChartCanvas
                  config={participationConfig}
                  height={320}
                  ariaLabel="Doughnut chart showing matched participants versus pre-survey only participants"
                />
              </div>
            </div>

            {/* Matched Participants Breakdown Table */}
            {stats.matchedPairs.length > 0 && (
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Matched Participant Score Comparison ({stats.matchedPairs.length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Anonymized individual pre-to-post trajectories linked strictly by Participant ID.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <th className="py-3 px-4">Participant ID</th>
                        <th className="py-3 px-4 text-right">Pre-Survey</th>
                        <th className="py-3 px-4 text-right">Post-Survey</th>
                        <th className="py-3 px-4 text-right">Change</th>
                        <th className="py-3 px-4">Pre Date</th>
                        <th className="py-3 px-4">Post Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono tabular-nums text-xs sm:text-sm">
                      {stats.matchedPairs.map((row) => (
                        <tr key={row.participantId}>
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                            {row.participantId}
                          </td>
                          <td className="py-3 px-4 text-right text-sky-700 dark:text-sky-400">
                            {row.preScore}%
                          </td>
                          <td className="py-3 px-4 text-right text-emerald-700 dark:text-emerald-400 font-semibold">
                            {row.postScore}%
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-semibold ${
                              row.delta >= 0
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {row.delta >= 0 ? `+${row.delta}` : row.delta} pts
                          </td>
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                            {row.preDate}
                          </td>
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                            {row.postDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
