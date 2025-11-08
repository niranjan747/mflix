# Quickstart: Search Autocomplete Manual Validation

**Feature**: 002-search-autocomplete  
**Date**: 2025-11-08  
**Prerequisites**: Feature `001-landing-page` fully implemented and validated

## Purpose

This document provides step-by-step instructions for manually validating the autocomplete enhancement on `localhost:5173`. Per the Zero Testing Policy (constitution Principle III), there are no automated tests—validation occurs exclusively through manual browser interaction.

---

## Setup Instructions

### 1. Prerequisites Check

Before starting validation, ensure the base feature (001-landing-page) is working:

```powershell
# From repository root
cd "c:\Users\niran\Coding Ninjas\Learning React\mflix"

# Verify branch
git status  # Should show: On branch 002-search-autocomplete

# Verify dependencies installed
npm list react vite tailwindcss typescript
# Should show: react@18.x, vite@5.x, tailwindcss@3.x, typescript@5.x

# Verify .env file exists with API key
cat .env  # Should contain: VITE_OMDB_API_KEY=3a5d28b8
```

### 2. Start Development Server

```powershell
npm run dev
```

**Expected Output**:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### 3. Open Browser

Navigate to `http://localhost:5173/` in a modern browser (Chrome, Firefox, Safari, Edge).

**Initial State Validation**:
- [ ] Page loads in <2 seconds (base feature SC-001)
- [ ] Search bar visible and empty
- [ ] No dropdown visible initially
- [ ] Theme toggle icon visible in navbar
- [ ] No console errors (open DevTools → Console tab)

---

## Manual Validation Checklist

### Category 1: Autocomplete Suggestions (16 tests)

#### Test 1.1: Basic Suggestion Display
**Steps**:
1. Click in search input
2. Type "matrix"
3. Wait 300ms (count "one-Mississippi, two-Mississippi, three-Mississippi")

**Expected**:
- [ ] Dropdown appears below search bar
- [ ] Shows 5 movie suggestions (or fewer if API returns <5)
- [ ] Each suggestion formatted as "Title (Year)" (e.g., "The Matrix (1999)")
- [ ] No poster images in dropdown (text-only per clarification)
- [ ] Suggestions appear within 2 seconds of stopping typing (SC-002)

**Fail Criteria**: Dropdown doesn't appear, wrong format, posters shown, >2s delay

---

#### Test 1.2: Minimum Query Length
**Steps**:
1. Clear search input
2. Type single character "m"
3. Wait 1 second

**Expected**:
- [ ] No dropdown appears
- [ ] No API call made (check DevTools → Network tab for omdbapi.com requests)

**Fail Criteria**: Dropdown appears with <2 chars, API call made

---

#### Test 1.3: Debounce Behavior
**Steps**:
1. Clear search input
2. Type "interstellar" rapidly (aim for <1 second to type all 12 chars)
3. Observe Network tab in DevTools

**Expected**:
- [ ] Only 1 API request made to OMDb (300ms after last keystroke)
- [ ] No intermediate requests for partial queries ("int", "inte", "inters", etc.)

**Fail Criteria**: Multiple API calls during typing, no debouncing

---

#### Test 1.4: Empty Results Message
**Steps**:
1. Clear search input
2. Type "xyzabc123" (nonsense query)
3. Wait 1 second

**Expected**:
- [ ] Dropdown appears
- [ ] Shows message: "No movies found—try broader terms!"
- [ ] No console errors

**Fail Criteria**: No dropdown, different error message, console errors

---

#### Test 1.5: Special Characters Handling
**Steps**:
1. Clear search input
2. Type "Amélie" (with accent)
3. Wait 1 second

**Expected**:
- [ ] Dropdown appears with suggestions for "Amélie" movie
- [ ] URL in Network tab shows encoded query: `s=Am%C3%A9lie`
- [ ] No JavaScript errors in console

**Fail Criteria**: No results, encoding error, console errors

