# API Contract: OMDb Broad Search

**Feature**: 002-search-autocomplete  
**Date**: 2025-11-08  
**Base Contract**: Extends `001-landing-page/contracts/omdb-api.md` (detail fetch `t` parameter)

## Overview

This contract documents the OMDb API broad search endpoint (`s` parameter) used to fetch movie suggestions for autocomplete. The detail fetch endpoint (`t` parameter) from the base feature continues to work unchanged for fetching full movie data after suggestion selection.

---

## Endpoint: Broad Search

### Request

**Method**: `GET`  
**Base URL**: `http://www.omdbapi.com/`  
**Authentication**: API key in query parameter

**Query Parameters**:

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| `apikey` | `string` | Yes | Must match `.env` value | OMDb API key (value: `3a5d28b8` per constitution) |
| `s` | `string` | Yes | URL-encoded, min 2 chars | Search query (movie title or partial title) |
| `type` | `string` | Yes | Must equal `"movie"` | Filter results to movies only (exclude TV series/episodes per FR-005) |
| `page` | `number` | No | Integer ≥1 | Pagination (default: 1). **Not used** - spec displays first 5 from page 1 only |

**Example Request**:
```
GET http://www.omdbapi.com/?apikey=3a5d28b8&s=inception&type=movie
```

**Client-Side Implementation**:
```typescript
const API_KEY = import.meta.env.VITE_OMDB_API_KEY; // from .env file
const query = encodeURIComponent(searchQuery);
const url = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&type=movie`;

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

