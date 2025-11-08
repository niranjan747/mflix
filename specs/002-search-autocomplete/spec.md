# Feature Specification: Search Autocomplete Enhancement

**Feature Branch**: `002-search-autocomplete`  
**Created**: 2025-11-08  
**Status**: Draft  
**Input**: User description: "Enhancement: Broad Search with Autocomplete for Landing Page (builds on specs/landing-page.md)"

**Base Feature**: Builds upon `001-landing-page` specification

## Clarifications

### Session 2025-11-08

- Q: When should the autocomplete dropdown show suggestions - immediately when the input receives focus (before typing), or only after typing begins? → A: Show dropdown only after user types at least 2 characters and pauses
- Q: What should happen to the dropdown when a user clicks the original "Search" button (from base spec) while suggestions are visible? → A: Hide dropdown and execute full search with current input value (maintain base spec search button behavior)
- Q: Should the dropdown show movie posters alongside titles in the suggestion list, or text-only (Title + Year)? → A: Text-only suggestions (Title + Year format) - posters shown only in detailed card after selection
- Q: Should keyboard navigation (arrow keys to move between suggestions, Enter to select) be supported in the dropdown? → A: Yes, support full keyboard navigation (Up/Down arrows, Enter to select, Escape to close)
- Q: What is the acceptable maximum dropdown response time if the OMDb API is slow (e.g., takes 1.5s to respond)? → A: 3 seconds total

## Overview

This enhancement adds autocomplete functionality to the existing movie search feature. Instead of requiring users to type complete movie titles and submit explicitly, the system will suggest matching movies as users type, allowing them to discover multiple options and select one for detailed viewing. This improves discoverability and reduces friction in the search workflow.

**Key Changes from Base Spec**:
- Search becomes incremental (suggestions appear while typing)
- Broad search API endpoint replaces single-title search during typing
- Dropdown UI component added for displaying search suggestions
- Two-phase data fetching: broad search → detailed movie fetch
- Debounced input to optimize API calls

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Autocomplete Suggestions (Priority: P1)

As a movie enthusiast, I want to see movie suggestions as I type in the search bar so that I can discover multiple matching titles without knowing the exact name.

**Why this priority**: This is the core enhancement value - enabling discovery through suggestions. Without this, the feature doesn't exist.

**Independent Validation**: Can be fully validated by typing "matrix" in the search bar and observing that a dropdown appears with 5+ movie suggestions within 2 seconds. Manual verification on localhost per Zero Testing Policy.

**Acceptance Scenarios**:

1. **Given** I am on the landing page, **When** I type "incept" (5 characters) in the search bar, **Then** a dropdown appears below showing matching movies like "Inception (2010)", "Inception: The Comic Book Movie", etc.
2. **Given** I am typing in the search bar, **When** I pause typing for 300ms, **Then** the system fetches broad search results and displays them in the dropdown
3. **Given** I have typed "mat" (3 characters), **When** the API returns no results, **Then** the dropdown shows "No movies found—try broader terms!"
4. **Given** I have an active dropdown with suggestions, **When** I press the Escape key, **Then** the dropdown closes without selecting anything
5. **Given** I have an active dropdown with suggestions, **When** I click outside the dropdown, **Then** the dropdown closes without selecting anything
6. **Given** I type only 1 character, **When** I pause typing, **Then** no API call is made and no dropdown appears
7. **Given** I have an active dropdown with suggestions, **When** I click the search button, **Then** the dropdown hides and a full search executes with the current input value (base spec behavior)

---

### User Story 2 - Select and View Details (Priority: P2)

As a movie enthusiast, I want to click on a suggested movie from the dropdown so that I can view its full details without typing the complete title.

**Why this priority**: Completes the autocomplete workflow - suggestions are useless without the ability to select them. This is the second critical piece after P1.

**Independent Validation**: Can be validated by typing "matrix", clicking "The Matrix (1999)" from the dropdown, and verifying that the dropdown closes and a detailed movie card appears with full plot, poster, rating, runtime, and genre.

**Acceptance Scenarios**:

1. **Given** the dropdown is showing suggestions, **When** I click on "Inception (2010)", **Then** the dropdown closes and a detailed movie card loads showing full plot (not truncated), high-resolution poster, IMDb rating, runtime, and genre
2. **Given** I clicked a movie suggestion, **When** the detailed fetch API call completes, **Then** the movie card displays within 1 second of my click
3. **Given** I have viewed a movie's details, **When** I start typing a new search query, **Then** the current movie card clears and the dropdown appears with new suggestions
4. **Given** I click a movie suggestion but the API returns an error, **When** the error occurs, **Then** I see "Search hiccup—retry soon" message and the error is logged to console (development only)
5. **Given** the dropdown is showing suggestions, **When** I press the Down arrow key, **Then** the first suggestion is visually highlighted
6. **Given** a suggestion is highlighted via keyboard, **When** I press the Enter key, **Then** the highlighted movie's details are fetched and displayed
7. **Given** a suggestion is highlighted via keyboard, **When** I press the Up arrow key from the first item, **Then** focus cycles to the last suggestion in the list