---

#### Test 1.6: Duplicate Titles Disambiguation
**Steps**:
1. Clear search input
2. Type "the thing"
3. Wait 1 second

**Expected**:
- [ ] Dropdown shows multiple entries if available (e.g., "The Thing (1982)", "The Thing (2011)")
- [ ] Each entry distinguished by year in parentheses
- [ ] All entries clickable independently

**Fail Criteria**: Only one version shown, years missing, ambiguous entries

---

#### Test 1.7: Suggestion Limit (Max 5)
**Steps**:
1. Clear search input
2. Type "star" (generic query likely to return 10+ results)
3. Count dropdown items

**Expected**:
- [ ] Exactly 5 suggestions displayed (even if API returns 10)
- [ ] No "Load More" or pagination controls

**Fail Criteria**: More than 5 suggestions shown

---

#### Test 1.8: Escape Key Closes Dropdown
**Steps**:
1. Type "matrix" to show suggestions
2. Press `Escape` key

**Expected**:
- [ ] Dropdown immediately closes
- [ ] Search input remains focused
- [ ] Input text unchanged ("matrix" still visible)

**Fail Criteria**: Dropdown stays open, input loses focus, text cleared

---

#### Test 1.9: Click Outside Closes Dropdown
**Steps**:
1. Type "matrix" to show suggestions
2. Click anywhere outside search bar/dropdown (e.g., on page background)

**Expected**:
- [ ] Dropdown immediately closes
- [ ] Input text unchanged

**Fail Criteria**: Dropdown stays open

---

#### Test 1.10: Search Button Hides Dropdown
**Steps**:
1. Type "matrix" to show suggestions
2. Click the search button (magnifying glass icon)

**Expected**:
- [ ] Dropdown closes immediately
- [ ] Full search executes with "matrix" query (existing base feature behavior)
- [ ] MovieCard displays for "The Matrix" (if found)

**Fail Criteria**: Dropdown stays open, no search executed

---

#### Test 1.11: Loading Indicator During Fetch
**Steps**:
1. Clear search input
2. Type "inception"
3. Observe dropdown immediately after typing stops (before results appear)

**Expected**:
- [ ] Dropdown shows subtle loading indicator (e.g., spinner or "Searching..." text)
- [ ] Indicator disappears when suggestions load

**Note**: FR-013 specifies this as SHOULD, not MUST. If not implemented, mark N/A.

**Fail Criteria**: No indicator shown (if implemented), or indicator persists after load

---

#### Test 1.12: Network Error Handling
**Steps**:
1. Open DevTools → Network tab
2. Enable "Offline" mode (throttling dropdown)
3. Type "matrix"
4. Wait 1 second

**Expected**:
- [ ] Dropdown shows error message: "Search hiccup—retry soon"
- [ ] Console logs network error (development mode only)
- [ ] No JavaScript exceptions thrown

**Fail Criteria**: Page crash, no error message, unhandled exception

**Cleanup**: Disable offline mode

---

#### Test 1.13: Timeout Handling (3 Second Limit)
**Steps**:
1. Open DevTools → Network tab
2. Enable "Slow 3G" throttling
3. Type "matrix"
4. Wait up to 4 seconds

**Expected**:
- [ ] If API responds within 3s: Suggestions display normally
- [ ] If API exceeds 3s: Error message "Search hiccup—retry soon" appears
- [ ] Console logs timeout error

**Note**: OMDb API usually responds <1s, so timeout hard to trigger naturally. May need to mock delay.

**Fail Criteria**: No timeout handling, infinite loading, page hangs

**Cleanup**: Disable throttling

---

#### Test 1.14: API Rate Limit Handling
**Steps**:
This test is difficult to perform manually (requires 1000+ requests). Instead, validate code logic:

1. Open `src/utils/api.ts` in editor
2. Verify error handling includes check for `Error: "Request limit reached!"`
3. Verify console logs "Rate limit exceeded" message

