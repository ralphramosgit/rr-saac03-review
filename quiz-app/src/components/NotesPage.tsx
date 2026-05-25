import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Mermaid from "./Mermaid";
import { STUDY_MODULES, extractToc, type SourceKind } from "../study-notes";

type Props = { onBack: () => void };

const weightColor: Record<string, string> = {
  Critical: "bg-red-500/20 text-red-200 border-red-400/30",
  High: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  Medium: "bg-sky-500/20 text-sky-200 border-sky-400/30",
  Low: "bg-slate-500/20 text-slate-200 border-slate-400/30",
};

const originColor: Record<string, string> = {
  Workspace: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  "SAA-C03": "bg-sky-500/15 text-sky-200 border-sky-400/30",
  Yash: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/30",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export default function NotesPage({ onBack }: Props) {
  const [moduleId, setModuleId] = useState<string>(STUDY_MODULES[0].id);
  const [kind, setKind] = useState<SourceKind>(
    STUDY_MODULES[0].sources[0].kind,
  );
  const [query, setQuery] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const activeModule = useMemo(
    () => STUDY_MODULES.find((m) => m.id === moduleId)!,
    [moduleId],
  );
  const activeSource = useMemo(
    () =>
      activeModule.sources.find((s) => s.kind === kind) ??
      activeModule.sources[0],
    [activeModule, kind],
  );
  const toc = useMemo(
    () => extractToc(activeSource.content),
    [activeSource.content],
  );

  useEffect(() => {
    if (!activeModule.sources.find((s) => s.kind === kind)) {
      setKind(activeModule.sources[0].kind);
    }
    contentRef.current?.scrollTo({ top: 0 });
  }, [moduleId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredModules = useMemo(() => {
    if (!query.trim()) return STUDY_MODULES;
    const q = query.toLowerCase();
    return STUDY_MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.keyServices.some((s) => s.toLowerCase().includes(q)) ||
        m.sources.some((s) => s.content.toLowerCase().includes(q)),
    );
  }, [query]);

  function scrollToHeading(id: string) {
    const el = contentRef.current?.querySelector<HTMLElement>(
      `[data-anchor="${id}"]`,
    );
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-brand-500 font-semibold">
              Study Notes
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              SAA-C03 Consolidated Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Merged from 3 sources:
              <span className="text-emerald-300"> workspace notes</span> ·
              <span className="text-sky-300"> SAA-C03 repo</span> ·
              <span className="text-fuchsia-300"> Yash course notes</span>.
            </p>
          </div>
          <button className="btn-ghost text-sm" onClick={onBack}>
            ← Back
          </button>
        </div>
        <input
          type="text"
          placeholder="Search modules, services, or note text…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-3 w-full rounded-xl bg-ink-900/60 border border-white/10 px-3 py-2 text-sm outline-none focus:border-brand-500/60"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        <aside className="card p-2 lg:max-h-[78vh] lg:overflow-y-auto">
          <ul className="space-y-1">
            {filteredModules.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => setModuleId(m.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition flex items-start gap-2 ${
                    moduleId === m.id
                      ? "bg-brand-500/15 ring-1 ring-brand-500/40"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-base leading-6 shrink-0">
                    {m.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-snug truncate">
                      {m.title}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      #{m.number} · {m.sources.length} sources
                    </span>
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
        </aside>

        <main className="space-y-4 min-w-0">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="tabular-nums">#{activeModule.number}</span>
                  <span
                    className={`text-[10px] border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${weightColor[activeModule.weight]}`}
                  >
                    {activeModule.weight}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mt-1 flex items-center gap-2">
                  <span>{activeModule.emoji}</span>
                  {activeModule.title}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {activeModule.blurb}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {activeModule.keyServices.map((s) => (
                <span
                  key={s}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-2">
            <div className="flex flex-wrap gap-1">
              {activeModule.sources.map((s) => (
                <button
                  key={s.kind}
                  onClick={() => setKind(s.kind)}
                  className={`group flex flex-col items-start text-left px-3 py-2 rounded-lg transition border ${
                    kind === s.kind
                      ? "bg-brand-500 text-ink-900 border-brand-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{s.label}</span>
                    <span
                      className={`text-[9px] uppercase tracking-wider border rounded px-1 py-px ${
                        kind === s.kind
                          ? "bg-ink-900/20 border-ink-900/40 text-ink-900"
                          : originColor[s.origin]
                      }`}
                    >
                      {s.origin}
                    </span>
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      kind === s.kind ? "text-ink-900/70" : "text-slate-400"
                    }`}
                  >
                    {s.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-4">
            <div
              ref={contentRef}
              className="card p-5 sm:p-7 lg:max-h-[70vh] lg:overflow-y-auto"
            >
              <article className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:scroll-mt-4 prose-pre:bg-ink-900/80 prose-pre:border prose-pre:border-white/5 prose-code:text-brand-500 prose-a:text-brand-500 prose-table:text-sm prose-th:bg-white/5 prose-hr:border-white/10">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: ({ children, ...props }) => {
                      // Detect fenced ```mermaid blocks and replace with diagram
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const child: any = Array.isArray(children)
                        ? children[0]
                        : children;
                      const className: string =
                        child?.props?.className || "";
                      if (/language-mermaid/.test(className)) {
                        const code = String(child.props.children ?? "").replace(
                          /\n$/,
                          "",
                        );
                        return <Mermaid chart={code} />;
                      }
                      return <pre {...props}>{children}</pre>;
                    },
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      return (
                        <h2 data-anchor={slugify(text)} {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      return (
                        <h3 data-anchor={slugify(text)} {...props}>
                          {children}
                        </h3>
                      );
                    },
                  }}
                >
                  {activeSource.content}
                </ReactMarkdown>
              </article>
            </div>

            <aside className="hidden xl:block">
              <div className="card p-3 sticky top-3 max-h-[70vh] overflow-y-auto">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 px-2 pb-2">
                  On this page
                </div>
                {toc.length === 0 ? (
                  <div className="text-xs text-slate-500 px-2">
                    No headings.
                  </div>
                ) : (
                  <ul className="space-y-0.5">
                    {toc.map((h, i) => (
                      <li key={i}>
                        <button
                          onClick={() => scrollToHeading(h.id)}
                          className={`w-full text-left text-xs px-2 py-1 rounded hover:bg-white/5 text-slate-300 ${
                            h.level === 3 ? "pl-5 text-slate-400" : ""
                          }`}
                        >
                          {h.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
