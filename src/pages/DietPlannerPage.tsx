import React, { useMemo, useState } from 'react';
import { Check, Info, RotateCcw, Sparkles } from 'lucide-react';
import { INDIAN_DIET_ITEMS, PORTAL_IMAGES } from '../data/curriculum';
import { DietFoodItem } from '../types/portal';
import { MediaFrame } from '../components/MediaFrame';

const MEAL_SLOTS: DietFoodItem['mealSlot'][] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const FOOD_GROUPS: DietFoodItem['foodGroup'][] = [
  'Complex Carbs',
  'Protein',
  'Vitamins & Fibre',
  'Calcium & Probiotics',
  'Healthy Fats',
];

const SUGGESTED_PRESETS: { label: string; description: string; ids: string[] }[] = [
  {
    label: 'South Indian Balanced Day',
    description: 'Idli-sambar, rice with dal & curd, chapati-vegetable curry, and sprouts.',
    ids: ['bf-idli', 'bf-fruits', 'lu-rice', 'lu-dal', 'lu-veg', 'lu-curd', 'di-chapati', 'di-veg-curry', 'sn-sprouts', 'sn-nuts'],
  },
  {
    label: 'Student Hostel High-Focus Day',
    description: 'Oats & banana, chapati-dal-curd, light rice-dal dinner, fruit & nuts.',
    ids: ['bf-oats', 'bf-fruits', 'lu-chapati', 'lu-dal', 'lu-veg', 'lu-curd', 'di-rice', 'di-dal', 'sn-fruits', 'sn-nuts'],
  },
  {
    label: 'Light & Fibre-Rich Day',
    description: 'Vegetable upma, chapati with leafy greens, moong dal dinner, and sprouts.',
    ids: ['bf-upma', 'lu-chapati', 'lu-dal', 'lu-veg', 'lu-curd', 'di-chapati', 'di-veg-curry', 'di-dal', 'sn-sprouts', 'sn-fruits'],
  },
];

export const DietPlannerPage: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'bf-idli',
    'bf-fruits',
    'lu-chapati',
    'lu-dal',
    'lu-veg',
    'lu-curd',
    'di-chapati',
    'di-veg-curry',
    'sn-sprouts',
    'sn-nuts',
  ]);
  const [activeSlot, setActiveSlot] = useState<'All' | DietFoodItem['mealSlot']>('All');

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectedItems = useMemo(
    () => INDIAN_DIET_ITEMS.filter((item) => selectedIds.includes(item.id)),
    [selectedIds]
  );

  const totalCalories = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.approxCalories, 0),
    [selectedItems]
  );

  const groupCoverage = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const g of FOOD_GROUPS) counts[g] = 0;
    for (const item of selectedItems) {
      counts[item.foodGroup] = (counts[item.foodGroup] || 0) + 1;
    }
    return counts;
  }, [selectedItems]);

  const coveredGroupCount = FOOD_GROUPS.filter((g) => groupCoverage[g] > 0).length;
  const missingGroups = FOOD_GROUPS.filter((g) => groupCoverage[g] === 0);

  return (
    <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="lg:col-span-6 space-y-3">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Interactive Meal Awareness Tool · Indian Food Staples
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Healthy Indian Diet Planner
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Select wholesome everyday foods across Breakfast, Lunch, Dinner, and Snacks to explore how different food groups work together for balanced daily nutrition.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTED_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setSelectedIds(preset.ids)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <MediaFrame
              src={PORTAL_IMAGES.indianDietPlanner}
              alt="Wholesome Indian daily meals featuring steamed idlis with sambar, vegetable upma, sprouted moong salad, fruits, and nuts"
              aspectClass="aspect-[16/9]"
              className="border border-slate-200 dark:border-slate-800"
              fallbackTitle="Indian Daily Diet Options"
            />
          </div>
        </div>

        {/* Non-Medical Disclaimer Notice */}
        <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 text-sky-700 dark:text-sky-400 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-slate-900 dark:text-white">Educational Awareness Note:</strong>{' '}
            These meal combinations are general nutrition education examples based on everyday Indian foods—not personalized medical or clinical diet prescriptions. Consult a qualified physician or registered dietitian for specific medical dietary needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 cols: Meal Builder Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                {(['All', ...MEAL_SLOTS] as const).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setActiveSlot(slot)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      activeSlot === slot
                        ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Plate
              </button>
            </div>

            {MEAL_SLOTS.filter((slot) => activeSlot === 'All' || activeSlot === slot).map((slot) => {
              const items = INDIAN_DIET_ITEMS.filter((i) => i.mealSlot === slot);
              return (
                <section key={slot} className="space-y-3">
                  <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{slot}</h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {items.filter((i) => selectedIds.includes(i.id)).length} of {items.length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {items.map((item) => {
                      const chosen = selectedIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-pressed={chosen}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            chosen
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-500 dark:border-emerald-600'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                {item.name}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {item.foodGroup} · {item.portion} · ~{item.approxCalories} kcal
                              </p>
                            </div>
                            <span
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                                chosen
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {chosen && <Check className="w-3.5 h-3.5" />}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                            {item.benefit}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Right 4 cols: Live Balance Summary Deck */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Daily Educational Summary
                </p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Your Planned Meal Balance
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Items Selected</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                    {selectedItems.length}
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Est. Energy</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-sky-700 dark:text-sky-400 mt-1">
                    {totalCalories} <span className="text-xs font-sans font-normal">kcal</span>
                  </div>
                </div>
              </div>

              {/* Food Group Coverage */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Food Group Coverage</span>
                  <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                    {coveredGroupCount} / {FOOD_GROUPS.length} groups
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-200"
                    style={{ width: `${(coveredGroupCount / FOOD_GROUPS.length) * 100}%` }}
                  />
                </div>
                <ul className="space-y-1.5 pt-2">
                  {FOOD_GROUPS.map((group) => {
                    const count = groupCoverage[group];
                    return (
                      <li key={group} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300">{group}</span>
                        <span
                          className={`font-mono tabular-nums ${
                            count > 0
                              ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                              : 'text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {count > 0 ? `${count} item${count > 1 ? 's' : ''} · Covered` : 'Missing'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Healthy Meal Guidance
                </p>
                {selectedItems.length === 0 ? (
                  <p>Select items from Breakfast, Lunch, Dinner, and Snacks to evaluate food-group diversity.</p>
                ) : missingGroups.length === 0 ? (
                  <p className="text-emerald-700 dark:text-emerald-400">
                    Well-rounded daily selection! All five core food groups are represented alongside safe hydration (7–8 glasses water).
                  </p>
                ) : (
                  <p>
                    Consider adding a food from:{' '}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {missingGroups.join(', ')}
                    </span>{' '}
                    to round out your daily nutrition balance.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