**Expected**:
- [ ] Code includes rate limit error detection
- [ ] Displays "Search hiccup—retry soon" to user
- [ ] Logs "Rate limit exceeded" to console

**Fail Criteria**: No rate limit handling in code

---

#### Test 1.15: Clearing Search Clears Dropdown
**Steps**:
1. Type "matrix" to show suggestions
2. Select all text (Ctrl+A or Cmd+A)
3. Type new query "inception"

**Expected**:
- [ ] Old "matrix" suggestions immediately cleared
- [ ] Dropdown shows loading state (or closes briefly)
- [ ] New "inception" suggestions appear after 300ms debounce

**Fail Criteria**: Old suggestions persist, dropdown doesn't update

---

#### Test 1.16: Typing <2 Chars Clears Dropdown
**Steps**:
1. Type "matrix" to show suggestions
2. Delete text until only "m" remains

**Expected**:
- [ ] Dropdown closes when text becomes <2 characters
- [ ] No API call made (check Network tab)

**Fail Criteria**: Dropdown stays open, API call made with 1 char

---

### Category 2: Keyboard Navigation (8 tests)

#### Test 2.1: Down Arrow Highlights First Suggestion
**Steps**:
1. Type "matrix" to show suggestions
2. Press `Down Arrow` key once

**Expected**:
- [ ] First suggestion visually highlighted (background color change, border, etc.)
- [ ] Input text unchanged
- [ ] ARIA attribute `aria-activedescendant` points to first suggestion ID (check DevTools)

**Fail Criteria**: No highlight, wrong item highlighted, no ARIA update

---

#### Test 2.2: Down Arrow Cycles Through Suggestions
**Steps**:
1. Type "matrix" to show 5 suggestions
2. Press `Down Arrow` key 5 times

**Expected**:
- [ ] Highlight moves down through items: 1st → 2nd → 3rd → 4th → 5th
- [ ] After 5th item, pressing Down again cycles to 1st (circular navigation)

**Fail Criteria**: Highlight stops at last item, doesn't cycle

---

#### Test 2.3: Up Arrow Moves Highlight Upward
**Steps**:
1. Type "matrix" to show suggestions
2. Press `Down Arrow` 3 times (to highlight 3rd item)
3. Press `Up Arrow` once

**Expected**:
- [ ] Highlight moves to 2nd item
- [ ] ARIA attribute updates correctly

**Fail Criteria**: Highlight doesn't move, wrong direction

---

#### Test 2.4: Up Arrow from First Item Cycles to Last
**Steps**:
1. Type "matrix" to show 5 suggestions
2. Press `Down Arrow` once (highlight 1st item)
3. Press `Up Arrow` once

**Expected**:
- [ ] Highlight moves to 5th (last) item (circular navigation)

**Fail Criteria**: Highlight stays on 1st item, doesn't cycle

---

#### Test 2.5: Enter Key Selects Highlighted Suggestion
**Steps**:
1. Type "matrix" to show suggestions
2. Press `Down Arrow` twice (highlight 2nd item, e.g., "The Matrix Reloaded (2003)")
3. Press `Enter` key

**Expected**:
- [ ] Dropdown closes immediately
- [ ] MovieCard loads with details for "The Matrix Reloaded"
- [ ] Detail fetch API call made (check Network tab: `?i=tt0234215` or `?t=The Matrix Reloaded`)

**Fail Criteria**: Wrong movie loaded, dropdown stays open, no API call

---

#### Test 2.6: Enter Key Without Highlight Does Nothing
**Steps**:
1. Type "matrix" to show suggestions
2. Do NOT press any arrow keys (no item highlighted)
3. Press `Enter` key

**Expected**:
- [ ] Dropdown closes
- [ ] Existing search button behavior executes (full search for "matrix" text)
- [ ] No suggestion-specific logic triggered

