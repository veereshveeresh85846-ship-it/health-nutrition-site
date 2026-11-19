import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { PageRoute } from '../types/portal';

interface DropdownGroup {
  id: 'learn' | 'surveys' | 'more';
  label: string;
  items: { route: PageRoute; label: string; desc: string }[];
}

const DROPDOWN_GROUPS: Record<'learn' | 'surveys' | 'more', DropdownGroup> = {
  learn: {
    id: 'learn',
    label: 'Learn',
    items: [
      { route: 'nutrition', label: 'Nutrition Education', desc: 'Balanced diet, macros, vitamins & hygiene' },
      { route: 'learning', label: 'Learning Modules', desc: '6 guided lessons with progress tracking' },
      { route: 'quiz', label: 'Nutrition Quiz', desc: '15-question interactive assessment' },
    ],
  },
  surveys: {
    id: 'surveys',
    label: 'Surveys',
    items: [
      { route: 'pre-survey', label: 'Pre-Program Survey', desc: 'Baseline 10-question assessment & ID' },
      { route: 'post-survey', label: 'Post-Program Survey', desc: 'Matched follow-up score & feedback' },
    ],
  },
  more: {
    id: 'more',
    label: 'Portal',
    items: [
      { route: 'about', label: 'About Project', desc: 'VTU AEC Lab objectives & outcomes' },
      { route: 'contact', label: 'Contact & Feedback', desc: 'Share feedback or questions' },
      { route: 'admin', label: 'Admin Dashboard', desc: 'Role-protected evaluation & content console' },
    ],
  },
};

export const Navbar: React.FC = () => {
  const { route, navigate, darkMode, toggleDarkMode } = usePortal();
  const [openMenu, setOpenMenu] = useState<'learn' | 'surveys' | 'more' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleGo = (target: PageRoute) => {
    navigate(target);
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const isGroupActive = (group: DropdownGroup) => group.items.some((i) => i.route === route);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print">
      <div
        ref={navRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8"
      >
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleGo('home')}
          className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md"
        >
          <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white inline-flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2">
              <path d="M12 21c4.5-3.5 7-7.2 7-11.2A5.8 5.8 0 0 0 12 4.2 5.8 5.8 0 0 0 5 9.8C5 13.8 7.5 17.5 12 21Z" />
              <path d="M9.5 11.5h5M12 9v5" strokeLinecap="round" />
            </svg>
          </span>
          <span>NutriAware</span>
        </button>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-sm font-medium">
          {(['learn'] as const).map((key) => {
            const group = DROPDOWN_GROUPS[key];
            const active = isGroupActive(group);
            return (
              <div key={key} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === key ? null : key)}
                  aria-expanded={openMenu === key}
                  className={`inline-flex items-center gap-1 py-1 whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {openMenu === key && (
                  <div className="absolute left-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50">
                    {group.items.map((item) => (
                      <button
                        key={item.route}
                        type="button"
                        onClick={() => handleGo(item.route)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                          route === item.route
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => handleGo('diet-planner')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors ${
              route === 'diet-planner'
                ? 'text-emerald-700 dark:text-emerald-400 underline underline-offset-8 decoration-2'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Diet Planner
          </button>

          {(['surveys'] as const).map((key) => {
            const group = DROPDOWN_GROUPS[key];
            const active = isGroupActive(group);
            return (
              <div key={key} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === key ? null : key)}
                  aria-expanded={openMenu === key}
                  className={`inline-flex items-center gap-1 py-1 whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {openMenu === key && (
                  <div className="absolute left-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50">
                    {group.items.map((item) => (
                      <button
                        key={item.route}
                        type="button"
                        onClick={() => handleGo(item.route)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                          route === item.route
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => handleGo('dashboard')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors ${
              route === 'dashboard'
                ? 'text-emerald-700 dark:text-emerald-400 underline underline-offset-8 decoration-2'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Analytics
          </button>

          {(['more'] as const).map((key) => {
            const group = DROPDOWN_GROUPS[key];
            const active = isGroupActive(group);
            return (
              <div key={key} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === key ? null : key)}
                  aria-expanded={openMenu === key}
                  className={`inline-flex items-center gap-1 py-1 whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {openMenu === key && (
                  <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50">
                    {group.items.map((item) => (
                      <button
                        key={item.route}
                        type="button"
                        onClick={() => handleGo(item.route)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                          route === item.route
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Drawer Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleGo('pre-survey')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            Take Survey
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1">
          {(
            [
              ['home', 'Home'],
              ['about', 'About Project'],
              ['nutrition', 'Nutrition Education'],
              ['diet-planner', 'Healthy Diet Planner'],
              ['pre-survey', 'Pre-Program Survey'],
              ['learning', 'Learning Modules'],
              ['quiz', 'Nutrition Quiz'],
              ['post-survey', 'Post-Program Survey'],
              ['dashboard', 'Results & Analytics'],
              ['admin', 'Admin Dashboard'],
              ['contact', 'Contact & Feedback'],
            ] as [PageRoute, string][]
          ).map(([target, label]) => (
            <button
              key={target}
              type="button"
              onClick={() => handleGo(target)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                route === target
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">Appearance</span>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
