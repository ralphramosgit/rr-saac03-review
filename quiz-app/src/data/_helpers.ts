import type { Question } from "../types";

// Helpers to keep authoring concise
export const mcq = (
  id: string,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
): Question => ({ id, type: "mcq", prompt, options, answer, explanation });

export const tf = (
  id: string,
  prompt: string,
  answer: boolean,
  explanation: string,
): Question => ({
  id,
  type: "tf",
  prompt,
  answer,
  explanation,
});

export const match = (
  id: string,
  prompt: string,
  pairs: { left: string; right: string }[],
  explanation?: string,
): Question => ({ id, type: "match", prompt, pairs, explanation });

export const flash = (id: string, front: string, back: string): Question => ({
  id,
  type: "flash",
  front,
  back,
});
