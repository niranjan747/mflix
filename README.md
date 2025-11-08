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
- OMDb API key (included in `.env`)

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

### Environment Variables

Create a `.env` file in the root directory:

```properties
VITE_OMDB_API_KEY=3a5d28b8
```

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

---

## React + Vite Template Information

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