**Fail Criteria**: First suggestion auto-selected, unexpected behavior

---

#### Test 2.7: Escape Key Clears Highlight
**Steps**:
1. Type "matrix" to show suggestions
2. Press `Down Arrow` to highlight 2nd item
3. Press `Escape` key

**Expected**:
- [ ] Dropdown closes
- [ ] Highlight cleared (no selection persists if dropdown re-opened)

**Fail Criteria**: Dropdown stays open, highlight persists

---

#### Test 2.8: Mouse Hover Updates Keyboard Highlight
**Steps**:
1. Type "matrix" to show suggestions
2. Press `Down Arrow` to highlight 1st item
3. Move mouse over 3rd item (do not click)

**Expected**:
- [ ] 3rd item becomes highlighted (keyboard highlight follows mouse)
- [ ] Pressing `Enter` now selects 3rd item (not 1st)

**Fail Criteria**: Keyboard and mouse highlights out of sync

---

### Category 3: Selection & Detail Fetch (6 tests)

#### Test 3.1: Click Suggestion Loads Details
**Steps**:
1. Type "inception"
2. Click on first suggestion "Inception (2010)"

**Expected**:
- [ ] Dropdown closes immediately
- [ ] MovieCard appears below search bar
- [ ] Card shows full details: poster, title, year, plot, rating, runtime, genre
- [ ] Detail fetch completes within 1 second (SC-003)

**Fail Criteria**: Dropdown stays open, card doesn't load, >1s delay

---

#### Test 3.2: Detail Fetch API Uses imdbID
**Steps**:
1. Type "matrix"
2. Click "The Matrix (1999)"
3. Check Network tab for detail fetch request

**Expected**:
- [ ] Request URL includes `?i=tt0133093` (imdbID parameter) OR `?t=The Matrix`
- [ ] Response returns full Movie object with Plot, imdbRating, Runtime, Genre fields

**Fail Criteria**: Wrong parameter used, incomplete response

---

#### Test 3.3: Detail Fetch Error Handling
**Steps**:
1. Open DevTools → Network tab
2. Enable "Offline" mode
3. Type "matrix" and click a suggestion

**Expected**:
- [ ] Dropdown closes
- [ ] Error message appears: "Search hiccup—retry soon"
- [ ] Console logs detail fetch error
- [ ] No MovieCard displayed

**Fail Criteria**: Page crash, no error message, unhandled exception

**Cleanup**: Disable offline mode

---

#### Test 3.4: Search Input Clears Movie Card
**Steps**:
1. Type "inception" and select suggestion to load MovieCard
2. Click in search input
3. Type new query "matrix"

**Expected**:
- [ ] Previous MovieCard (Inception) immediately disappears
- [ ] Autocomplete dropdown appears with "matrix" suggestions
- [ ] Page ready for new selection

**Fail Criteria**: Old card persists, dropdown blocked

---

#### Test 3.5: Multiple Selections Update Card
**Steps**:
1. Type "matrix" and select "The Matrix (1999)" → MovieCard loads
2. Type "inception" and select "Inception (2010)" → MovieCard updates

**Expected**:
- [ ] MovieCard smoothly transitions from Matrix to Inception
- [ ] No duplicate cards displayed
- [ ] Each detail fetch makes separate API call (check Network tab)

**Fail Criteria**: Multiple cards stack, card doesn't update

---

#### Test 3.6: Poster Image Fallback
**Steps**:
1. Type query likely to return movie with no poster (e.g., "obscure indie film")
2. Select suggestion with `Poster: "N/A"` (check Network response)

**Expected**:
- [ ] MovieCard displays film reel icon placeholder (same as base feature)
- [ ] No broken image icon
- [ ] Card layout remains intact

**Fail Criteria**: Broken image, layout breaks, no fallback

---

### Category 4: Responsive Design (4 tests)

