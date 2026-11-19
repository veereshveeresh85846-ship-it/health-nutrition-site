import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import {
  fetchPublishedEducationContent,
  fetchPublishedTestimonials,
  fetchPublicSurveyMetrics,
  fetchUserOwnParticipants,
  syncUserProfile,
  updateParticipantLearningProgress,
} from '../firebase/service';
import {
  EducationalArticle,
  PageRoute,
  ParticipantRecord,
  PublicSurveyMetric,
  PublicTestimonial,
  ToastMessage,
} from '../types/portal';

const THEME_STORAGE_KEY = 'nutriaware_theme';
const LEARNING_STORAGE_KEY = 'nutriaware_completed_modules';
const ACTIVE_PID_STORAGE_KEY = 'nutriaware_active_participant_id';

interface PortalContextValue {
  route: PageRoute;
  navigate: (next: PageRoute) => void;
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  signingIn: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  darkMode: boolean;
  toggleDarkMode: () => void;
  publicMetrics: PublicSurveyMetric[];
  metricsLoading: boolean;
  refreshPublicMetrics: () => Promise<void>;
  testimonials: PublicTestimonial[];
  customArticles: EducationalArticle[];
  refreshEducationalContent: () => Promise<void>;
  refreshTestimonials: () => Promise<void>;
  myParticipants: ParticipantRecord[];
  refreshMyParticipants: () => Promise<void>;
  activeParticipantId: string;
  setActiveParticipantId: (pid: string) => void;
  completedModules: string[];
  markModuleCompleted: (moduleId: string) => Promise<void>;
  toasts: ToastMessage[];
  pushToast: (type: ToastMessage['type'], message: string) => void;
  dismissToast: (id: string) => void;
}

const VALID_ROUTES: PageRoute[] = [
  'home',
  'about',
  'nutrition',
  'diet-planner',
  'pre-survey',
  'learning',
  'quiz',
  'post-survey',
  'dashboard',
  'admin',
  'contact',
];

function getInitialRoute(): PageRoute {
  const hash = window.location.hash.replace(/^#\/?/, '').trim() as PageRoute;
  return VALID_ROUTES.includes(hash) ? hash : 'home';
}

const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<PageRoute>(getInitialRoute);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  const [publicMetrics, setPublicMetrics] = useState<PublicSurveyMetric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);
  const [customArticles, setCustomArticles] = useState<EducationalArticle[]>([]);
  const [myParticipants, setMyParticipants] = useState<ParticipantRecord[]>([]);

  const [activeParticipantId, setActiveParticipantIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(ACTIVE_PID_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LEARNING_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigate = useCallback((next: PageRoute) => {
    setRoute(next);
    window.location.hash = next === 'home' ? '' : `#/${next}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getInitialRoute());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Sync Tailwind dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const setActiveParticipantId = useCallback((pid: string) => {
    setActiveParticipantIdState(pid);
    try {
      localStorage.setItem(ACTIVE_PID_STORAGE_KEY, pid);
    } catch {
      // ignore storage quota errors
    }
  }, []);

  const refreshPublicMetrics = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const data = await fetchPublicSurveyMetrics();
      setPublicMetrics(data);
    } catch (err) {
      console.error('Failed to load public survey metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  const refreshTestimonials = useCallback(async () => {
    try {
      const data = await fetchPublishedTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    }
  }, []);

  const refreshEducationalContent = useCallback(async () => {
    try {
      const data = await fetchPublishedEducationContent();
      setCustomArticles(data);
    } catch (err) {
      console.error('Failed to load educational content:', err);
    }
  }, []);

  const refreshMyParticipants = useCallback(async () => {
    if (!auth.currentUser) {
      setMyParticipants([]);
      return;
    }
    try {
      const list = await fetchUserOwnParticipants(auth.currentUser.uid);
      setMyParticipants(list);
      if (list.length > 0) {
        const latest = list[list.length - 1];
        if (!activeParticipantId) {
          setActiveParticipantId(latest.participantId);
        }
        if (latest.learningModulesCompleted.length > completedModules.length) {
          setCompletedModules(latest.learningModulesCompleted);
        }
      }
    } catch (err) {
      console.error('Failed to load participant records:', err);
    }
  }, [activeParticipantId, completedModules.length, setActiveParticipantId]);

  useEffect(() => {
    void refreshPublicMetrics();
    void refreshTestimonials();
    void refreshEducationalContent();
  }, [refreshPublicMetrics, refreshTestimonials, refreshEducationalContent]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          const { isAdmin: adminFlag } = await syncUserProfile();
          setIsAdmin(adminFlag);
          const own = await fetchUserOwnParticipants(nextUser.uid);
          setMyParticipants(own);
          if (own.length > 0 && !localStorage.getItem(ACTIVE_PID_STORAGE_KEY)) {
            setActiveParticipantId(own[own.length - 1].participantId);
          }
        } catch (err) {
          console.error('Auth profile sync warning:', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setMyParticipants([]);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, [setActiveParticipantId]);

  const signInWithGoogle = useCallback(async () => {
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      pushToast('success', 'Signed in with Google successfully.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to complete Google sign-in.';
      if (!msg.includes('popup-closed-by-user')) {
        pushToast('error', 'Sign-in failed. Please allow popups and try again.');
      }
    } finally {
      setSigningIn(false);
    }
  }, [pushToast]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      setMyParticipants([]);
      pushToast('info', 'Signed out successfully.');
    } catch {
      pushToast('error', 'Could not sign out. Please try again.');
    }
  }, [pushToast]);

  const markModuleCompleted = useCallback(
    async (moduleId: string) => {
      const updated = Array.from(new Set([...completedModules, moduleId])).slice(0, 6);
      setCompletedModules(updated);
      try {
        localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      if (auth.currentUser && activeParticipantId) {
        const ownsActive = myParticipants.some((p) => p.participantId === activeParticipantId);
        if (ownsActive) {
          try {
            await updateParticipantLearningProgress(activeParticipantId, updated);
          } catch (err) {
            console.error('Could not sync learning progress to Firestore:', err);
          }
        }
      }
    },
    [activeParticipantId, completedModules, myParticipants]
  );

  return (
    <PortalContext.Provider
      value={{
        route,
        navigate,
        user,
        authReady,
        isAdmin,
        signingIn,
        signInWithGoogle,
        logout,
        darkMode,
        toggleDarkMode,
        publicMetrics,
        metricsLoading,
        refreshPublicMetrics,
        testimonials,
        customArticles,
        refreshEducationalContent,
        refreshTestimonials,
        myParticipants,
        refreshMyParticipants,
        activeParticipantId,
        setActiveParticipantId,
        completedModules,
        markModuleCompleted,
        toasts,
        pushToast,
        dismissToast,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used within PortalProvider');
  return ctx;
}
