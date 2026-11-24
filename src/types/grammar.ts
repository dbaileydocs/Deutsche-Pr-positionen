export type Gender = 'm' | 'f' | 'n' | 'p';

export type CaseName = 'Akkusativ' | 'Dativ';

export type CaseGroup = 'akk' | 'dat' | 'wech';

export type FrameCategory = 'akk' | 'dat' | 'wech_akk' | 'wech_dat';

export type QuizCategoryFilter = 'all' | 'akk' | 'dat' | 'wech' | 'mistakes';

export type QuizOrder = 'shuffled' | 'sequential';

export type WorkspaceMode = 'quiz' | 'flashcards';

export type FlashcardType = 'prep' | 'art' | 'contr';

export type FlashcardFilter = 'all' | 'prep' | 'art' | 'contr' | 'review';

export type FlashcardStatus = 'mastered' | 'review';

export type ArticleOption = 'der' | 'die' | 'das' | 'den' | 'dem' | 'des';

export interface NounEntry {
  de: string;
  en: string;
  g: Gender;
  datPl?: string;
}

export interface SemanticFrame {
  cat: FrameCategory;
  prep: string;
  why: string;
  subjs: Array<[string, string]>;
  midDe: string;
  midEn: string;
  endDe: string;
  nouns: string[];
}

export interface QuizQuestion {
  id: number;
  cat: CaseGroup;
  subCat: FrameCategory;
  caseName: CaseName;
  prep: string;
  beforeBlank: string;
  afterBlank: string;
  en: string;
  answer: ArticleOption;
  nounDe: string;
  genderLabel: string;
  explanation: string;
}

export interface FlashcardItem {
  id: string;
  type: FlashcardType;
  frontTag: string;
  term: string;
  prompt: string;
  backCase: string;
  answer: string;
  detail: string;
  example: string;
}

export interface AppState {
  mode: WorkspaceMode;
  category: QuizCategoryFilter;
  prep: string;
  order: QuizOrder;
  currentIdx: number;
  answeredIds: Record<number, 'ok' | 'err'>;
  correctCount: number;
  totalAnswered: number;
  streak: number;
  wrongIds: number[];
  shuffleSalt: number;
  fcFilter: FlashcardFilter;
  fcIndex: number;
  fcStatus: Record<string, FlashcardStatus>;
  fcShuffleSalt: number;
}