const response = await fetch(url, { signal: controller.signal });
clearTimeout(timeoutId);
```

---

### Response: Success (HTTP 200)

**Condition**: Valid query with matching results

**Content-Type**: `application/json`

**Body Structure**:
```json
{
  "Search": [
    {
      "Title": "Inception",
      "Year": "2010",
      "imdbID": "tt1375666",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/..."
    },
    {
      "Title": "Inception: The Cobol Job",
      "Year": "2010",
      "imdbID": "tt1790736",
      "Type": "movie",
      "Poster": "N/A"
    }
    // ... up to 10 results per page
  ],
  "totalResults": "148",
  "Response": "True"
}
```

**Field Descriptions**:

| Field | Type | Always Present? | Notes |
|-------|------|-----------------|-------|
| `Search` | `array` | When `Response: "True"` | Array of 0-10 movie objects. Empty array if no matches |
| `Search[].Title` | `string` | Yes (per item) | Movie title |
| `Search[].Year` | `string` | Yes (per item) | Release year (4 digits) |
| `Search[].imdbID` | `string` | Yes (per item) | Unique IMDb identifier (format: `tt` + 7-8 digits) |
| `Search[].Type` | `string` | Yes (per item) | Always `"movie"` due to `type=movie` query param |
| `Search[].Poster` | `string` | Yes (per item) | Image URL or `"N/A"` if unavailable. **Not used** in dropdown (text-only) |
| `totalResults` | `string` | When `Response: "True"` | Total matches across all pages (numeric string) |
| `Response` | `string` | Always | `"True"` for success |

**Client-Side Handling**:
```typescript
if (data.Response === "True") {
  const suggestions = data.Search?.slice(0, 5) || []; // Limit to 5 per FR-006
  setSuggestions(suggestions);
  
  if (suggestions.length === 0) {
    setError("No movies found—try broader terms!"); // FR-012
  }
}
```

---

### Response: No Results (HTTP 200)

**Condition**: Valid query but no matching movies

**Content-Type**: `application/json`

**Body Structure**:
```json
{
  "Search": [],
  "totalResults": "0",
  "Response": "True"
}
```

**Client-Side Handling**: Same as success case—check `Search.length === 0` and display "No movies found—try broader terms!" message.

---

### Response: Error (HTTP 200)

**Condition**: Invalid query, rate limit exceeded, or API issue

**Content-Type**: `application/json`

**Body Structure**:
```json
{
  "Response": "False",
  "Error": "Movie not found!"
}
```

**Common Error Messages**:

| Error Message | Cause | Client Action |
|---------------|-------|---------------|
| `"Movie not found!"` | Query returned zero matches | Display "No movies found—try broader terms!" (FR-012) |
| `"Too many results."` | Query too generic (rarely happens for `type=movie`) | Display "Search hiccup—retry soon" (FR-019) |
| `"Invalid API key!"` | Wrong or missing `apikey` parameter | Log to console, display "Search hiccup—retry soon" (FR-019, FR-021) |
| `"Request limit reached!"` | Exceeded 1000 requests/day quota | Log "Rate limit exceeded" to console (FR-023), display "Search hiccup—retry soon" |

**Client-Side Handling**:
```typescript
if (data.Response === "False") {
  console.error("[OMDb Broad Search Error]:", data.Error); // FR-021 (dev only)
  setError("Search hiccup—retry soon"); // FR-019
  setSuggestions([]);
}
```

---

### Response: Network Error (no HTTP response)

**Condition**: Timeout (AbortController aborted after 10s), network failure, CORS issue, or DNS resolution failure

**Client-Side Error Types**:
- `AbortError`: Timeout exceeded 10s
- `TypeError`: Network failure (offline, blocked by firewall)
- `SyntaxError`: Invalid JSON response (rare)

**Client-Side Handling**:
```typescript
try {
  const response = await fetch(url, { signal: controller.signal });
  // ... handle response
} catch (error) {
  if (error.name === 'AbortError') {
    console.error("[OMDb Broad Search] Timeout after 10s"); // FR-021
  } else {
    console.error("[OMDb Broad Search] Network error:", error); // FR-021
  }
  
  setError("Search hiccup—retry soon"); // FR-019, FR-020
  setSuggestions([]);
  
  // Optional: Retry after 2s per FR-022 (max 1 retry)
}
```

---

## Rate Limits & Quotas

**Daily Limit**: 1000 requests per API key (as documented by OMDb)

**Mitigation Strategies**:
1. **Debouncing**: 300ms delay reduces calls during fast typing (research Q1)
2. **Minimum Query Length**: Only search when ≥2 characters typed (FR-003)
3. **No Caching**: Constitution prioritizes simplicity over optimization (research Q5)
4. **User Feedback**: Display "Rate limit exceeded" in console if 429 status or "Request limit reached!" error (FR-023)

**Expected Usage**:
- Average user session: 3-5 searches = 3-5 API calls
- 10 sessions/day = 30-50 calls (5% of quota)
- **Well within limits** for single-user localhost development

---

## Security

**API Key Management**:
- Store key in `.env` file: `VITE_OMDB_API_KEY=3a5d28b8`
- Access via Vite environment variable: `import.meta.env.VITE_OMDB_API_KEY`
- **Never hardcode** in source files (per constitution Security section)
- Add `.env` to `.gitignore` (already done in base feature)

**Input Sanitization**:
- URL-encode query parameter via `encodeURIComponent(query)` (handles special chars like "Amélie" per edge case)
- No injection risk (read-only API, no user-generated content stored)

**HTTPS Consideration**:
- OMDb API uses `http://` (not `https://`)
- **Acceptable** for localhost development per constitution scope
- For production deployment, consider proxying requests through backend to avoid mixed content warnings

---

## Performance Characteristics

**Typical Response Times**:
- **Fast queries** (common movies): 200-500ms
- **Slow queries** (rare titles, first-time cache miss): 800-1500ms
- **Timeout threshold**: 10s (AbortController) or 3s user-facing (FR-035, SC-009)

**Response Size**:
- Single suggestion object: ~150 bytes (without poster URL)
- 10 suggestions (max): ~1.5KB JSON
- **Minimal bandwidth impact** for autocomplete use case

**Client-Side Performance**:
- Debounce reduces API calls by ~70% during fast typing (research Q1)
- No client-side caching overhead (research Q5)
- Parsing 10 suggestions: <1ms (negligible)

