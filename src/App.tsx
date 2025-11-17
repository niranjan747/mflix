// Movie Flix Landing Page - Main Application Component
// User Story 1: Search and View Movie Details
// User Story 2: Theme Personalization

import { useMovieSearch } from './hooks/useMovieSearch';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { DetailPanel } from './components/detail/DetailPanel';
import { DetailSkeleton } from './components/detail/DetailSkeleton';

function App() {
  const {
    detailState,
    loading,
    searchMovie,
    searchMovieDetail,
    clearDetail,
    tabs,
    activeTabId,
    setActiveTab,
  } = useMovieSearch();

  const handleQueryLifecycle = (value: string) => {
    if (value.length === 0) {
      clearDetail();
      return;
    }

    if (detailState.status !== 'idle') {
      clearDetail();
    }
  };
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar with Theme Toggle */}
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Container */}
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 detail-page">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Search and discover movies instantly
          </p>
        </header>

        {/* Search Bar with Autocomplete */}
        <SearchBar 
          onSearch={searchMovie} 
          onSelectSuggestion={(suggestion) => searchMovieDetail(suggestion.imdbID, suggestion)}
          onQueryChange={handleQueryLifecycle}
          disabled={loading} 
        />

        {/* Detail States */}
        <span className="sr-only" aria-live="polite">
          {detailState.status === 'loading' && 'Loading movie details'}
          {detailState.status === 'error' && detailState.errorMessage && `Error: ${detailState.errorMessage}`}
        </span>

        {detailState.status === 'loading' && (
          <div className="mt-8">
            <DetailSkeleton />
          </div>
        )}

        {detailState.status === 'error' && detailState.errorMessage && (
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
              <p className="text-red-800 dark:text-red-200 font-medium">
                {detailState.errorMessage}
              </p>
            </div>
          </div>
        )}

        {detailState.status === 'ready'
          && detailState.movie
          && detailState.heroSummary
          && detailState.posterPanel
          && (
          <div className="mt-8">
            <DetailPanel
              movie={detailState.movie}
              heroSummary={detailState.heroSummary}
              posterPanel={detailState.posterPanel}
              tabs={tabs}
              activeTabId={activeTabId}
              onTabChange={setActiveTab}
            />
          </div>
        )}

        {/* Empty State - No search yet */}
        {detailState.status === 'idle' && !loading && (
          <div className="mt-16 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Search for a movie to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
