import type { OverviewContent } from '../../../types/movie';

interface OverviewPanelProps {
  content: OverviewContent;
}

export function OverviewPanel({ content }: OverviewPanelProps) {
  return (
    <section
      className="space-y-6 rounded-3xl border border-white/10 bg-white/70 p-6 text-slate-900 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 motion-safe:transition-all motion-safe:duration-hero motion-safe:ease-hero"
    >
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Plot</h3>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {content.expandedPlot}
        </p>
      </div>

      {content.highlightBullets.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Highlights</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {content.highlightBullets.map((bullet) => (
              <li
                key={bullet}
                className="rounded-full border border-slate-900/10 px-4 py-2 text-sm font-semibold text-slate-800 dark:border-white/20 dark:text-white"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