---

## Integration with Detail Fetch Endpoint

**Two-Phase Data Fetching**:

1. **Phase 1: Broad Search** (this contract)
   - Endpoint: `?s=${query}&type=movie&apikey=${key}`
   - Returns: Array of `SearchSuggestion` objects (Title, Year, imdbID)
   - Purpose: Populate autocomplete dropdown

2. **Phase 2: Detail Fetch** (base feature contract)
   - Endpoint: `?t=${title}&apikey=${key}` **OR** `?i=${imdbID}&apikey=${key}`
   - Returns: Full `Movie` object (Plot, Poster, imdbRating, Runtime, Genre, etc.)
   - Purpose: Display detailed `MovieCard` after suggestion selected

**Workflow**:
```
User types "incept"
    ↓
Broad search: ?s=incept&type=movie
    ↓
Returns: [{ imdbID: "tt1375666", Title: "Inception", Year: "2010" }, ...]
    ↓
User clicks "Inception (2010)"
    ↓
Detail fetch: ?i=tt1375666  (OR ?t=Inception)
    ↓
Returns: { Title: "Inception", Plot: "A thief...", Poster: "...", imdbRating: "8.8", ... }
    ↓
Display full MovieCard
```

**Why Two APIs?**:
- Broad search returns minimal data (no plot/rating) → fast, lightweight autocomplete
- Detail fetch returns complete data → only called once when user selects
- **Trade-off**: 2 API calls per workflow, but optimized UX (fast suggestions + rich details)

---

## Error Handling Summary

| Scenario | HTTP Status | Response Body | Client Action |
|----------|-------------|---------------|---------------|
| Valid query, results found | 200 | `{ Search: [...], Response: "True" }` | Display suggestions (limit to 5) |
| Valid query, no results | 200 | `{ Search: [], Response: "True" }` | Display "No movies found—try broader terms!" |
| Invalid API key | 200 | `{ Response: "False", Error: "Invalid API key!" }` | Log error, show "Search hiccup—retry soon" |
| Rate limit exceeded | 200 | `{ Response: "False", Error: "Request limit reached!" }` | Log "Rate limit exceeded", show "Search hiccup—retry soon" |
| Network timeout (>10s) | N/A | `AbortError` | Log timeout, show "Search hiccup—retry soon" |
| Network failure (offline) | N/A | `TypeError` | Log network error, show "Search hiccup—retry soon" |

**Unified Error Message**: "Search hiccup—retry soon" (per FR-019, user-friendly phrasing)

**Developer Console Logging**: All errors logged in development mode only (FR-021)

---

## Testing & Validation

**Manual Validation Cases** (see `quickstart.md` for full checklist):

1. **Happy Path**: Type "matrix" → Verify dropdown shows 5 suggestions with "Title (Year)" format
2. **No Results**: Type "xyzabc123" → Verify "No movies found—try broader terms!" message
3. **Rate Limit**: (Difficult to test—requires 1000+ requests) → Mock API response with `{ Error: "Request limit reached!" }`
4. **Network Timeout**: Throttle network to simulate slow response → Verify timeout error after 3s user-facing delay
5. **Special Characters**: Type "Amélie" → Verify URL encoding works, results returned
6. **Debouncing**: Type "interstellar" quickly → Verify only 1 API call made (300ms after last keystroke)

**Constitution Compliance**:
- ✅ Zero Testing Policy: No automated tests, manual localhost verification only (Principle III)
- ✅ Error handling: All failure modes logged + user-friendly messages (Principle IV)
- ✅ Performance: <2s suggestions, <3s timeout aligns with FR-027, FR-033, SC-002, SC-009 (Principle V)

---

## Contract Version

**Version**: 1.0.0  
**Last Updated**: 2025-11-08  
**Compatibility**: OMDb API (free tier, 1000 req/day limit)  
**Base Feature**: Extends `001-landing-page/contracts/omdb-api.md` (detail fetch remains unchanged)
