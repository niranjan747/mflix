import type { InfoContent } from '../../../types/movie';

interface InfoPanelProps {
  content: InfoContent;
}

export function InfoPanel({ content }: InfoPanelProps) {
  const infoRows: Array<[string, string]> = [
    ['Release date', content.releaseDate ?? 'Not available'],
    ['Runtime', content.runtime ?? 'Not available'],
    ['Languages', formatList(content.languages)],
    ['Awards', content.awards ?? 'Not available'],
  ];

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-white/70 p-6 text-slate-900 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 motion-safe:transition-all motion-safe:duration-hero motion-safe:ease-hero">
      <div className="grid gap-4 sm:grid-cols-2">
        {infoRows.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200/50 p-4 dark:border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">{label}</p>
            <p className="mt-2 text-base font-semibold text-slate-800 dark:text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Cast</p>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700 dark:text-slate-200">
          {content.castPreview.length > 0 ? (
            content.castPreview.map((actor) => (
              <li key={actor} className="rounded-full bg-slate-100/80 px-3 py-1 dark:bg-white/10">
                {actor}
              </li>
            ))
          ) : (
            <li className="text-slate-400 dark:text-slate-500">Cast information unavailable</li>
          )}
        </ul>
      </div>
    </section>
  );
}

function formatList(items: string[]): string {
  return items.length ? items.join(', ') : 'Not available';
}
