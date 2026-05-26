import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Mermaid from "./Mermaid";
import {
  DOMAINS,
  extractDomainToc,
  type DomainVariantKind,
} from "../domain-notes";

type Props = { onBack: () => void };

const domainAccent: Record<string, string> = {
  secure: "from-red-500/20 to-transparent ring-red-400/30",
  resilient: "from-emerald-500/20 to-transparent ring-emerald-400/30",
  performance: "from-amber-500/20 to-transparent ring-amber-400/30",
  cost: "from-sky-500/20 to-transparent ring-sky-400/30",
};

const variantColor: Record<DomainVariantKind, string> = {
  "in-depth": "bg-indigo-500/15 text-indigo-200 border-indigo-400/30",
  concise: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  exam: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  compare: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/30",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export default function DomainNotesPage({ onBack }: Props) {
  const [domainId, setDomainId] = useState<string>(DOMAINS[0].id);
  const [variantKind, setVariantKind] = useState<DomainVariantKind>("in-depth");
  const [query, setQuery] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const activeDomain = useMemo(
    () => DOMAINS.find((d) => d.id === domainId)!,
    [domainId],
  );
  const activeVariant = useMemo(
    () =>
      activeDomain.variants.find((v) => v.kind === variantKind) ??
      activeDomain.variants[0],
    [activeDomain, variantKind],
  );
  const toc = useMemo(
    () => extractDomainToc(activeVariant.content),
    [activeVariant.content],
  );

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [domainId, variantKind]);

  const filtered = useMemo(() => {
    if (!query.trim()) return DOMAINS;
    const q = query.toLowerCase();
    return DOMAINS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.keyServices.some((s) => s.toLowerCase().includes(q)) ||
        d.variants.some((v) => v.content.toLowerCase().includes(q)),
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
              Domain Notes
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              SAA-C03 Domain Cheat-Sheets
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              4 exam domains · 4 variants each (
              <span className="text-indigo-300">In-Depth</span> ·{" "}
              <span className="text-emerald-300">Concise</span> ·{" "}
              <span className="text-amber-300">Exam Prep</span> ·{" "}
              <span className="text-fuchsia-300">Comparisons & Scenarios</span>
              ). Consolidated from all module notes.
            </p>
          </div>
          <button className="btn-ghost text-sm" onClick={onBack}>
            ← Back
          </button>
        </div>
        <input
          type="text"
          placeholder="Search domains, services, or note text…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-3 w-full rounded-xl bg-ink-900/60 border border-white/10 px-3 py-2 text-sm outline-none focus:border-brand-500/60"
        />
      </div>

      {/* Domain picker (always visible, big cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {filtered.map((d) => {
          const active = domainId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setDomainId(d.id)}
              className={`card p-4 text-left active:scale-[0.99] transition bg-gradient-to-br ${
                domainAccent[d.id]
              } ${
                active ? "ring-2" : "ring-1 ring-white/5 hover:ring-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-2xl">{d.emoji}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-300 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                  {d.weightPct}% exam
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                Domain {d.number}
              </div>
              <div className="font-semibold leading-snug mt-0.5">{d.title}</div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-3">
                {d.blurb}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-4">
        <main className="space-y-4 min-w-0">
          {/* Active domain header */}
          <div className="card p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="text-xs text-slate-400">
                  Domain {activeDomain.number} · {activeDomain.weightPct}% of
                  exam
                </div>
                <h2 className="text-2xl font-bold mt-1 flex items-center gap-2">
                  <span>{activeDomain.emoji}</span>
                  {activeDomain.title}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {activeDomain.blurb}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {activeDomain.keyServices.map((s) => (
                <span
                  key={s}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Variant tabs */}
          <div className="card p-2">
            <div className="flex flex-wrap gap-1">
              {activeDomain.variants.map((v) => (
                <button
                  key={v.kind}
                  onClick={() => setVariantKind(v.kind)}
                  className={`group flex flex-col items-start text-left px-3 py-2 rounded-lg transition border ${
                    variantKind === v.kind
                      ? "bg-brand-500 text-ink-900 border-brand-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{v.label}</span>
                    <span
                      className={`text-[9px] uppercase tracking-wider border rounded px-1 py-px ${
                        variantKind === v.kind
                          ? "bg-ink-900/20 border-ink-900/40 text-ink-900"
                          : variantColor[v.kind]
                      }`}
                    >
                      {v.kind === "in-depth"
                        ? "DEEP"
                        : v.kind === "concise"
                          ? "FAST"
                          : v.kind === "exam"
                            ? "EXAM"
                            : "VS"}
                    </span>
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      variantKind === v.kind
                        ? "text-ink-900/70"
                        : "text-slate-400"
                    }`}
                  >
                    {v.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="card p-5 sm:p-7 lg:max-h-[70vh] lg:overflow-y-auto"
          >
            <article className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:scroll-mt-4 prose-pre:bg-ink-900/80 prose-pre:border prose-pre:border-white/5 prose-code:text-brand-500 prose-a:text-brand-500 prose-table:text-sm prose-th:bg-white/5 prose-hr:border-white/10">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ children, ...props }) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const child: any = Array.isArray(children)
                      ? children[0]
                      : children;
                    const className: string = child?.props?.className || "";
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
                {activeVariant.content}
              </ReactMarkdown>
            </article>
          </div>
        </main>

        <aside className="hidden xl:block">
          <div className="card p-3 sticky top-3 max-h-[78vh] overflow-y-auto">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 px-2 pb-2">
              On this page
            </div>
            {toc.length === 0 ? (
              <div className="text-xs text-slate-500 px-2">No headings.</div>
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
    </div>
  );
}
