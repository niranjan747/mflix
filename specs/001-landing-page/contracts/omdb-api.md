# API Contract: OMDb Movie Search

**Feature**: 001-landing-page  
**Date**: 2025-11-08  
**API**: OMDb API (Open Movie Database)

## Overview

This document defines the external API contract between the Movie Flix landing page and the OMDb API. This is a **read-only integration** with a third-party service—no custom API endpoints are created.

**Base URL**: `http://www.omdbapi.com/`  
**Authentication**: API key via query parameter  
**Protocol**: HTTP GET (no authentication headers)

---

## Endpoint: Search Movie by Title

### Request

**Method**: `GET`  
**URL**: `http://www.omdbapi.com/`

**Query Parameters**:

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `apikey` | `string` | Yes | OMDb API key (from `.env`) | `3a5d28b8` |
| `t` | `string` | Yes | Movie title to search (URL-encoded) | `Inception` |

**Example Request**:
```
GET http://www.omdbapi.com/?apikey=3a5d28b8&t=Inception
```

**Request Headers**: None required

**Request Body**: N/A (GET request)

---

### Response (Success)

**Status Code**: `200 OK`  
**Content-Type**: `application/json`

**Response Body**:
```json
{
  "Title": "Inception",
  "Year": "2010",
  "Rated": "PG-13",
  "Released": "16 Jul 2010",
  "Runtime": "148 min",
  "Genre": "Action, Adventure, Sci-Fi",
  "Director": "Christopher Nolan",
  "Writer": "Christopher Nolan",
  "Actors": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
  "Plot": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
  "Language": "English, Japanese, French",
  "Country": "United States, United Kingdom",
  "Awards": "Won 4 Oscars. 157 wins & 220 nominations total",
  "Poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "8.8/10"
    },
    {
      "Source": "Rotten Tomatoes",
      "Value": "87%"
    },
    {
      "Source": "Metacritic",
      "Value": "74/100"
    }
  ],
  "Metascore": "74",
  "imdbRating": "8.8",
  "imdbVotes": "2,408,668",
  "imdbID": "tt1375666",
  "Type": "movie",
  "DVD": "07 Dec 2010",
  "BoxOffice": "$292,587,330",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True"
}
```

**Fields Used by App** (subset):

| Field | Type | Usage | Notes |
|-------|------|-------|-------|
| `Title` | `string` | Display movie title | Always present |
| `Year` | `string` | Display release year | Always present |
| `Plot` | `string` | Display plot snippet (truncated to 300 chars) | Always present |
| `Poster` | `string` | Display poster image | Can be "N/A" if unavailable |
| `imdbRating` | `string` | Display IMDb rating | Can be "N/A" if unavailable |
| `Response` | `string` | Success indicator (`"True"`) | Always present |

**Unused Fields**: All other fields (e.g., `Rated`, `Runtime`, `Genre`, etc.) are ignored per spec scope.

---

### Response (Movie Not Found)

**Status Code**: `200 OK` (OMDb returns 200 even for errors)  
**Content-Type**: `application/json`

**Response Body**:
```json
{
  "Response": "False",
  "Error": "Movie not found!"
}
```

**Error Handling**:
- Check `Response === "False"` to detect error
- Extract `Error` field for specific message
- Display user-friendly message: "Movie not found—try another!"

---

### Response (Invalid API Key)

**Status Code**: `401 Unauthorized`  
**Content-Type**: `application/json`

**Response Body**:
```json
{
  "Response": "False",
  "Error": "Invalid API key!"
}
```

**Error Handling**:
- Log error to console (development only)
- Display user-friendly message: "Search failed—check connection"

---

### Response (Rate Limit Exceeded)

**Status Code**: `429 Too Many Requests`  
**Content-Type**: `application/json`

**Response Body**:
```json
{
  "Response": "False",
  "Error": "Request limit reached!"
}
```

**Error Handling**:
- Log error to console (development only)
- Display user-friendly message: "Search failed—check connection"

---

## Client-Side Error Scenarios

### Network Timeout (>10 seconds)

**Trigger**: `AbortController` cancels request after 10s

**Handling**:
```typescript
if (err.name === 'AbortError') {
  console.error('API timeout after 10s');
  setError("Search failed—check connection");
}
```

---

### Network Failure (Offline)

**Trigger**: `fetch` throws network error

**Handling**:
```typescript
catch (err) {
  console.error('Network error:', err);
  setError("Search failed—check connection");
}
```

---

## Request Flow

```
1. User enters "Inception" in search bar
2. App trims whitespace: "Inception"
3. URL-encode query: "Inception" (no encoding needed for ASCII)
4. Build URL: http://www.omdbapi.com/?apikey=3a5d28b8&t=Inception
5. Fetch with 10s timeout (AbortController)
6. Parse JSON response
7. Check Response field:
   - "True" → Extract Title, Year, Plot, Poster, imdbRating
   - "False" → Extract Error message
8. Update React state (movieData or error)
9. Render MovieCard or error message
```

---

## Rate Limits

**OMDb Free Tier**: 1,000 daily requests per API key

**Mitigation**:
- No aggressive polling or auto-complete (spec uses explicit Enter/button submit)
- In-memory caching of results (per spec, avoid duplicate searches)
- Console warnings if rate limit approached (optional, not in spec)

---

## Security Considerations

1. **API Key Exposure**: Key stored in `.env` file, accessed via `import.meta.env.VITE_OMDB_API_KEY`
   - `.env` added to `.gitignore`
   - Key visible in client-side code (acceptable for free-tier demo)
   - Production alternative: Backend proxy to hide key (out of scope)

2. **Input Validation**: 
   - Trim whitespace before submission
   - URL-encode query to prevent injection (handled by `fetch` API automatically)
   - Empty queries rejected client-side (no API call)

3. **HTTPS Upgrade**: OMDb base URL is `http://`, not `https://`
   - Acceptable for localhost development
   - Production deployment should use proxy or check if OMDb supports HTTPS

---

## Summary

Single external API contract with OMDb. No custom backend endpoints. All error scenarios documented with user-friendly fallbacks. Rate limits acknowledged but unlikely to be hit during single-user development.

**Next Step**: Generate quickstart.md for manual testing workflow.
