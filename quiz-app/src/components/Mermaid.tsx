import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

let initialized = false;
function initMermaid() {
  if (initialized) return;
  initialized = true;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    themeVariables: {
      background: "#0f172a",
      primaryColor: "#1e293b",
      primaryTextColor: "#e2e8f0",
      primaryBorderColor: "#FF9900",
      lineColor: "#94a3b8",
      secondaryColor: "#334155",
      tertiaryColor: "#0b1220",
    },
  });
}

export default function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    initMermaid();
    let cancelled = false;
    mermaid
      .render(`m-${id}`, chart)
      .then(({ svg }) => {
        if (!cancelled) {
          setSvg(svg);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(String(err?.message || err));
      });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs">
        <div className="font-semibold text-red-300 mb-1">
          Diagram failed to render
        </div>
        <pre className="whitespace-pre-wrap text-red-200/80 text-[11px]">
          {error}
        </pre>
        <details className="mt-2">
          <summary className="cursor-pointer text-red-200/70">
            Show source
          </summary>
          <pre className="mt-1 overflow-auto text-[11px] text-slate-300">
            {chart}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-4 overflow-auto rounded-xl border border-white/5 bg-ink-900/40 p-3 flex justify-center [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
