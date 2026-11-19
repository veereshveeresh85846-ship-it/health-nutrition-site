import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { BUILTIN_EDUCATION_ARTICLES, PORTAL_IMAGES } from '../data/curriculum';
import { EducationTopic } from '../types/portal';
import { MediaFrame } from '../components/MediaFrame';

const TOPICS: ('All' | EducationTopic)[] = [
  'All',
  'Balanced Diet',
  'Macronutrients',
  'Micronutrients',
  'Healthy Habits',
  'Personal Hygiene',
  'Healthy Lifestyle',
];

const MICRONUTRIENT_TABLE = [
  {
    nutrient: 'Iron',
    role: 'Builds haemoglobin for oxygen transport; prevents anaemia & fatigue',
    sources: 'Spinach, methi, lentils (dal), chickpeas, dates, jaggery (pair with lemon)',
  },
  {
    nutrient: 'Calcium',
    role: 'Builds strong bones & teeth; supports normal nerve and muscle function',
    sources: 'Milk, homemade curd, paneer, ragi (finger millet), white sesame seeds',
  },
  {
    nutrient: 'Vitamin A',
    role: 'Protects vision in low light, healthy skin, and mucosal immunity',
    sources: 'Carrots, papaya, mango, pumpkin, dark green leafy vegetables',
  },
  {
    nutrient: 'Vitamin B12',
    role: 'Essential for nerve function, DNA synthesis, and red blood cells',
    sources: 'Milk, curd, paneer, eggs, fortified breakfast cereals (vegans need fortified sources)',
  },
  {
    nutrient: 'Vitamin C',
    role: 'Supports wound healing, immunity, and enhances plant iron absorption',
    sources: 'Indian gooseberry (amla), guava, oranges, lemon, bell peppers, tomatoes',
  },
  {
    nutrient: 'Vitamin D',
    role: 'Enables dietary calcium absorption and maintains bone density',
    sources: '15–20 minutes gentle morning sunlight, fortified milk, mushrooms, egg yolk',
  },
];

export const NutritionPage: React.FC = () => {
  const { navigate, customArticles } = usePortal();
  const [selectedTopic, setSelectedTopic] = useState<'All' | EducationTopic>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allArticles = useMemo(
    () => [...BUILTIN_EDUCATION_ARTICLES, ...customArticles],
    [customArticles]
  );

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allArticles.filter((article) => {
      const matchesTopic = selectedTopic === 'All' || article.topic === selectedTopic;
      if (!matchesTopic) return false;
      if (!q) return true;
      return (
        article.title.toLowerCase().includes(q) ||
        article.topic.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.body.toLowerCase().includes(q) ||
        article.keyPoints.some((kp) => kp.toLowerCase().includes(q))
      );
    });
  }, [allArticles, selectedTopic, searchQuery]);

  return (
    <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
              Comprehensive Curriculum · Topics A to F
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Nutrition & Health Education Library
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Clear, accessible guidance on balanced diets, macronutrients, essential vitamins and minerals, food habits, personal hygiene, and healthy daily living.
            </p>
          </div>

          <div className="w-full lg:w-80">
            <label htmlFor="nutrition-search" className="sr-only">
              Search educational content
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="nutrition-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vitamins, protein, hygiene..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Topic Filter Segmented Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setSelectedTopic(topic)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedTopic === topic
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Educational Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="p-10 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <p className="text-base font-medium text-slate-900 dark:text-white mb-2">
              No nutrition articles matched “{searchQuery}”
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Try searching for iron, calcium, protein, fibre, water, or reset the topic filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('All');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.contentId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col"
              >
                {article.imageUrl && (
                  <MediaFrame
                    src={article.imageUrl}
                    alt={article.title}
                    aspectClass="aspect-[16/9]"
                    className="rounded-none"
                    fallbackTitle={article.title}
                  />
                )}
                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                      {article.topic}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTimeMinutes} min read</span>
                    {!article.isBuiltIn && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Published by Program Admin</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">
                    {article.title}
                  </h2>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    {article.summary}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                    {article.body}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    {article.keyPoints.map((point) => (
                      <div key={point} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Essential Micronutrients Quick Reference Table */}
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-4">
              <MediaFrame
                src={PORTAL_IMAGES.micronutrients}
                alt="Fresh spinach, oranges, amla, carrots, bell peppers, raisins, sesame seeds and milk"
                aspectClass="aspect-[4/3]"
                className="border border-slate-200 dark:border-slate-800"
                fallbackTitle="Essential Vitamins & Minerals"
              />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Key Vitamins & Minerals Reference
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Everyday Indian foods can prevent the six most common micronutrient gaps without costly supplements.
              </p>
            </div>

            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <th className="py-3.5 px-4">Micronutrient</th>
                      <th className="py-3.5 px-4">Primary Body Function</th>
                      <th className="py-3.5 px-4">Accessible Food Sources</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                    {MICRONUTRIENT_TABLE.map((row) => (
                      <tr key={row.nutrient}>
                        <td className="py-3.5 px-4 font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                          {row.nutrient}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{row.role}</td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{row.sources}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Next Step Prompt */}
        <div className="p-6 sm:p-8 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ready to practice what you read?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Build a balanced Indian daily meal plan or complete the 6 interactive learning modules.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('diet-planner')}
              className="px-4 py-2.5 text-sm font-medium text-emerald-800 dark:text-emerald-200 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Indian Diet Planner
            </button>
            <button
              type="button"
              onClick={() => navigate('learning')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Start Learning Modules
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
