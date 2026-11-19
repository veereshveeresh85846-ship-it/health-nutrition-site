import React from 'react';
import { ArrowRight, CheckCircle2, GraduationCap, Target, Users } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { PORTAL_IMAGES } from '../data/curriculum';
import { MediaFrame } from '../components/MediaFrame';

export const AboutPage: React.FC = () => {
  const { navigate } = usePortal();

  return (
    <div className="bg-white dark:bg-slate-950 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-12 border-b border-slate-200 dark:border-slate-800">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              VTU Ability Enhancement Course (AEC) Lab Project
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              About the Health and Nutrition Awareness Portal
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Developed by VTU engineering students as part of the Ability Enhancement Course (AEC) Lab, this web platform goes beyond static health articles. It delivers a complete, measurable public-awareness intervention: collecting baseline nutrition knowledge, delivering accessible Indian-context education, and quantifying post-program improvement through verified matched participant records.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('pre-survey')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Start Baseline Survey
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
              >
                Inspect Live Analytics
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <MediaFrame
              src={PORTAL_IMAGES.hygieneLifestyle}
              alt="Clean kitchen counter with washed green vegetables, safe drinking water pitcher, and fresh fruits"
              aspectClass="aspect-[4/3]"
              className="border border-slate-200 dark:border-slate-800"
              fallbackTitle="Community Health & Hygiene"
            />
          </div>
        </div>

        {/* Problem Statement & Importance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="p-7 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Problem Statement
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              College students, hostel residents, and everyday households frequently rely on unbalanced, carbohydrate-heavy or ultra-processed meals while overlooking micronutrient needs (iron, calcium, Vitamins A, B12, C, and D), safe drinking water practices, and basic food hygiene. Traditional awareness pamphlets rarely verify whether knowledge actually improved after the campaign.
            </p>
          </section>

          <section className="p-7 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Importance of Structured Health Awareness
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Preventive nutrition literacy empowers people to make affordable, culturally familiar food improvements—such as pairing dal with lemon for iron absorption or choosing sprouts over packaged snacks—long before nutritional deficiencies develop into clinical complications.
            </p>
          </section>
        </div>

        {/* Objectives, Target Audience, Expected Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Project Objectives
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• Conduct a standardized baseline health & nutrition awareness survey.</li>
              <li>• Deliver clear education on balanced diets, macro/micronutrients, hygiene, and lifestyle.</li>
              <li>• Offer an interactive Indian food-based daily diet planner and 15-question quiz.</li>
              <li>• Measure verified post-program improvement using matched Participant IDs.</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Target Audience & Community Benefits
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• VTU engineering students, hostel residents, and young adults.</li>
              <li>• Families and general public seeking practical Indian meal guidance.</li>
              <li>• Reduces dependency on sugary snacks and improves everyday hand & food hygiene.</li>
              <li>• Open, mobile-friendly access without specialized medical jargon.</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Expected Engineering Outcomes
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• End-to-end cloud persistence using Firebase Auth and Firestore.</li>
              <li>• Role-based security rules protecting participant privacy and admin data.</li>
              <li>• Automated Chart.js impact visualizations and downloadable CSV reports.</li>
              <li>• Transparent separation between live collected records and sample demo data.</li>
            </ul>
          </div>
        </div>

        {/* Measurable Evaluation Checklist for VTU Faculty */}
        <section className="p-8 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/70">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            VTU AEC Lab Measurable Evaluation Framework
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Six verifiable engineering milestones implemented across this portal for demonstration and final evaluation:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '1. Baseline Pre-Program Survey with unique Participant ID & duplicate prevention',
              '2. Six-module structured Health & Nutrition Educational Program with progress tracking',
              '3. Interactive Indian Food-Based Diet Planner & 15-Question Nutrition Quiz',
              '4. Matched Post-Program Survey linked strictly by Participant ID',
              '5. Automated Pre vs. Post Awareness Improvement & Habit Adoption formulas',
              '6. Chart.js Analytics Dashboard, RBAC Admin Panel, CSV Export & Print Reports',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
