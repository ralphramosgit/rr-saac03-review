// Shuffle returning a NEW array (Fisher-Yates).
export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Stable storage of wrong answer IDs per topic (for retention "review" mode)
const KEY = "saac03_wrong_v1";

type WrongMap = Record<string, string[]>;

export function getWrong(): WrongMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function addWrong(topicId: string, questionId: string) {
  const m = getWrong();
  const set = new Set(m[topicId] || []);
  set.add(questionId);
  m[topicId] = Array.from(set);
  localStorage.setItem(KEY, JSON.stringify(m));
}

export function clearWrong(topicId?: string) {
  if (!topicId) {
    localStorage.removeItem(KEY);
    return;
  }
  const m = getWrong();
  delete m[topicId];
  localStorage.setItem(KEY, JSON.stringify(m));
}

export function removeWrong(topicId: string, questionId: string) {
  const m = getWrong();
  m[topicId] = (m[topicId] || []).filter((id) => id !== questionId);
  localStorage.setItem(KEY, JSON.stringify(m));
}