#### Test 4.1: Mobile Width (320px) - Dropdown Full Width
**Steps**:
1. Open DevTools → Responsive Design Mode
2. Set viewport to 320px × 568px (iPhone SE)
3. Type "matrix" to show suggestions

**Expected**:
- [ ] Dropdown spans full width of screen (no horizontal overflow)
- [ ] Suggestions readable (font size ≥14px)
- [ ] Touch targets ≥44px height (SC-006)

**Fail Criteria**: Dropdown overflows, text too small, targets <44px

---

#### Test 4.2: Tablet Width (768px) - Touch Targets
**Steps**:
1. Set viewport to 768px × 1024px (iPad)
2. Type "matrix" to show suggestions
3. Measure suggestion item height (DevTools Inspector)

**Expected**:
- [ ] Each suggestion item height ≥44px
- [ ] Items easily tappable with finger (visually confirmed)
- [ ] Dropdown width appropriate (not full screen, but not too narrow)

**Fail Criteria**: Items <44px, hard to tap, poor spacing

---

#### Test 4.3: Desktop Width (1920px) - Constrained Width
**Steps**:
1. Set viewport to 1920px × 1080px
2. Type "matrix" to show suggestions

**Expected**:
- [ ] Dropdown width matches search bar width (not full screen)
- [ ] Suggestions centered with search bar
- [ ] No excessive whitespace within dropdown

**Fail Criteria**: Dropdown too wide, misaligned with search bar

---

#### Test 4.4: Dark Mode Styling
**Steps**:
1. Click theme toggle in navbar to enable dark mode
2. Type "matrix" to show suggestions

**Expected**:
- [ ] Dropdown background: dark color (e.g., gray-800)
- [ ] Suggestion text: light color (e.g., white/gray-100)
- [ ] Highlight color: darker shade with good contrast
- [ ] Matches navbar and search bar dark theme (FR-026)

**Fail Criteria**: Light background in dark mode, poor contrast, inconsistent styling

---

### Category 5: Performance (3 tests)

#### Test 5.1: Suggestion Display Time
**Steps**:
1. Open DevTools → Network tab
2. Type "matrix" and start timer (use phone stopwatch or DevTools Performance tab)
3. Stop timer when suggestions appear

**Expected**:
- [ ] Suggestions visible within 2 seconds of typing stops (SC-002)
- [ ] Includes 300ms debounce + API call time

**Fail Criteria**: >2 seconds delay

---

#### Test 5.2: Detail Fetch Time
**Steps**:
1. Type "matrix" to show suggestions
2. Start timer when clicking suggestion
3. Stop timer when MovieCard fully renders

**Expected**:
- [ ] MovieCard visible within 1 second of click (SC-003)

**Fail Criteria**: >1 second delay

---

#### Test 5.3: Bundle Size Increase
**Steps**:
1. Build production bundle: `npm run build`
2. Check build output for `index.js` size
3. Compare with base feature build (001-landing-page baseline: 202.63KB)

**Expected**:
- [ ] Feature 002 build increases by <50KB (SC-008)
- [ ] Total bundle still <1MB (constitution Principle V)

**Example Output**:
```
dist/index.html                   0.46 kB
dist/assets/index-[hash].css     13.37 kB
dist/assets/index-[hash].js     225.00 kB  ← Should be ~202KB + <50KB = <252KB
```

**Fail Criteria**: >50KB increase, total >1MB

---

### Category 6: Accessibility (4 tests)

#### Test 6.1: ARIA Attributes on Dropdown
**Steps**:
1. Type "matrix" to show suggestions
2. Open DevTools → Elements tab
3. Inspect dropdown container element

**Expected**:
- [ ] Dropdown has `role="listbox"`
- [ ] Input has `aria-autocomplete="list"`
- [ ] Input has `aria-expanded="true"` when dropdown open
- [ ] Input has `aria-controls="[dropdown-id]"` pointing to dropdown

**Fail Criteria**: Missing ARIA attributes, incorrect values

---

