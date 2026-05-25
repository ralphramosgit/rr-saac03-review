import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NOTE_MODULES } from "../notes-loader";

type Props = { onBack: () => void };

export default function NotesPage({ onBack }: Props) {
  const [moduleId, setModuleId] = useState<string>(
    NOTE_MODULES[0]?.id ?? "",
  );
  const [fileName, setFileName] = useState<string>(
    NOTE_MODULES[0]?.files[0]?.name ?? "",
  );
  const [query, setQuery] = useState("");

  const activeModule = useMemo(
    () => NOTE_MODULES.find((m) => m.id === moduleId),
    [moduleId],
  );
  const activeFile = useMemo(
    () => activeModule?.files.find((f) => f.name === fileName),
    [activeModule, fileName],
  );

  const filteredModules = useMemo(() => {
    if (!query.trim()) return NOTE_MODULES;
    const q = query.toLowerCase();
    return NOTE_MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.files.some((f) => f.content.toLowerCase().includes(q)),
    );
  }, [query]);

  function pickModule(id: string) {
    setModuleId(id);
    const mod = NOTE_MODULES.find((m) => m.id === id);
    setFileName(mod?.files[0]?.name ?? "");
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-brand-500 font-semibold">
              Study Notes
            </div>
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              AWS SAA-C03 — All Module Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              READMEs, Ultra-Fast-Learn, Fast-Learn, Diagrams & Practice
              Questions for every module.
            </p>
          </div>
          <button className="btn-ghost text-sm" onClick={onBack}>
            ← Back
          </button>
        </div>
        <input
          type="text"
          placeholder="Search modules or note contents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-3 w-full rounded-xl bg-ink-900/60 border border-white/10 px-3 py-2 text-sm outline-none focus:border-brand-500/60"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        {/* Module sidebar */}
        <div className="card p-2 max-h-[70vh] overflow-y-auto">
          <ul className="space-y-1">
            {filteredModules.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => pickModule(m.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
                    moduleId === m.id
                      ? "bg-brand-500/15 text-white ring-1 ring-brand-500/40"
                      : "hover:bg-white/5 text-slate-300"
                  }`}
                >
                  <span className="text-xs text-slate-500 tabular-nums w-6 shrink-0">
                    {m.number}
                  </span>
                  <span className="text-sm capitalize truncate">
                    {m.title}
                  </span>
                </button>
              </li>
            ))}
            {filteredModules.length === 0 && (
              <li className="text-xs text-slate-500 px-3 py-2">
                No modules match.
              </li>
            )}
          </ul>
        </div>

        {/* Content */}
        <div className="card p-4 sm:p-6 min-w-0">
          {activeModule && (
            <>
              <div className="flex flex-wrap gap-2 mb-4 border-b border-white/5 pb-3">
                {activeModule.files.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setFileName(f.name)}
                    className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border transition ${
                      fileName === f.name
                        ? "bg-brand-500 text-ink-900 border-brand-500 font-semibold"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {activeFile ? (
                <article className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:scroll-mt-20 prose-pre:bg-ink-900/80 prose-pre:border prose-pre:border-white/5 prose-code:text-brand-500 prose-a:text-brand-500 prose-table:text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeFile.content}
                  </ReactMarkdown>
                </article>
              ) : (
                <p className="text-sm text-slate-400">
                  No file selected.
                </p>
              )}
            </>
          )}
          {!activeModule && (
            <p className="text-sm text-slate-400">No module selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
