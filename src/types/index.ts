// ─── Automaton Graph ──────────────────────────────────────────────────────────

export interface AutomatonState {
  id: string;
  label: string;
  x: number;
  y: number;
  isInitial: boolean;
  isAccept: boolean;
  isError?: boolean;
}

export interface AutomatonTransition {
  from: string;
  to: string;
  label: string;
}

export interface Automaton {
  states: AutomatonState[];
  transitions: AutomatonTransition[];
}

// ─── Activity Type Discriminators ─────────────────────────────────────────────

export type ActivityType =
  | 'quiz'
  | 'match'
  | 'order'
  | 'identify'
  | 'dragdrop'
  | 'fill-diagram'
  | 'select-elements'
  | 'build-automaton';

// ─── Quiz (multiple choice) ────────────────────────────────────────────────────

export interface QuizActivity {
  type: 'quiz';
  question: string;
  options: string[];
  answer: string;
}

// ─── Match (concept <-> definition pairs) ──────────────────────────────────────

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchActivity {
  type: 'match';
  instruction: string;
  pairs: MatchPair[];
}

// ─── Order (sequence steps) ────────────────────────────────────────────────────

export interface OrderActivity {
  type: 'order';
  instruction: string;
  items: string[];
}

// ─── Identify (click elements in diagram) ──────────────────────────────────────

export interface IdentifyActivity {
  type: 'identify';
  instruction: string;
  correctIds: string[];
  maxSelections?: number;
}

// ─── Drag & Drop (assign labels to transitions) ────────────────────────────────

export interface DragDropActivity {
  type: 'dragdrop';
  instruction: string;
  blanks: { from: string; to: string; correctLabel: string }[];
  labelPool: string[];
}

// ─── Fill Diagram (mark initial / accept states) ───────────────────────────────

export interface FillDiagramActivity {
  type: 'fill-diagram';
  instruction: string;
  correctInitial: string[];
  correctAccept: string[];
}

// ─── Select Elements (tap the correct path / subset) ───────────────────────────

export interface SelectElementsActivity {
  type: 'select-elements';
  instruction: string;
  correctIds: string[];
}

// ─── Build Automaton (construction, 3 sub-stages) ──────────────────────────────

export type BuildStage = 'mark-states' | 'add-transitions' | 'full-build';

export interface BuildAutomatonActivity {
  type: 'build-automaton';
  instruction: string;
  stage: BuildStage;
  languageDescription: string;
  starter: Automaton;
  labelPool?: string[];
  maxTransitions?: number;
  availableStates?: number;
  testAccept?: string[];
  testReject?: string[];
}

export type Activity =
  | QuizActivity
  | MatchActivity
  | OrderActivity
  | IdentifyActivity
  | DragDropActivity
  | FillDiagramActivity
  | SelectElementsActivity
  | BuildAutomatonActivity;

// ─── Level ───────────────────────────────────────────────────────────────────

export interface Level {
  id: number;
  world: number;
  name: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  concept: string;
  story: string;
  pedagogy: string;
  hint: string;
  states: AutomatonState[];
  transitions: AutomatonTransition[];
  sequence?: string[];
  activity: Activity;
}

// ─── World ───────────────────────────────────────────────────────────────────

export interface World {
  id: number;
  name: string;
  subtitle: string;
  emoji: string;
  color: string;
  glow: string;
  accent: string;
  mechanicLabel: string;
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface LevelProgress {
  completed: boolean;
  stars: number;
  score: number;
  noHint: boolean;
}

export type ProgressMap = Record<number, LevelProgress>;

// ─── Achievement ─────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  req: (p: ProgressMap) => boolean;
}

// ─── Flashcards ─────────────────────────────────────────────────────────────────

export interface Flashcard {
  id: string;
  world: number;
  term: string;
  definition: string;
  example?: string;
}

export interface FlashcardProgress {
  mastered: boolean;
  timesSeen: number;
  timesCorrect: number;
}

export type FlashcardProgressMap = Record<string, FlashcardProgress>;

// ─── Screens ─────────────────────────────────────────────────────────────────

export type Screen =
  | 'menu'
  | 'splash'
  | 'worlds'
  | 'levels'
  | 'game'
  | 'achievements'
  | 'gdd'
  | 'flashcards'
  | 'training';
