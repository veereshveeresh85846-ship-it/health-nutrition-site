import React from 'react';
import { LogIn, LogOut, Moon, Sun } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { PageRoute } from '../types/portal';

export const Footer: React.FC = () => {
  const { navigate, darkMode, toggleDarkMode, user, isAdmin, signInWithGoogle, logout } = usePortal();

  const linkBtn = (target: PageRoute, label: string) => (
    <button
      key={target}
      type="button"
      onClick={() => navigate(target)}
      className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-left"
    >
      {label}
    </button>
  );

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & VTU Context */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white inline-flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.2">
                  <path d="M12 21c4.5-3.5 7-7.2 7-11.2A5.8 5.8 0 0 0 12 4.2 5.8 5.8 0 0 0 5 9.8C5 13.8 7.5 17.5 12 21Z" />
                  <path d="M9.5 11.5h5M12 9v5" strokeLinecap="round" />
                </svg>
              </span>
              <span>NutriAware Portal</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Health and Nutrition Awareness Portal developed for the VTU Ability Enhancement Course (AEC) Lab to educate communities and measure real awareness gains.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Educational awareness resource only — not a substitute for clinical medical advice.
            </p>
          </div>

          {/* Learning Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Education & Planning
            </h3>
            <div className="flex flex-col gap-2">
              {linkBtn('nutrition', 'Nutrition Education')}
              {linkBtn('diet-planner', 'Indian Healthy Diet Planner')}
              {linkBtn('learning', 'Interactive Learning Modules')}
              {linkBtn('quiz', '15-Question Nutrition Quiz')}
            </div>
          </div>

          {/* Assessment Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Assessment & Impact
            </h3>
            <div className="flex flex-col gap-2">
              {linkBtn('pre-survey', 'Pre-Program Awareness Survey')}
              {linkBtn('post-survey', 'Post-Program Awareness Survey')}
              {linkBtn('dashboard', 'Results & Analytics Dashboard')}
              {linkBtn('admin', 'Admin Evaluation Dashboard')}
            </div>
          </div>

          {/* Account & Appearance Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Portal Controls
            </h3>
            <div className="flex flex-col gap-2">
              {linkBtn('about', 'About This VTU Project')}
              {linkBtn('contact', 'Contact & Feedback')}
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {darkMode ? 'Light Theme' : 'Dark Theme'}
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out ({isAdmin ? 'Admin' : user.displayName?.split(' ')[0] || 'User'})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void signInWithGoogle()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} Health and Nutrition Awareness Portal · VTU AEC Lab Project
          </p>
          <p>
            Privacy First: Surveys collect only non-identifying demographics and anonymous Participant IDs with explicit consent.
          </p>
        </div>
      </div>
    </footer>
  );
};