---

### User Story 3 - Responsive Dropdown UI (Priority: P3)

As a mobile user, I want the autocomplete dropdown to adapt to my screen size so that suggestions are easy to read and tap on any device.

**Why this priority**: Extends usability to mobile devices. The feature works on desktop without this, but mobile experience improves significantly.

**Independent Validation**: Can be validated by opening DevTools responsive mode, setting viewport to 320px width, typing "star wars", and confirming the dropdown spans full width with tappable suggestion items (minimum 44px touch target height).

**Acceptance Scenarios**:

1. **Given** I am on a mobile device (320px width), **When** I type in the search bar and suggestions appear, **Then** the dropdown spans the full width of the screen
2. **Given** I am on a tablet (768px width), **When** suggestions appear, **Then** each suggestion item has a minimum height of 44px for easy tapping
3. **Given** I have dark mode enabled, **When** suggestions appear, **Then** the dropdown uses dark theme colors (dark background, light text) matching the navbar and search bar
4. **Given** I am on a 4K display (2560px width), **When** suggestions appear, **Then** the dropdown remains appropriately sized and doesn't overflow

---

### Edge Cases

- What happens when the user types very quickly (e.g., "interstellar" in 1 second)? The debounce mechanism ensures only one API call fires 300ms after the last keystroke, preventing API spam.
- What happens when the OMDb API rate limit (1000 requests/day) is exceeded? The system logs "Rate limit exceeded" to console and displays "Search hiccup—retry soon" to the user.
- What happens when a movie has no poster image for the detailed view? The system displays a film reel icon placeholder (same as base spec behavior).
- What happens when the broad search API returns movies with identical titles? Each suggestion shows title + year to disambiguate (e.g., "The Thing (1982)" vs "The Thing (2011)").
- What happens when network connection is lost during typing? The fetch fails silently, no dropdown appears, and on next keystroke the system retries.
- What happens when a user selects a movie but the detail fetch returns invalid data? The system shows "Search hiccup—retry soon" and logs the error to console.
- What happens when query contains special characters (e.g., "Amélie")? The system URL-encodes the query automatically via fetch API.
- What happens when a user types fewer than 2 characters? No API call is made, no dropdown appears, conserving API quota.

## Functional Requirements *(mandatory)*

