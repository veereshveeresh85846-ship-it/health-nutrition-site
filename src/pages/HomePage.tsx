import React, { useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  ShieldCheck,
  Utensils,
  XCircle,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { PORTAL_IMAGES } from '../data/curriculum';
import { computeAnalyticsFromMetrics } from '../firebase/service';
import { MediaFrame } from '../components/MediaFrame';

const HEALTHY_VS_UNHEALTHY = [
  {
    category: 'Morning Breakfast',
    healthy: 'Steamed idli-sambar, vegetable upma, or oats with fruit',
    unhealthy: 'Skipping breakfast or sugary packaged pastries & cola',
  },
  {
    category: 'Protein & Mid-Day Meal',
    healthy: 'Whole-wheat chapati, dal, seasonal greens, salad & curd',
    unhealthy: 'Instant noodles or deep-fried fast food with zero vegetables',
  },
  {
    category: 'Evening Snacks',
    healthy: 'Moong sprouts chaat, fresh seasonal fruit, or unsalted nuts',
    unhealthy: 'High-sodium packaged chips, cream biscuits, or street-reheated fries',
  },
  {
    category: 'Daily Hydration',
    healthy: '7–8 glasses of safe clean water, tender coconut, or buttermilk',
    unhealthy: 'Carbonated soft drinks, energy drinks, and excess sweetened tea',
  },
  {
    category: 'Food Preparation & Hygiene',
    healthy: 'Handwashing with soap, thoroughly washed produce, covered storage',
    unhealthy: 'Uncovered street stalls, unwashed salad greens, stale leftovers',
  },
];

const DAILY_HABITS = [
  {
    number: '01',
    title: 'Never Skip Breakfast',
    detail: 'Fuel morning concentration with complex carbs and protein within 2 hours of waking.',
  },
  {
    number: '02',
    title: 'Colour Half Your Plate',
    detail: 'Include seasonal vegetables, leafy greens, and fresh whole fruits across daily meals.',
  },
  {
    number: '03',
    title: 'Hydrate Safely',
    detail: 'Drink clean, filtered or boiled water consistently instead of waiting for thirst.',
  },
  {
    number: '04',
    title: '20-Second Hand Hygiene',
    detail: 'Wash hands thoroughly with soap before every meal and food preparation step.',
  },
  {
    number: '05',
    title: 'Move 30 Minutes Daily',
    detail: 'Brisk campus walking, yoga, cycling, or sports keep metabolism and heart resilient.',
  },
  {
    number: '06',
    title: 'Protect 7–8 Hours Sleep',
    detail: 'Consistent rest supports immunity, exam memory retention, and balanced appetite.',
  },
];

const FEATURED_TIPS = [
  {
    topic: 'Micronutrients · Iron Absorption',
    title: 'Pair Dal and Spinach with Fresh Lemon',
    body: 'Vitamin C dramatically enhances your body’s ability to absorb plant-based iron, helping prevent student fatigue and anaemia.',
  },
  {
    topic: 'Balanced Diet · Protein Quality',
    title: 'Combine Cereals with Pulses',
    body: 'Traditional Indian pairings like rice with dal, idli with sambar, or chapati with rajma deliver a complete profile of essential amino acids.',
  },
  {
    topic: 'Healthy Habits · Label Reading',
    title: 'Watch Hidden Sugar & Sodium',
    body: 'Keep daily salt under 5g (1 teaspoon) and limit added sugar by choosing whole fruits over packaged sweetened juices.',
  },
];

export const HomePage: React.FC = () => {
  const { navigate, publicMetrics, metricsLoading, testimonials } = usePortal();

  const liveStats = useMemo(() => computeAnalyticsFromMetrics(publicMetrics), [publicMetrics]);

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* HERO SECTION — 2-column balanced split with items-stretch */}
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-3">
                VTU AEC Lab Community Health Initiative · Evidence-Based Awareness
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-5">
                Eat Healthy. Live Healthy. Stay Healthy.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mb-8">
                A structured digital health and nutrition awareness platform designed for students and families—combining baseline assessments, Indian meal planning, practical hygiene education, interactive quizzes, and measurable pre/post awareness analytics.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('learning')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  Start Your Health Journey
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('pre-survey')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  Take Awareness Survey
                </button>
                <button
                  type="button"
                  onClick={() => navigate('nutrition')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  Explore Nutrition
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <MediaFrame
                src={PORTAL_IMAGES.heroThali}
                alt="Balanced wholesome Indian thali with whole wheat chapati, dal, spinach sabzi, sprouted salad, fresh curd, and seasonal fruit"
                aspectClass="aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px]"
                className="border border-slate-200 dark:border-slate-800"
                fallbackTitle="Balanced Indian Thali"
              />
            </div>
          </div>

          {/* Full-Width 4-Column Project Statistics Strip Below Hero */}
          <div className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Live Program Impact Statistics
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Real-time metrics computed strictly from collected Firestore survey records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline whitespace-nowrap"
              >
                Open Full Analytics Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Pre-Surveys Recorded
                </p>
                <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {metricsLoading ? '—' : liveStats.preSurveyCount}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Baseline assessments
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Matched Post-Surveys
                </p>
                <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {metricsLoading ? '—' : liveStats.matchedCount}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Verified pre & post pairs
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Average Baseline Score
                </p>
                <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-sky-700 dark:text-sky-400">
                  {metricsLoading
                    ? '—'
                    : liveStats.preSurveyCount > 0
                    ? `${liveStats.avgPreScoreAll}%`
                    : 'No data'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Across 10 core questions
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Measured Improvement
                </p>
                <p className="mt-2 text-3xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                  {metricsLoading
                    ? '—'
                    : liveStats.improvementPercentage !== null
                    ? `${liveStats.improvementPercentage >= 0 ? '+' : ''}${liveStats.improvementPercentage}%`
                    : 'Pending'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Matched pre-to-post gain
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: WHY HEALTH & NUTRITION MATTER + 4-STEP PROGRAM FLOW */}
      <section className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Why Health and Nutrition Awareness Matters
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Irregular student meals, micronutrient deficiencies (iron, Vitamin D, calcium), excessive packaged foods, and preventable hygiene gaps directly impact energy, focus, and lifelong wellness. Structured awareness closes the gap between knowing and practising healthy habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ClipboardCheck,
                step: 'Step 01 · Baseline',
                title: 'Pre-Program Survey',
                desc: 'Measure initial nutrition & hygiene awareness across 10 standardized questions and receive a unique Participant ID.',
                action: 'Take Pre-Survey',
                target: 'pre-survey' as const,
              },
              {
                icon: BookOpen,
                step: 'Step 02 · Learn',
                title: 'Guided Learning Modules',
                desc: 'Complete 6 clear, visual modules covering balanced Indian plates, micronutrients, food safety, and daily activity.',
                action: 'Open Modules',
                target: 'learning' as const,
              },
              {
                icon: Utensils,
                step: 'Step 03 · Practice',
                title: 'Diet Planner & Quiz',
                desc: 'Build a balanced Indian meal plan using idli, chapati, dal, sprouts, and curd—then test your recall in a 15-question quiz.',
                action: 'Try Diet Planner',
                target: 'diet-planner' as const,
              },
              {
                icon: HeartPulse,
                step: 'Step 04 · Measure',
                title: 'Post-Survey & Analytics',
                desc: 'Retake the matched assessment with your Participant ID to document verified improvement on Chart.js dashboards.',
                action: 'Take Post-Survey',
                target: 'post-survey' as const,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      {item.step}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                      {item.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(item.target)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                  >
                    {item.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: IMPORTANCE OF A BALANCED DIET */}
      <section className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <MediaFrame
                src={PORTAL_IMAGES.macronutrients}
                alt="Balanced whole foods displaying complex carbohydrates, plant proteins, and healthy fats"
                aspectClass="aspect-[4/3]"
                className="border border-slate-200 dark:border-slate-800"
                fallbackTitle="Essential Food Groups"
              />
            </div>
            <div className="lg:col-span-7 space-y-5">
              <p className="text-sm font-medium text-sky-700 dark:text-sky-400">
                Balanced Nutrition Foundations
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                The Importance of a Balanced Diet Every Single Day
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                A balanced meal is not about restrictive calorie counting—it is about giving your body the right combination of fuel, building blocks, and protective micronutrients across everyday Indian meals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    title: 'Steady Academic Energy',
                    text: 'Whole grains, millets, and oats release glucose gradually, preventing midday slumps.',
                  },
                  {
                    title: 'Tissue Repair & Growth',
                    text: 'Dal, sprouts, paneer, curd, and eggs supply amino acids for muscle and enzyme maintenance.',
                  },
                  {
                    title: 'Deficiency Prevention',
                    text: 'Leafy greens, citrus fruits, milk, and sunlight protect against iron, calcium, and Vitamin D gaps.',
                  },
                  {
                    title: 'Stronger Immunity',
                    text: 'Antioxidants, dietary fibre, and probiotics fortify gut health and lower infection risk.',
                  },
                ].map((pt) => (
                  <div
                    key={pt.title}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                      {pt.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HEALTHY VS UNHEALTHY FOOD COMPARISON */}
      <section className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Healthy vs. Unhealthy Everyday Food Choices
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Small, practical swaps across breakfast, lunch, snacks, and hydration make a measurable difference over time.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <th className="py-3.5 px-5">Daily Area</th>
                    <th className="py-3.5 px-5 text-emerald-700 dark:text-emerald-400">
                      Recommended Healthy Choice
                    </th>
                    <th className="py-3.5 px-5 text-rose-700 dark:text-rose-400">
                      Habit to Limit or Avoid
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                  {HEALTHY_VS_UNHEALTHY.map((row) => (
                    <tr
                      key={row.category}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {row.category}
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-slate-300">
                        <span className="inline-flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{row.healthy}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                          <span>{row.unhealthy}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DAILY HEALTHY HABITS & FEATURED NUTRITION TIPS */}
      <section className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div>
            <div className="max-w-2xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Six Daily Healthy Habits
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Simple, repeatable routines that support nutrition, hygiene, and active student life.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DAILY_HABITS.map((habit) => (
                <div
                  key={habit.number}
                  className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <p className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                    {habit.number}. Daily Practice
                  </p>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
                    {habit.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {habit.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Featured Nutrition Tips
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Evidence-backed guidance extracted from our learning modules.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('nutrition')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 dark:text-sky-400 hover:underline whitespace-nowrap"
              >
                Browse All Education Topics
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED_TIPS.map((tip) => (
                <article
                  key={tip.title}
                  className="p-6 rounded-xl bg-sky-50/60 dark:bg-sky-950/25 border border-sky-200/80 dark:border-sky-900/70"
                >
                  <p className="text-xs font-medium text-sky-700 dark:text-sky-400 mb-2">
                    {tip.topic}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tip.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: GENUINE PARTICIPANT TESTIMONIALS */}
      <section className="py-16 lg:py-20 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Genuine Participant Feedback
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Only real, administrator-verified feedback submitted by program participants appears here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline whitespace-nowrap"
            >
              Share Your Feedback
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {testimonials.length === 0 ? (
            <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto">
              <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
                No verified participant testimonials published yet
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                To uphold academic integrity, this portal never displays fabricated reviews. Complete the awareness program and share your genuine experience via the Post-Survey or Contact page.
              </p>
              <button
                type="button"
                onClick={() => navigate('pre-survey')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Begin Baseline Survey
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <blockquote
                  key={t.testimonialId}
                  className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
                    “{t.quote}”
                  </p>
                  <footer className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t.authorName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.roleLabel}
                      {t.improvementSummary ? ` · ${t.improvementSummary}` : ''}
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
