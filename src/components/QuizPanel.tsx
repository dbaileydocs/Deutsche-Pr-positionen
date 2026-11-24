import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw, Shuffle, XCircle } from 'lucide-react';
import type { ArticleOption, QuizCategoryFilter, QuizOrder, QuizQuestion } from '../types/grammar';
import { ALL_PREPOSITIONS } from '../data/frames';

interface QuizPanelProps {
  activePool: QuizQuestion[];
  currentIdx: number;
  category: QuizCategoryFilter;
  prep: string;
  order: QuizOrder;
  wrongCount: number;
  onCategoryChange: (cat: QuizCategoryFilter) => void;
  onPrepChange: (prep: string) => void;
  onOrderChange: (order: QuizOrder) => void;
  onReshuffle: () => void;
  onAnswer: (question: QuizQuestion, chosen: ArticleOption) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ARTICLE_OPTIONS: Array<{ art: ArticleOption; keyHint: string }> = [
  { art: 'der', keyHint: '1' },
  { art: 'die', keyHint: '2' },
  { art: 'das', keyHint: '3' },
  { art: 'den', keyHint: '4' },
  { art: 'dem', keyHint: '5' },
  { art: 'des', keyHint: '6' },
];

export function QuizPanel({
  activePool,
  currentIdx,
  category,
  prep,
  order,
  wrongCount,
  onCategoryChange,
  onPrepChange,
  onOrderChange,
  onReshuffle,
  onAnswer,
  onNext,
  onPrev,
}: QuizPanelProps) {
  const [chosenAnswer, setChosenAnswer] = useState<ArticleOption | null>(null);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = activePool[currentIdx] ?? null;
  const isAnswered = chosenAnswer !== null;

  // Reset per-question UI state whenever the displayed question or pool changes
  useEffect(() => {
    setChosenAnswer(null);
    setShowHint(false);
  }, [currentQuestion?.id, activePool]);

  const handleSelect = (art: ArticleOption) => {
    if (!currentQuestion || isAnswered) return;
    setChosenAnswer(art);
    onAnswer(currentQuestion, art);
  };

  // Keyboard shortcuts: 1-6 to select article, Enter to advance once answered
  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      const tag = ev.target && (ev.target as HTMLElement).tagName
        ? (ev.target as HTMLElement).tagName.toLowerCase()
        : '';
      if (tag === 'select' || tag === 'input' || tag === 'textarea') return;

      const keyMap: Record<string, ArticleOption> = {
        '1': 'der',
        '2': 'die',
        '3': 'das',
        '4': 'den',
        '5': 'dem',
        '6': 'des',
      };
      if (keyMap[ev.key]) {
        if (!currentQuestion || isAnswered) return;
        setChosenAnswer(keyMap[ev.key]);
        onAnswer(currentQuestion, keyMap[ev.key]);
      } else if (ev.key === 'Enter' && isAnswered) {
        ev.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, isAnswered, onAnswer, onNext]);

  const isCorrect = currentQuestion !== null && chosenAnswer === currentQuestion.answer;
  const progressPct =
    activePool.length > 0 ? Math.round(((currentIdx + 1) / activePool.length) * 100) : 0;

  const categoryText = currentQuestion
    ? currentQuestion.cat === 'akk'
      ? `Akkusativ · "${currentQuestion.prep}"`
      : currentQuestion.cat === 'dat'
      ? `Dativ · "${currentQuestion.prep}"`
      : `Wechselpräposition · "${currentQuestion.prep}"`
    : 'Empty';

  const categoryAccentClass = currentQuestion
    ? currentQuestion.cat === 'akk'
      ? 'text-[#1b4965]'
      : currentQuestion.cat === 'dat'
      ? 'text-[var(--primary)]'
      : 'text-[#5f3a12]'
    : 'text-[var(--on-surface-variant)]';

