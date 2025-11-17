import { useMemo, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { DetailTabId, DetailTabSection } from '../../types/movie';

interface DetailTabsProps {
  tabs: DetailTabSection[];
  activeTabId: DetailTabId;
  onChange: (tabId: DetailTabId) => void;
}

export function DetailTabs({ tabs, activeTabId, onChange }: DetailTabsProps) {
  const tabRefs = useRef<Map<DetailTabId, HTMLButtonElement>>(new Map());

  const sortedTabs = useMemo(
    () => [...tabs].sort((a, b) => a.priority - b.priority),
    [tabs],
  );

  const focusTab = (tabId: DetailTabId) => {
    const button = tabRefs.current.get(tabId);
    button?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, tabId: DetailTabId) => {
    const currentIndex = sortedTabs.findIndex((tab) => tab.id === tabId);
    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % sortedTabs.length;
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + sortedTabs.length) % sortedTabs.length;
        event.preventDefault();
        break;
      case 'Home':
        nextIndex = 0;
        event.preventDefault();
        break;
      case 'End':
        nextIndex = sortedTabs.length - 1;
        event.preventDefault();
        break;
      default:
        return;
    }

    const nextTabId = sortedTabs[nextIndex].id;
    focusTab(nextTabId);
    onChange(nextTabId);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        role="tablist"
        aria-label="Movie detail sections"
        className="inline-flex flex-wrap gap-2 rounded-full border border-slate-200/60 bg-white/80 p-2 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
      >
        {sortedTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                if (element) {
                  tabRefs.current.set(tab.id, element);
                } else {
                  tabRefs.current.delete(tab.id);
                }
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900/70 dark:focus-visible:ring-white/80 motion-safe:duration-hero motion-safe:ease-hero ${
                isActive
                  ? 'bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, tab.id)}
            >
              {tab.icon && (
                <span aria-hidden="true" className="text-base">
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
