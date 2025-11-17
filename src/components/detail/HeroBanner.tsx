import type { HeroSummary } from '../../types/movie';

interface HeroBannerProps {
  summary: HeroSummary;
  highlightBullets?: string[];
}

const METRIC_LABELS: Array<keyof HeroSummary> = ['primaryRating', 'runtime', 'releaseYear'];

export function HeroBanner({ summary, highlightBullets }: HeroBannerProps) {
  const metrics = METRIC_LABELS.map((key) => summary[key]).filter(Boolean) as string[];
  const hasBackdrop = Boolean(summary.backdropUrl);
  const overlayStyle = hasBackdrop
    ? undefined
    : { background: `radial-gradient(circle at top, ${summary.backdropFallbackColor} 0%, #020617 70%)` };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-hero-base text-white shadow-2xl motion-safe:transition-all motion-safe:duration-hero-long motion-safe:ease-hero"
      aria-label="Movie hero banner"
    >
      {hasBackdrop && (
        <img
          src={summary.backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div
        className="hero-overlay relative flex min-h-[360px] flex-col justify-end gap-6 px-6 py-10 sm:min-h-[420px] sm:px-10"
        style={overlayStyle}
      >
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-hero-accent/80">Featured film</p>
          <div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              {summary.title}
            </h1>
            <p className="text-base text-slate-200/80">
              {summary.genres?.length ? summary.genres.join(' • ') : 'Genre unknown'}
            </p>
          </div>
        </div>

        {metrics.length > 0 && (
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-100/90">
            {metrics.map((metric) => (
              <span
                key={metric}
                className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-hero-accent backdrop-blur"
              >
                {metric}
              </span>
            ))}
          </div>
        )}

        {highlightBullets && highlightBullets.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-sm text-slate-100/90" aria-label="Highlight facts">
            {highlightBullets.map((bullet) => (
              <li
                key={bullet}
                className="rounded-full border border-hero-accent/40 px-3 py-1 text-xs uppercase tracking-wide text-hero-accent"
              >
                {bullet}
              </li>
            ))}
          </ul>
        )}

        <p className="fade-clamp text-base leading-relaxed text-slate-100/90">
          {summary.plotSnippet}
        </p>
      </div>
    </section>
  );
}
