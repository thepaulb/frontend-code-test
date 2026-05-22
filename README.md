# Front-End Developer — DWP Digital Technical Test

My response to the offline technical test as part of the assessment process.

## Overview

A single-page contact form that collects a name, email, date of birth and phone number. On submission, the data is validated client-side, and valid entries are displayed in a list below the form. Each entry can be removed. Submissions persist in `localStorage` so they survive a page refresh.

Built with vanilla HTML, CSS (via Sass) and ES6+ JavaScript — no frameworks, no component libraries — in line with the test rules.

## Features

- Client-side validation with an accessible error summary and inline field errors
- Submissions rendered dynamically and persisted in `localStorage`
- Remove any submission from the list
- Accessible to WCAG 2.2 AA: skip link, semantic HTML, `aria-live` announcements, keyboard-manageable focus, `aria-invalid` / `aria-describedby` on inputs
- Responsive layout using flexbox
- XSS-safe rendering — all user data inserted via `textContent`, never `innerHTML`

## Caveats

### Validation

- `js/storage.js` contains two `console.warn` statements. These exist solely to demonstrate how I would handle the absence of `localStorage`.
- The `<form>` tag has an empty `action` attribute because this is a purely front-end exercise.

### JavaScript and CSS quality

- The codebase broadly follows the [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html#introduction), which focuses on hard-and-fast rules that are clearly enforceable rather than purely aesthetic advice.
- Clicking "Remove" instantly deletes the entry with no confirmation step. For a form that requires the user to fill four fields, accidental deletion is a meaningful risk. I have deemed a confirmation dialog unnecessary for a project of this size, but recognise it as a risk.
- I have used Sass to demonstrate capability at a low implementation overhead. This project could just as easily have been built with plain CSS.

### Source file structure

- There is no JavaScript build step because there is little benefit for either myself or a reviewer beyond a small performance gain. The source files live at the root because HTML and JS require no compilation; only CSS is compiled via Sass.

## Testing

Unit tests cover each module in isolation — `validation`, `storage` and `submission-list` — using **Jest** with a **jsdom** environment. This gives fast, DOM-capable tests without needing a real browser. Babel (`@babel/plugin-transform-modules-commonjs`) transpiles ES module syntax to CommonJS so Jest can consume the source files directly.

Anything beyond unit tests (e.g. end-to-end tests) seemed disproportionate for a project of this size.

## Tech Stack

| Concern | Tool |
|---|---|
| Language | Vanilla JavaScript (ES6+ modules) |
| Markup | Semantic HTML5 |
| Styling | Sass → CSS (no framework) |
| Testing | Jest 29 + jsdom |
| Linting | ESLint 8 |
| Formatting | Prettier 3 |
| Transpilation (test only) | Babel — CommonJS transform |

## Getting Started

### Prerequisites

- **Node.js ≥ 18** (tested on v22; any current LTS will work)
- **npm** (ships with Node)

### Install

```bash
npm install
```

### Build CSS

```bash
npm run build:css        # one-off compile
npm run watch:css        # watch mode — recompiles on save
```

### Run tests

```bash
npm test                 # run all tests
npm run test:coverage    # with coverage report
```

### Lint and format

```bash
npm run lint             # ESLint
npm run format           # Prettier (auto-fix)
```

### View the page

Open `index.html` in a browser. No dev server is required — the app uses native ES modules (`<script type="module">`), so it works from the file system in any modern browser.