#### Test 6.2: ARIA Attributes on Suggestions
**Steps**:
1. Type "matrix" to show suggestions
2. Inspect individual suggestion elements

**Expected**:
- [ ] Each suggestion has `role="option"`
- [ ] Highlighted suggestion has `aria-selected="true"`
- [ ] Each suggestion has unique `id` attribute

**Fail Criteria**: Missing roles, no `aria-selected` updates

---

#### Test 6.3: Keyboard-Only Navigation (No Mouse)
**Steps**:
1. Reload page and do NOT touch mouse/trackpad
2. Press `Tab` key to focus search input
3. Type "matrix" using keyboard
4. Use arrow keys to navigate suggestions
5. Press `Enter` to select

**Expected**:
- [ ] All interactions work without mouse
- [ ] Visual focus indicators clear at each step
- [ ] MovieCard loads from keyboard selection

**Fail Criteria**: Requires mouse for any step, poor focus indicators

---

#### Test 6.4: Color Contrast (WCAG 2.1 AA)
**Steps**:
1. Open DevTools → Accessibility Inspector (Chrome) or use WAVE extension
2. Type "matrix" to show suggestions
3. Check contrast ratios

**Expected**:
- [ ] Suggestion text vs. background: ≥4.5:1 ratio
- [ ] Highlighted suggestion text vs. background: ≥4.5:1 ratio
- [ ] Dark mode contrast also ≥4.5:1

**Tools**: Chrome DevTools "Show Contrast Info" or WAVE browser extension

**Fail Criteria**: Contrast <4.5:1, text hard to read

---

## Validation Summary

**Total Tests**: 41

**Test Distribution**:
- Category 1 (Autocomplete Suggestions): 16 tests
- Category 2 (Keyboard Navigation): 8 tests
- Category 3 (Selection & Detail Fetch): 6 tests
- Category 4 (Responsive Design): 4 tests
- Category 5 (Performance): 3 tests
- Category 6 (Accessibility): 4 tests

**Pass Criteria**: All tests must pass (100% completion) before feature considered complete.

**Fail Criteria**: Any failing test requires code fixes and re-validation.

---

## Troubleshooting

### Common Issues

**Issue**: Dropdown doesn't appear when typing  
**Fix**: Check browser console for errors, verify API key in `.env`, ensure `searchMovieBroad()` function implemented

**Issue**: Suggestions appear instantly without debounce  
**Fix**: Verify `useEffect` cleanup function clears `setTimeout`, check 300ms delay value

**Issue**: Keyboard navigation doesn't work  
**Fix**: Verify `onKeyDown` handler attached to input, check `focusedIndex` state updates

**Issue**: Dark mode dropdown has light background  
**Fix**: Verify `dark:` prefix on Tailwind classes, check `<html class="dark">` applied

**Issue**: Mobile dropdown overflows screen  
**Fix**: Check Tailwind responsive classes (`sm:`, `md:`), verify `max-w-full` or `w-full` on mobile

---

## Validation Sign-Off

**Validator Name**: ___________________________  
**Date**: ___________________________  
**Environment**: Browser: ___________ Version: ___________  
**Tests Passed**: _____ / 41  
**Tests Failed**: _____ / 41  
**Notes**: _____________________________________________________

**Feature Status**: ☐ **PASS** (all 41 tests) | ☐ **FAIL** (requires fixes)

---

## Next Steps

**After Validation Passes**:
1. Commit changes with message: `feat: implement search autocomplete enhancement`
2. Push branch: `git push origin 002-search-autocomplete`
3. Merge to main (or submit PR per team workflow)
4. Update constitution if new patterns established
5. Archive validation results in `.specify/memory/validations/002-search-autocomplete.md` (optional)

**After Validation Fails**:
1. Document failing tests in issue tracker or notes
2. Fix code issues
3. Re-run only failed tests (or full suite for confidence)
4. Repeat until all tests pass