  return (
    <main
      className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-2xl p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36_/_0.06)]"
      aria-labelledby="quiz-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
        <h2
          id="quiz-heading"
          className="font-headline text-xl sm:text-2xl font-semibold text-[var(--on-surface)]"
        >
          Article &amp; Case Quiz
        </h2>
        <span className="font-label text-xs font-medium text-[var(--on-surface-variant)] tabular-nums">
          Pool: {activePool.length.toLocaleString()} {activePool.length === 1 ? 'question' : 'questions'}
        </span>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end pb-5 mb-6 border-b border-[var(--outline-variant)]">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-category"
            className="font-label text-xs font-semibold text-[var(--on-surface-variant)]"
          >
            Case Category
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as QuizCategoryFilter)}
            className="min-h-[44px] px-3.5 py-2 border border-[var(--outline-variant)] rounded-[10px] bg-[var(--surface-container-low)] text-[var(--on-surface)] font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <option value="all">All Categories (1,000)</option>
            <option value="akk">Akkusativ Only (300)</option>
            <option value="dat">Dativ Only (350)</option>
            <option value="wech">Wechselpräpositionen (350)</option>
            <option value="mistakes">Review Mistakes ({wrongCount})</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-prep"
            className="font-label text-xs font-semibold text-[var(--on-surface-variant)]"
          >
            Preposition
          </label>
          <select
            id="filter-prep"
            value={prep}
            onChange={(e) => onPrepChange(e.target.value)}
            className="min-h-[44px] px-3.5 py-2 border border-[var(--outline-variant)] rounded-[10px] bg-[var(--surface-container-low)] text-[var(--on-surface)] font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <option value="all">All Prepositions</option>
            {ALL_PREPOSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-order"
            className="font-label text-xs font-semibold text-[var(--on-surface-variant)]"
          >
            Order
          </label>
          <select
            id="filter-order"
            value={order}
            onChange={(e) => onOrderChange(e.target.value as QuizOrder)}
            className="min-h-[44px] px-3.5 py-2 border border-[var(--outline-variant)] rounded-[10px] bg-[var(--surface-container-low)] text-[var(--on-surface)] font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <option value="shuffled">Shuffled Practice</option>
            <option value="sequential">Sequential (#1–1000)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onReshuffle}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-[var(--on-surface)] font-semibold cursor-pointer transition-colors duration-150 whitespace-nowrap"
        >
          <Shuffle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>New Shuffle</span>
        </button>
      </div>

      {/* Metadata & Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 font-label text-xs">
        <span className="text-[var(--on-surface-variant)] tabular-nums">
          {currentQuestion
            ? `Question ${currentIdx + 1} of ${activePool.length} · #${currentQuestion.id}`
            : 'No questions in this filter'}
        </span>
        <span className={`font-semibold ${categoryAccentClass}`}>{categoryText}</span>
      </div>

      <div
        className="w-full h-2 bg-[var(--surface-container)] rounded-full overflow-hidden mb-6"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[var(--primary)] rounded-full transition-[width] duration-200 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Prompt Stage */}
      <div className="bg-[var(--background)] border border-[var(--outline-variant)] rounded-2xl px-5 py-8 sm:px-8 sm:py-10 mb-6 text-center">
        {currentQuestion ? (
          <>
            <p className="font-headline text-[1.35rem] sm:text-[1.75rem] font-medium leading-snug text-[var(--on-surface)] mb-2.5">
              {currentQuestion.beforeBlank}{' '}
              <span
                className={`inline-block min-w-[3.4rem] px-2.5 mx-1 border-b-[2.5px] font-semibold rounded transition-colors ${
                  !isAnswered
                    ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-container)]'
                    : isCorrect
                    ? 'border-[var(--primary)] text-[var(--on-primary-container)] bg-[var(--primary-container)]'
                    : 'border-[var(--error)] text-[var(--on-error-container)] bg-[var(--error-container)]'
                }`}
              >
                {isAnswered ? currentQuestion.answer : '___'}
              </span>{' '}
              {currentQuestion.afterBlank}
            </p>
            <p className="text-[0.975rem] text-[var(--on-surface-variant)]">
              {currentQuestion.en}
            </p>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-1.5 rounded-[10px] border border-[var(--outline-variant)] bg-transparent hover:bg-[var(--surface-container)] text-sm font-semibold text-[var(--on-surface-variant)] cursor-pointer transition-colors"
              >
                {showHint ? (
                  <>
                    <EyeOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Hide Noun Gender Hint</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Show Noun Gender Hint</span>
                  </>
                )}
              </button>
            </div>

            {showHint && (
              <p className="mt-2.5 font-label text-[0.8125rem] text-[var(--secondary)]">
                Noun: {currentQuestion.nounDe} — {currentQuestion.genderLabel}
              </p>
            )}
          </>
        ) : (
          <div className="py-4">
            <p className="font-headline text-xl font-medium text-[var(--on-surface)] mb-2">
              No mistakes to review right now.
            </p>
            <p className="text-[var(--on-surface-variant)]">
              Switch back to &ldquo;All Categories&rdquo; or choose another preposition to continue practising.
            </p>
          </div>
        )}
      </div>

      {/* Article Choices */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
        role="group"
        aria-label="Choose the correct article"
      >
        {ARTICLE_OPTIONS.map(({ art, keyHint }) => {
          const isThisCorrect = isAnswered && currentQuestion?.answer === art;
          const isThisWrong = isAnswered && chosenAnswer === art && !isCorrect;

          return (
            <button
              key={art}
              type="button"
              disabled={!currentQuestion || isAnswered}
              onClick={() => handleSelect(art)}
              className={`min-h-[56px] px-4 py-3 rounded-[10px] border flex items-center justify-center gap-2.5 font-headline text-xl font-semibold transition-all duration-150 ${
                isThisCorrect
                  ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]'
                  : isThisWrong
                  ? 'bg-[var(--error-container)] text-[var(--on-error-container)] border-[var(--error)]'
                  : 'bg-[var(--surface-container-low)] text-[var(--on-surface)] border-[var(--outline-variant)] shadow-[0_4px_18px_rgb(30_45_36_/_0.06)] hover:enabled:bg-[var(--surface-container)] hover:enabled:-translate-y-0.5 cursor-pointer disabled:cursor-default disabled:opacity-65'
              }`}
            >
              <span
                className={`font-label text-xs px-1.5 py-0.5 rounded ${
                  isThisCorrect
                    ? 'bg-[var(--primary-hover)] text-[var(--on-primary)]'
                    : isThisWrong
                    ? 'bg-[var(--error)] text-white'
                    : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)]'
                }`}
              >
                {keyHint}
              </span>
              <span>{art}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback Banner (Dual-coded: icon + explicit text + colour) */}
      {isAnswered && currentQuestion && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-[10px] px-5 py-4 mb-6 border ${
            isCorrect
              ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] border-[var(--outline-variant)]'
              : 'bg-[var(--error-container)] text-[var(--on-error-container)] border-[var(--error)]/40'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
            )}
            <div>
              <p className="font-headline font-semibold text-[1.075rem] mb-1">
                {isCorrect
                  ? `Correct! "${currentQuestion.answer}" (${currentQuestion.caseName})`
                  : `Not quite — the correct article is "${currentQuestion.answer}" (${currentQuestion.caseName}).`}
              </p>
              <p className="text-[0.95rem] leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={activePool.length === 0 || currentIdx <= 0}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container)] hover:enabled:bg-[var(--surface-container-high)] text-[var(--on-surface)] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Previous</span>
        </button>

        <span className="font-label text-xs text-[var(--on-surface-variant)] hidden sm:inline">
          Tip: Keys 1–6 select · Enter for next
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={activePool.length === 0}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-2 rounded-[10px] border border-[var(--primary)] bg-[var(--primary)] hover:enabled:bg-[var(--primary-hover)] text-[var(--on-primary)] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {currentIdx >= activePool.length - 1 ? (
            <>
              <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Restart Pool</span>
            </>
          ) : (
            <>
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </main>
  );
}
