// Auto-load all markdown notes bundled under src/notes/** as raw strings.
const raw = import.meta.glob("./notes/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type NoteFile = {
  /** File name like "README.md" */
  name: string;
  /** Friendly label for the file */
  label: string;
  content: string;
};

export type NoteModule = {
  /** Folder name, e.g. "04-Storage" */
  id: string;
  /** Display title, e.g. "Storage" */
  title: string;
  /** Numeric prefix for ordering */
  number: string;
  files: NoteFile[];
};

const FILE_ORDER = [
  "README.md",
  "ULTRA-FAST-LEARN.md",
  "FAST-LEARN.md",
  "DIAGRAMS.md",
  "PRACTICE-QUESTIONS.md",
];

const FILE_LABELS: Record<string, string> = {
  "README.md": "Overview",
  "ULTRA-FAST-LEARN.md": "Ultra Fast Learn",
  "FAST-LEARN.md": "Fast Learn",
  "DIAGRAMS.md": "Diagrams",
  "PRACTICE-QUESTIONS.md": "Practice Questions",
  "FLASHCARDS.md": "Flashcards",
  "STUDY-NOTES.md": "Study Notes",
  "SERVICE-QUESTION-MAPPING.md": "Service Mapping",
};

function titleFromFolder(folder: string): { number: string; title: string } {
  const m = folder.match(/^(\d+)-(.+)$/);
  if (!m) return { number: "", title: folder };
  const title = m[2].replace(/-/g, " ");
  return { number: m[1], title };
}

const map = new Map<string, NoteModule>();
for (const [path, content] of Object.entries(raw)) {
  // path like "./notes/04-Storage/README.md"
  const parts = path.replace(/^\.\/notes\//, "").split("/");
  if (parts.length < 2) continue;
  const folder = parts[0];
  const file = parts[1];
  if (!map.has(folder)) {
    const { number, title } = titleFromFolder(folder);
    map.set(folder, { id: folder, title, number, files: [] });
  }
  map.get(folder)!.files.push({
    name: file,
    label: FILE_LABELS[file] ?? file.replace(/\.md$/i, ""),
    content,
  });
}

export const NOTE_MODULES: NoteModule[] = Array.from(map.values())
  .map((m) => ({
    ...m,
    files: m.files.sort((a, b) => {
      const ai = FILE_ORDER.indexOf(a.name);
      const bi = FILE_ORDER.indexOf(b.name);
      const aa = ai === -1 ? 999 : ai;
      const bb = bi === -1 ? 999 : bi;
      if (aa !== bb) return aa - bb;
      return a.name.localeCompare(b.name);
    }),
  }))
  .sort((a, b) => a.id.localeCompare(b.id));