<!--
  IMPORTANT: This section should describe WHAT the system should do, not HOW to implement it.
  Requirements should be technology-agnostic and implementation-agnostic where possible.
  Focus on BEHAVIOR, not implementation details.
  
  Each requirement MUST have:
  - A unique identifier (FR-001, FR-002, etc.)
  - MoSCoW priority (MUST/SHOULD/COULD/WON'T)
  - Clear, testable statement
  
  ACTION REQUIRED: The content below is placeholder examples. Delete them and replace with 
  your actual requirements. Group related requirements under logical subsections.
-->

### Input Debouncing

**[FR-001]**: System MUST delay API calls until user pauses typing for at least 300 milliseconds (Priority: MUST)

**[FR-002]**: System MUST cancel pending API calls if user types again before the debounce timer completes (Priority: MUST)

**[FR-003]**: System MUST NOT make API calls if query length is less than 2 characters (Priority: MUST)

---

### Broad Search API Integration

**[FR-004]**: System MUST call OMDb API with `s` parameter (broad search) to retrieve movie suggestions matching the query (Priority: MUST)

**[FR-005]**: System MUST include `type=movie` parameter to filter results to movies only (no series, episodes) (Priority: MUST)

**[FR-006]**: System MUST limit displayed suggestions to first 5 results from the API response (Priority: MUST)

**[FR-007]**: System SHOULD display suggestions in the order returned by the API (no custom sorting) (Priority: SHOULD)

---

### Dropdown UI Display

**[FR-008]**: System MUST display a dropdown UI below the search bar when suggestions are available (Priority: MUST)

**[FR-009]**: System MUST show each suggestion as "Title (Year)" format for disambiguation (Priority: MUST)

**[FR-010]**: System MUST NOT display dropdown on input focus before user types (Priority: MUST)

**[FR-011]**: System MUST display text-only suggestions without poster images in the dropdown (Priority: MUST)

**[FR-012]**: System MUST hide the dropdown when user clicks outside the search bar or dropdown area (Priority: MUST)

**[FR-013]**: System MUST hide the dropdown when user presses the Escape key (Priority: MUST)

**[FR-014]**: System MUST display "No movies found—try broader terms!" message when broad search returns zero results (Priority: MUST)

**[FR-015]**: System SHOULD display a subtle loading indicator within the dropdown while fetching suggestions (Priority: SHOULD)

**[FR-016]**: System MUST hide dropdown and execute full search (using base spec `t` parameter) when user clicks the search button while dropdown is visible (Priority: MUST)

**[FR-017]**: System MUST support keyboard navigation with Up/Down arrow keys to move between suggestions (Priority: MUST)

**[FR-018]**: System MUST support Enter key to select the currently highlighted suggestion (Priority: MUST)

**[FR-019]**: System MUST visually highlight the currently focused suggestion during keyboard navigation (Priority: MUST)

---

### Movie Selection & Detail Fetch

**[FR-020]**: System MUST fetch full movie details via OMDb API `t` parameter when user clicks a suggestion (Priority: MUST)

**[FR-021]**: System MUST close the dropdown immediately after user clicks a suggestion (Priority: MUST)

**[FR-022]**: System MUST display the detailed movie card below the search bar (replacing any existing card) once details are fetched (Priority: MUST)

**[FR-023]**: System MUST display the same movie card layout as base spec (poster, title, year, plot, rating, runtime, genre) (Priority: MUST)

**[FR-024]**: System MUST clear the current movie card and dropdown when user starts typing a new query (Priority: MUST)

---

### Error Handling

**[FR-025]**: System MUST display "Search hiccup—retry soon" message if broad search API call fails (network error, timeout, 500 status) (Priority: MUST)

**[FR-026]**: System MUST display "Search hiccup—retry soon" message if detail fetch API call fails (Priority: MUST)

**[FR-027]**: System MUST log all API errors to browser console in development mode for debugging (Priority: MUST)

**[FR-028]**: System SHOULD retry failed API calls automatically after 2 seconds (max 1 retry) (Priority: SHOULD)

**[FR-029]**: System MUST handle rate limit errors (429 status) by displaying "Rate limit exceeded" message in console (Priority: MUST)

---

### Responsive Design

**[FR-030]**: System MUST ensure dropdown adapts to screen width (full width on mobile ≤640px, constrained on desktop) (Priority: MUST)

**[FR-031]**: System MUST ensure each suggestion item has minimum 44px height for touch targets on mobile devices (Priority: MUST)

**[FR-032]**: System MUST apply dark mode colors to dropdown when theme is set to dark (matching navbar/search bar styling) (Priority: MUST)

---

### Performance

**[FR-033]**: System MUST display suggestions within 2 seconds of user stopping typing (includes debounce + API call time) (Priority: MUST)

**[FR-034]**: System MUST display detailed movie card within 1 second of user clicking a suggestion (Priority: MUST)

**[FR-035]**: System MUST timeout and display error message if broad search API call exceeds 3 seconds total (includes debounce + network time) (Priority: MUST)

### Key Entities *(include if feature involves data)*

- **SearchSuggestion**: A movie suggestion returned from the broad search API (`s` parameter), containing `title` (string), `year` (string), and `imdbID` (string) for disambiguation and detail fetching
- **MovieDetail**: Full movie information fetched when a user selects a suggestion, containing `Title`, `Year`, `Plot`, `Poster`, `imdbRating`, `Runtime`, `Genre`, `Response`, and `Error` (same structure as base spec)
- **BroadSearchResponse**: API response structure containing `Search` (array of SearchSuggestion objects), `totalResults` (string), `Response` (string), and `Error` (string) for handling broad search results

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can discover movie options in under 5 seconds from starting to type (includes debounce + API response time)
- **SC-002**: Autocomplete suggestions appear within 2 seconds of user pausing typing
- **SC-003**: Detailed movie card loads within 1 second of clicking a suggestion
- **SC-004**: 100% of API errors are caught and displayed with user-friendly messages ("Search hiccup—retry soon")
- **SC-005**: Dropdown adapts to all screen sizes (320px mobile to 2560px desktop) without visual breakage
- **SC-006**: Touch targets on mobile meet accessibility standards (minimum 44px height)
- **SC-007**: Zero TypeScript compilation errors in build output
- **SC-008**: Feature adds less than 50KB to production bundle size (measured via Vite build output)
- **SC-009**: Dropdown timeout occurs at 3 seconds maximum if API is unresponsive
