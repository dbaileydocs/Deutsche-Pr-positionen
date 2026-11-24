import { useEffect, useState } from 'react';
import { Bookmark, Check, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import type { FlashcardFilter, FlashcardItem, FlashcardStatus } from '../types/grammar';

interface FlashcardsPanelProps {
  activeDeck: FlashcardItem[];
  totalDeckSize: number;
  fcFilter: FlashcardFilter;
  fcIndex: number;
  fcStatus: Record<string, FlashcardStatus>;
  onFilterChange: (filter: FlashcardFilter) => void;
  onShuffle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onMark: (cardId: string, status: FlashcardStatus) => void;
}

const DECK_FILTERS: Array<{ id: FlashcardFilter; label: string }> = [
  { id: 'all', label: 'All Cards' },
  { id: 'prep', label: 'Prepositions' },
  { id: 'art', label: 'Articles & Pronouns' },
  { id: 'contr', label: 'Contractions' },
  { id: 'review', label: 'Needs Review' },
];

export function FlashcardsPanel({
  activeDeck,
  totalDeckSize,
  fcFilter,
  fcIndex,
  fcStatus,
  onFilterChange,
  onShuffle,
  onNext,
  onPrev,
  onMark,
}: FlashcardsPanelProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = activeDeck[fcIndex] ?? null;
  const masteredCount = Object.values(fcStatus).filter((v) => v === 'mastered').length;

  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard?.id, fcFilter]);

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      const tag = ev.target && (ev.target as HTMLElement).tagName
        ? (ev.target as HTMLElement).tagName.toLowerCase()
        : '';
      if (tag === 'select' || tag === 'input' || tag === 'textarea') return;

      if (ev.key === ' ') {
        ev.preventDefault();
        if (activeDeck.length > 0) setIsFlipped((prev) => !prev);
      } else if (ev.key === 'ArrowRight') {
        onNext();
      } else if (ev.key === 'ArrowLeft') {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDeck.length, onNext, onPrev]);

  const cardStatus = currentCard ? fcStatus[currentCard.id] : undefined;
  const statusLabel =
    cardStatus === 'mastered'
      ? 'Mastered ✓'
      : cardStatus === 'review'
      ? 'Needs Review'
      : 'Unreviewed';

  return (
    <section
      className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-2xl p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36_/_0.06)]"
      aria-labelledby="fc-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
        <h2
          id="fc-heading"
          className="font-headline text-xl sm:text-2xl font-semibold text-[var(--on-surface)]"
        >
          Active-Recall Flashcards
        </h2>
        <span className="font-label text-xs font-medium text-[var(--primary)] tabular-nums">
          {masteredCount} / {totalDeckSize} mastered
        </span>
      </div>

      <p className="text-[var(--on-surface-variant)] max-w-[68ch] mb-5">
        Case names are hidden on the front of every card so you test your recall before flipping. Covers every Akkusativ and Dativ preposition, article form, pronoun, and contraction.
      </p>

      {/* Filter & Shuffle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter flashcard deck"
        >
          {DECK_FILTERS.map((f) => {
            const active = fcFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFilterChange(f.id)}
                className={`min-h-[44px] px-4 py-2 rounded-[10px] border text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]'
                    : 'bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-[var(--on-surface)] border-[var(--outline-variant)]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onShuffle}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-sm font-semibold text-[var(--on-surface)] cursor-pointer transition-colors whitespace-nowrap"
        >
          <Shuffle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Shuffle Deck</span>
        </button>
      </div>

      {/* 3D Flashcard Stage */}
      <div className="perspective-1200 mb-6">
        <button
          type="button"
          onClick={() => activeDeck.length > 0 && setIsFlipped((prev) => !prev)}
          aria-label={
            currentCard
              ? isFlipped
                ? 'Flip flashcard back to prompt'
                : 'Flip flashcard to reveal answer'
              : 'Empty flashcard deck'
          }
          className={`w-full min-h-[310px] sm:min-h-[290px] p-0 border-0 bg-transparent cursor-pointer text-left relative transform-style-3d transition-transform duration-[380ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Face (Zero case hints!) */}
          <div className="absolute inset-0 backface-hidden rounded-2xl p-5 sm:p-8 flex flex-col justify-between border border-[var(--outline-variant)] bg-[var(--surface-container-low)] text-[var(--on-surface)] shadow-[0_4px_18px_rgb(30_45_36_/_0.06)]">
            <div className="flex items-center justify-between gap-2 font-label text-xs text-[var(--on-surface-variant)]">
              <span className="font-semibold text-[var(--primary)]">
                {currentCard ? currentCard.frontTag : 'Empty'}
              </span>
              <span className="tabular-nums">
                {currentCard ? `Card ${fcIndex + 1} of ${activeDeck.length}` : '0 cards'}
              </span>
            </div>

            <div className="text-center py-3">
              {currentCard ? (
                <>
                  <p className="font-headline text-[1.75rem] sm:text-[2.35rem] font-semibold leading-tight mb-2">
                    {currentCard.term}
                  </p>
                  <p className="text-[var(--on-surface-variant)] max-w-[52ch] mx-auto">
                    {currentCard.prompt}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-headline text-2xl font-semibold mb-2">
                    No cards marked for review
                  </p>
                  <p className="text-[var(--on-surface-variant)] max-w-[52ch] mx-auto">
                    Select &ldquo;All Cards&rdquo; above or mark challenging cards as &ldquo;Mark for Review&rdquo;.
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-between font-label text-xs text-[var(--on-surface-variant)]">
              <span>Click card or press Space to flip</span>
              <span>{currentCard ? statusLabel : ''}</span>
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-5 sm:p-8 flex flex-col justify-between border border-[var(--outline-variant)] bg-[var(--primary-container)] text-[var(--on-primary-container)] shadow-[0_4px_18px_rgb(30_45_36_/_0.06)]">
            <div className="flex items-center justify-between gap-2 font-label text-xs">
              <span className="font-semibold">{currentCard ? currentCard.backCase : ''}</span>
              <span className="tabular-nums">
                {currentCard ? `Card ${fcIndex + 1} of ${activeDeck.length}` : '0 cards'}
              </span>
            </div>

            <div className="text-center py-3">
              {currentCard && (
                <>
                  <p className="font-headline text-[1.6rem] sm:text-[2.15rem] font-semibold leading-tight mb-2">
                    {currentCard.answer}
                  </p>
                  <p className="max-w-[54ch] mx-auto">{currentCard.detail}</p>
                  <div className="mt-4 px-4 py-2 bg-[var(--surface-container-low)] text-[var(--on-surface)] rounded-[10px] inline-block text-[0.95rem]">
                    {currentCard.example}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between font-label text-xs">
              <span>Click card to flip back</span>
              <span>{currentCard ? statusLabel : ''}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={activeDeck.length === 0}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container)] hover:enabled:bg-[var(--surface-container-high)] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={activeDeck.length === 0}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container)] hover:enabled:bg-[var(--surface-container-high)] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!currentCard}
            onClick={() => currentCard && onMark(currentCard.id, 'review')}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container)] hover:enabled:bg-[var(--surface-container-high)] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            <Bookmark className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Mark for Review</span>
          </button>
          <button
            type="button"
            disabled={!currentCard}
            onClick={() => currentCard && onMark(currentCard.id, 'mastered')}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2 rounded-[10px] border border-[var(--primary)] bg-[var(--primary)] hover:enabled:bg-[var(--primary-hover)] text-[var(--on-primary)] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Got It</span>
          </button>
        </div>
      </div>
    </section>
  );
}
