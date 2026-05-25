export type MCQ = {
  id: string;
  type: "mcq";
  prompt: string;
  options: string[];
  answer: number; // index
  explanation: string;
};

export type TrueFalse = {
  id: string;
  type: "tf";
  prompt: string;
  answer: boolean;
  explanation: string;
};

export type Matching = {
  id: string;
  type: "match";
  prompt: string;
  pairs: { left: string; right: string }[]; // correct pairing
  explanation?: string;
};

export type Flashcard = {
  id: string;
  type: "flash";
  front: string;
  back: string;
};

export type Question = MCQ | TrueFalse | Matching | Flashcard;

// Each TableSection represents ONE table from the notes — drillable separately.
export type TableSection = {
  id: string; // unique within topic
  title: string;
  questions: Question[];
};

export type Topic = {
  id: string;
  number: string;
  title: string;
  weight:
    | "Foundation"
    | "High"
    | "Medium"
    | "Low"
    | "Critical"
    | "Important"
    | "Useful";
  blurb: string;
  sections: TableSection[];
  // When true, SessionRunner plays questions in their authored order (no shuffle).
  noShuffle?: boolean;
};

export type Mode = "mixed" | "mcq" | "match" | "flash" | "review";

// Helper: flatten all section questions for a topic.
export function allQuestions(topic: Topic): Question[] {
  return topic.sections.flatMap((s) => s.questions);
}
