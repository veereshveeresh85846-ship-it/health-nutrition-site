import React, { useEffect, useState } from 'react';
import { ArrowUp, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { PortalProvider, usePortal } from './context/PortalContext';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { DietPlannerPage } from './pages/DietPlannerPage';
import { HomePage } from './pages/HomePage';
import { LearningPage } from './pages/LearningPage';
import { NutritionPage } from './pages/NutritionPage';
import { PostSurveyPage } from './pages/PostSurveyPage';
import { PreSurveyPage } from './pages/PreSurveyPage';
import { QuizPage } from './pages/QuizPage';

const PortalShell: React.FC = () => {
  const { route, toasts, dismissToast } = usePortal();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 360);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const renderPage = () => {
    switch (route) {
      case 'about':
        return <AboutPage />;
      case 'nutrition':
        return <NutritionPage />;
      case 'diet-planner':
        return <DietPlannerPage />;
      case 'pre-survey':
        return <PreSurveyPage />;
      case 'learning':
        return <LearningPage />;
      case 'quiz':
        return <QuizPage />;
      case 'post-survey':
        return <PostSurveyPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'admin':
        return <AdminPage />;
      case 'contact':
        return <ContactPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />

      {/* Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center transition-transform hover:-translate-y-0.5 no-print"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-3rem)] no-print"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-start gap-2.5 p-3.5 rounded-xl border shadow-md text-sm ${
                toast.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : toast.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                  : 'bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-100'
              }`}
            >
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'error' && (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              )}
              <span className="flex-1 leading-snug">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="opacity-70 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <PortalProvider>
        <PortalShell />
      </PortalProvider>
    </ErrorBoundary>
  );
}
