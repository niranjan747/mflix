import type {
  DetailTabId,
  DetailTabSection,
  HeroSummary,
  InfoContent,
  MovieDetail,
  OverviewContent,
  PosterPanelState,
  RatingsPanelContent,
} from '../../types/movie';
import { HeroBanner } from './HeroBanner';
import { PosterSidebar } from './PosterSidebar';
import { DetailTabs } from './DetailTabs';
import { OverviewPanel } from './panels/OverviewPanel';
import { InfoPanel } from './panels/InfoPanel';
import { RatingsPanel } from './panels/RatingsPanel';

interface DetailPanelProps {
  movie: MovieDetail;
  heroSummary: HeroSummary;
  posterPanel: PosterPanelState;
  tabs: DetailTabSection[];
  activeTabId: DetailTabId;
  onTabChange: (tabId: DetailTabId) => void;
}

export function DetailPanel({
  movie,
  heroSummary,
  posterPanel,
  tabs,
  activeTabId,
  onTabChange,
}: DetailPanelProps) {
  const overviewContent = extractOverviewContent(tabs);
  const activeTab = resolveActiveTab(tabs, activeTabId);

  return (
    <section className="space-y-8">
      <div className="detail-grid gap-6 lg:grid lg:grid-cols-[minmax(0,1.3fr)_360px] lg:gap-10">
        <div className="space-y-8">
          <HeroBanner summary={heroSummary} highlightBullets={overviewContent?.highlightBullets} />

          {tabs.length > 0 && (
            <div className="space-y-4 rounded-[28px] bg-white/60 p-4 shadow-sm backdrop-blur dark:bg-slate-900/50">
              <DetailTabs tabs={tabs} activeTabId={activeTab.id} onChange={onTabChange} />
              <span aria-live="polite" className="sr-only">
                {`Active tab: ${activeTab.label}`}
              </span>
              <div
                id={`panel-${activeTab.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab.id}`}
                className="motion-safe:transition-opacity motion-safe:duration-hero motion-safe:ease-hero"
              >
                {renderPanel(activeTab, overviewContent)}
              </div>
            </div>
          )}
        </div>

        <PosterSidebar
          title={movie.Title}
          imdbID={movie.imdbID}
          website={movie.Website ?? undefined}
          posterPanel={posterPanel}
        />
      </div>
    </section>
  );
}

function extractOverviewContent(tabs: DetailTabSection[]): OverviewContent | undefined {
  const overviewTab = tabs.find(isOverviewTab);
  return overviewTab?.content;
}

function resolveActiveTab(tabs: DetailTabSection[], activeTabId: DetailTabId): DetailTabSection {
  if (!tabs.length) {
    return {
      id: 'overview',
      label: 'Overview',
      content: { expandedPlot: 'Details unavailable.', highlightBullets: [] },
      priority: 0,
    } satisfies DetailTabSection<OverviewContent>;
  }

  return tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
}

function renderPanel(tab: DetailTabSection, overviewContent?: OverviewContent) {
  switch (tab.id) {
    case 'overview':
      return <OverviewPanel content={(tab as DetailTabSection<OverviewContent>).content} />;
    case 'info':
      return <InfoPanel content={(tab as DetailTabSection<InfoContent>).content} />;
    case 'ratings':
      return <RatingsPanel content={(tab as DetailTabSection<RatingsPanelContent>).content} />;
    default:
      return overviewContent ? <OverviewPanel content={overviewContent} /> : null;
  }
}

function isOverviewTab(tab: DetailTabSection): tab is DetailTabSection<OverviewContent> {
  return tab.id === 'overview';
}
