import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, BookOpen, Layers, RotateCcw } from 'lucide-react';
import type {
  AppState,
  ArticleOption,
  FlashcardFilter,
  FlashcardStatus,
  QuizCategoryFilter,
  QuizOrder,
  QuizQuestion,
  WorkspaceMode,
} from './types/grammar';
import { ALL_QUESTIONS, seededShuffle } from './data/frames';
import { FLASHCARDS } from './data/flashcards';
import { QuizPanel } from './components/QuizPanel';
import { FlashcardsPanel } from './components/FlashcardsPanel';
import { ReferenceGuide } from './components/ReferenceGuide';

const STORAGE_KEY = 'deutsche_praepositionen_state_v1';

const DEFAULT_STATE: AppState = {
  mode: 'quiz',
  category: 'all',
  prep: 'all',
  order: 'shuffled',
  currentIdx: 0,
  answeredIds: {},
  correctCount: 0,
  totalAnswered: 0,
  streak: 0,
  wrongIds: [],
  shuffleSalt: 0,
  fcFilter: 'all',
  fcIndex: 0,
  fcStatus: {},
  fcShuffleSalt: 0,
};

function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      answeredIds: parsed.answeredIds ?? {},
      wrongIds: Array.isArray(parsed.wrongIds) ? parsed.wrongIds : [],
      fcStatus: parsed.fcStatus ?? {},
      mode: parsed.mode === 'flashcards' ? 'flashcards' : 'quiz',
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(loadInitialState);
  const [resetArmed, setResetArmed] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  // Persist state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch {
      // Ignore storage quota errors
    }
  }, [appState]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  // Derive active quiz pool
  const activePool = useMemo(() => {
    let filtered = ALL_QUESTIONS;

    if (appState.category === 'mistakes') {
      const wrongSet = new Set(appState.wrongIds);
      filtered = filtered.filter((q) => wrongSet.has(q.id));
    } else if (appState.category !== 'all') {
      filtered = filtered.filter((q) => q.cat === appState.category);
    }

    if (appState.prep !== 'all') {
      filtered = filtered.filter((q) => q.prep === appState.prep);
    }

    if (appState.order === 'sequential') {
      return filtered.slice().sort((a, b) => a.id - b.id);
    }
    return seededShuffle(filtered, 777 + appState.shuffleSalt);
  }, [appState.category, appState.prep, appState.order, appState.shuffleSalt, appState.wrongIds]);

  const safeQuizIdx = activePool.length > 0 ? Math.min(appState.currentIdx, activePool.length - 1) : 0;

  // Derive active flashcard deck
  const activeDeck = useMemo(() => {
    let deck = FLASHCARDS;
    if (appState.fcFilter === 'prep') {
      deck = FLASHCARDS.filter((c) => c.type === 'prep');
    } else if (appState.fcFilter === 'art') {
      deck = FLASHCARDS.filter((c) => c.type === 'art');
    } else if (appState.fcFilter === 'contr') {
      deck = FLASHCARDS.filter((c) => c.type === 'contr');
    } else if (appState.fcFilter === 'review') {
      deck = FLASHCARDS.filter((c) => appState.fcStatus[c.id] === 'review');
    }

    if (appState.fcShuffleSalt > 0) {
      deck = seededShuffle(deck, 505 + appState.fcShuffleSalt);
    }
    return deck;
  }, [appState.fcFilter, appState.fcShuffleSalt, appState.fcStatus]);

  const safeFcIdx = activeDeck.length > 0 ? Math.min(appState.fcIndex, activeDeck.length - 1) : 0;

  // KPI metrics
  const accuracyPct =
    appState.totalAnswered > 0
      ? Math.round((appState.correctCount / appState.totalAnswered) * 100)
      : 0;
  const uniqueAnswered = Object.keys(appState.answeredIds).length;

  // Handlers
  const handleSwitchMode = (mode: WorkspaceMode) => {
    setAppState((prev) => ({ ...prev, mode }));
  };

  const handleCategoryChange = (category: QuizCategoryFilter) => {
    setAppState((prev) => ({ ...prev, category, currentIdx: 0 }));
  };

  const handlePrepChange = (prep: string) => {
    setAppState((prev) => ({ ...prev, prep, currentIdx: 0 }));
  };

  const handleOrderChange = (order: QuizOrder) => {
    setAppState((prev) => ({ ...prev, order, currentIdx: 0 }));
  };

  const handleReshuffle = () => {
    setAppState((prev) => ({
      ...prev,
      shuffleSalt: prev.shuffleSalt + 1,
      order: 'shuffled',
      currentIdx: 0,
    }));
  };

  const handleAnswer = useCallback((question: QuizQuestion, chosen: ArticleOption) => {
    const isCorrect = chosen === question.answer;
    setAppState((prev) => {
      const nextWrongIds = isCorrect
        ? prev.wrongIds.filter((id) => id !== question.id)
        : prev.wrongIds.includes(question.id)
        ? prev.wrongIds
        : [...prev.wrongIds, question.id];

      return {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
        streak: isCorrect ? prev.streak + 1 : 0,
        answeredIds: {
          ...prev.answeredIds,
          [question.id]: isCorrect ? 'ok' : 'err',
        },
        wrongIds: nextWrongIds,
      };
    });
  }, []);

  const handleNextQuestion = useCallback(() => {
    setAppState((prev) => {
      if (activePool.length === 0) return prev;
      const nextIdx = prev.currentIdx < activePool.length - 1 ? prev.currentIdx + 1 : 0;
      return { ...prev, currentIdx: nextIdx };
    });
  }, [activePool.length]);

  const handlePrevQuestion = useCallback(() => {
    setAppState((prev) => {
      if (activePool.length === 0 || prev.currentIdx <= 0) return prev;
      return { ...prev, currentIdx: prev.currentIdx - 1 };
    });
  }, [activePool.length]);

  const handleFcFilterChange = (fcFilter: FlashcardFilter) => {
    setAppState((prev) => ({ ...prev, fcFilter, fcIndex: 0 }));
  };

  const handleFcShuffle = () => {
    setAppState((prev) => ({
      ...prev,
      fcShuffleSalt: prev.fcShuffleSalt + 1,
      fcIndex: 0,
    }));
  };

  const handleFcNext = useCallback(() => {
    setAppState((prev) => {
      if (activeDeck.length === 0) return prev;
      return { ...prev, fcIndex: (prev.fcIndex + 1) % activeDeck.length };
    });
  }, [activeDeck.length]);

  const handleFcPrev = useCallback(() => {
    setAppState((prev) => {
      if (activeDeck.length === 0) return prev;
      return {
        ...prev,
        fcIndex: (prev.fcIndex - 1 + activeDeck.length) % activeDeck.length,
      };
    });
  }, [activeDeck.length]);

  const handleFcMark = (cardId: string, status: FlashcardStatus) => {
    setAppState((prev) => {
      const nextIdx = activeDeck.length > 0 ? (prev.fcIndex + 1) % activeDeck.length : 0;
      return {
        ...prev,
        fcStatus: { ...prev.fcStatus, [cardId]: status },
        fcIndex: nextIdx,
      };
    });
  };

  const handleResetProgress = () => {
    if (!resetArmed) {
      setResetArmed(true);
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setResetArmed(false);
      }, 3500);
      return;
    }

    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    setResetArmed(false);
    setAppState((prev) => ({
      ...DEFAULT_STATE,
      mode: prev.mode,
    }));
  };

  return (
    <div className="max-w-[1120px] mx-auto p-3 sm:p-6 grid grid-cols-1 gap-5 sm:gap-6">
      {/* Header & Progress Overview */}
      <header className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-2xl p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36_/_0.06)] grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 items-center">
        <div>
          <p className="font-label text-xs font-semibold tracking-wider text-[var(--primary)] mb-1">
            German Grammar Studio · A1–A2
          </p>
          <h1 className="font-headline text-[clamp(1.75rem,1.35rem+1.4vw,2.35rem)] font-semibold leading-[1.15] tracking-tight text-[var(--on-surface)] mb-2 text-balance">
            Deutsche Präpositionen
          </h1>
          <p className="text-[var(--on-surface-variant)] max-w-[60ch]">
            Practise 1,000 realistic sentences across Akkusativ, Dativ, and Wechselpräpositionen, drill case-hidden flashcards, and consult the full grammar guide below.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5" aria-label="Practice statistics">
          <div className="bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-[var(--outline-variant)] rounded-[10px] py-4 px-2 text-center">
            <span className="block font-label text-xs font-medium mb-1">Accuracy</span>
            <span className="font-headline text-[1.35rem] sm:text-[1.75rem] font-semibold tabular-nums leading-none">
              {accuracyPct}%
            </span>
          </div>

          <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded-[10px] py-4 px-2 text-center">
            <span className="block font-label text-xs font-medium text-[var(--on-surface-variant)] mb-1">
              Answered
            </span>
            <span className="font-headline text-[1.35rem] sm:text-[1.75rem] font-semibold text-[var(--on-surface)] tabular-nums leading-none">
              {uniqueAnswered} / {ALL_QUESTIONS.length}
            </span>
          </div>

          <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded-[10px] py-4 px-2 text-center">
            <span className="block font-label text-xs font-medium text-[var(--on-surface-variant)] mb-1">
              Streak
            </span>
            <span className="font-headline text-[1.35rem] sm:text-[1.75rem] font-semibold text-[var(--on-surface)] tabular-nums leading-none">
              {appState.streak}
            </span>
          </div>
        </div>
      </header>

      {/* Workspace Mode Bar */}
      <nav
        aria-label="Primary workspace navigation"
        className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-2xl px-4 py-2.5 shadow-[0_4px_18px_rgb(30_45_36_/_0.06)]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSwitchMode('quiz')}
            className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-[10px] border font-semibold cursor-pointer transition-colors whitespace-nowrap ${
              appState.mode === 'quiz'
                ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)] hover:bg-[var(--primary-hover)]'
                : 'bg-[var(--surface-container)] text-[var(--on-surface)] border-[var(--outline-variant)] hover:bg-[var(--surface-container-high)]'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Quiz Practice (1,000)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('flashcards')}
            className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-[10px] border font-semibold cursor-pointer transition-colors whitespace-nowrap ${
              appState.mode === 'flashcards'
                ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)] hover:bg-[var(--primary-hover)]'
                : 'bg-[var(--surface-container)] text-[var(--on-surface)] border-[var(--outline-variant)] hover:bg-[var(--surface-container-high)]'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Flashcards</span>
          </button>

          <a
            href="#grammar-reference"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-[10px] border border-[var(--outline-variant)] bg-transparent hover:bg-[var(--surface-container)] text-[var(--on-surface)] font-semibold transition-colors whitespace-nowrap"
          >
            <span>Reference Guide</span>
            <ArrowDown className="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={handleResetProgress}
          className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-[10px] border text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${
            resetArmed
              ? 'bg-[var(--error-container)] text-[var(--on-error-container)] border-[var(--error)]'
              : 'bg-transparent text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:bg-[var(--surface-container)]'
          }`}
        >
          <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{resetArmed ? 'Click again to reset' : 'Reset Progress'}</span>
        </button>
      </nav>

      {/* Active Study Workspace */}
      {appState.mode === 'quiz' ? (
        <QuizPanel
          activePool={activePool}
          currentIdx={safeQuizIdx}
          category={appState.category}
          prep={appState.prep}
          order={appState.order}
          wrongCount={appState.wrongIds.length}
          onCategoryChange={handleCategoryChange}
          onPrepChange={handlePrepChange}
          onOrderChange={handleOrderChange}
          onReshuffle={handleReshuffle}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
          onPrev={handlePrevQuestion}
        />
      ) : (
        <FlashcardsPanel
          activeDeck={activeDeck}
          totalDeckSize={FLASHCARDS.length}
          fcFilter={appState.fcFilter}
          fcIndex={safeFcIdx}
          fcStatus={appState.fcStatus}
          onFilterChange={handleFcFilterChange}
          onShuffle={handleFcShuffle}
          onNext={handleFcNext}
          onPrev={handleFcPrev}
          onMark={handleFcMark}
        />
      )}

      {/* Comprehensive Grammar Reference Section */}
      <ReferenceGuide />

      <footer className="text-center text-[var(--on-surface-variant)] text-sm py-4 pb-8">
        Built from A1/A2 German grammar references (<em>Basic German</em>, <em>Schritte Übungsgrammatik</em>, and <em>Collins Easy Learning German Verbs</em>).
      </footer>
    </div>
  );
}
