# Movie Flix

A modern movie search application built with React, TypeScript, and Vite. Search for movies and discover details instantly with an intuitive autocomplete interface.

## Features

### ✨ Search Autocomplete
- **Smart Suggestions**: Get movie suggestions as you type (minimum 2 characters)
- **Keyboard Navigation**: Use Up/Down arrow keys to navigate, Enter to select, Escape to close
- **Debounced Search**: Optimized API calls with 300ms debounce delay
- **Error Handling**: User-friendly error messages with automatic retry logic

### 🎬 Movie Details
- View comprehensive movie information including:
  - Title, Year, and IMDb Rating
  - Full plot description
  - Movie poster
  - Runtime and Genre
- Powered by OMDb API

### 🌓 Theme Personalization
- Light and Dark mode support
- Preferences saved to localStorage
- Smooth theme transitions

### 📱 Responsive Design
- Optimized for mobile (320px+), tablet (768px+), and desktop (1920px+)
- Touch-friendly 44px minimum tap targets
- Full accessibility support (WCAG 2.1 AA compliant)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- OMDb API key (see setup instructions below)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### API Key Setup

This project uses the [OMDb API](https://www.omdbapi.com/) to fetch movie data.

1. **Get your free API key**:
   - Visit [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
   - Select the "FREE" plan (1,000 daily requests)
   - Enter your email address
   - Check your email for the API key activation link
   - Click the activation link to verify your key

2. **Add the API key to your project**:
   - Create a `.env` file in the project root directory
   - Add your API key:
     ```properties
     VITE_OMDB_API_KEY=your_api_key_here
     ```
   - Replace `your_api_key_here` with your actual API key
   - The `.env` file is already in `.gitignore` and won't be committed

## Usage

1. **Type a movie title** in the search bar (minimum 2 characters)
2. **Wait 300ms** for autocomplete suggestions to appear
3. **Navigate suggestions** with keyboard (Up/Down/Enter) or mouse
4. **Select a movie** to view full details
5. **Toggle theme** using the button in the top-right corner

## Technology Stack

- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool and dev server
- **Tailwind CSS 3.x** - Utility-first CSS
- **OMDb API** - Movie data source

## Performance

- **Bundle Size**: 207.98 KB (gzip: 64.66 KB)
- **Suggestion Display**: <2 seconds
- **Detail Fetch**: <1 second
- **API Timeout**: 10 seconds (user-facing: 3 seconds)

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes for screen readers
- ✅ WCAG 2.1 AA color contrast
- ✅ Focus indicators
- ✅ Semantic HTML

## Project Structure

```
src/
├── components/        # React components
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   ├── SuggestionsDropdown.tsx
│   ├── MovieCard.tsx
│   └── LoadingSpinner.tsx
├── hooks/            # Custom React hooks
│   ├── useAutocomplete.tsx
│   ├── useMovieSearch.tsx
│   └── useTheme.tsx
├── types/            # TypeScript interfaces
│   └── movie.ts
├── utils/            # Utility functions
│   └── api.ts
├── App.tsx           # Main application
└── main.tsx          # Entry point
```

## License

This project is for educational purposes.
