# Event Hub - Event Management App

**Owner:** iXludaTech

Event Management App (Event Hub) is an advanced React application for managing events. It lets users browse a list of events fetched from a JSON server back-end, search and filter them, create new events, and open a dedicated event page where existing events can be edited or deleted. The application uses a shared **Context** for global state, **React Router** for navigation, and **Chakra UI** as its design system, with **toast notifications**, **modal dialogs** and **skeleton loaders** throughout.

---

## Table of Contents

- [Chakra UI Checkbox Issue](#Chakra-UI-Checkbox-Issue)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [How It Was Built (Steps Taken)](#how-it-was-built-steps-taken)
- [API Reference](#api-reference)
- [Learning Goals Covered](#learning-goals-covered)

---

## Chakra UI Checkbox Issue

During development, an issue was encountered with the Chakra UI Checkbox implementation. Although the category data, state management, and event handling logic were all working correctly, clicking the Games or Relaxation checkbox unexpectedly toggled the Sports category. After debugging the data flow and verifying that each category had the correct ID, the issue was isolated to the Chakra checkbox implementation/configuration rather than the React state logic. The problem was resolved by replacing the Chakra checkbox component with a native HTML <input type="checkbox">, while retaining Chakra UI components for layout and styling. The native checkboxes correctly toggle their respective categories and continue to use the existing React state management logic. This took way longer time than expected to debug.

## Features

**Events list page (`/`)**

- Fetches all events from `http://localhost:3000/events` and displays title, description, image, start/end times and category names (Sports, Games, Relaxation).
- Categories are resolved by comparing each event's `categoryIds` against the categories fetched from `http://localhost:3000/categories`.
- **Search** by event name and **filter** by one or more categories (using checkboxes).
- **Add Event** button (in the navigation bar) opens a modal with a required
  form that uploads new events to the server.
- **Skeleton placeholders** are shown while the events are loading.
- Every event card is clickable and routes to the event detail page.

**Event detail page (`/event/:eventId`)**

- Shows title, description, image, location, start/end times and category names.
- **Edit Event** button opens a modal with a pre-filled form; editing and saving, update the server via `PUT`.
- **Delete Event** button opens a warning dialog (`yes/no`) before a `DELETE` request is sent; after a successful delete the user is redirected back to the events list.
- A friendly "event not found" state for invalid or deleted ids.

**Third page (`/about`)**

- A fully functional About page that explains the project and its features.

**Global**

- Responsive layout that works on mobile and desktop.
- Dark/light color mode toggle (Chakra UI + `next-themes`).
- Toast notifications on **every** create, update and delete — success **and** failure.
- All form inputs are `required` (categories require at least one selection).
- An `ErrorBoundary` catches rendering errors and shows a recoverable fallback screen.

---

## Tech Stack

| Layer       | Technology                                             |
| ----------- | ------------------------------------------------------ |
| Framework   | React 19 (Vite 7)                                      |
| Design sys. | Chakra UI 3 + custom design system (`src/theme.js`)    |
| Routing     | React Router 7                                         |
| State       | React Context (`EventsContext`)                        |
| Back-end    | JSON Server (0.17) at `http://localhost:3000`          |
| Icons       | react-icons (Lucide set)                               |
| Tooling     | ESLint, npm scripts                                    |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the JSON server (back-end) on http://localhost:3000
json-server events.json

or

npm run server

# 3. In a second terminal, start the Vite dev server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Project Structure

```
src/
├── api/
│   └── events.js                # fetch helpers for events & categories
├── components/
│   ├── ui/                      # Chakra UI design-system primitives (provider, toaster, …)
│   ├── DeleteConfirmDialog.jsx  # yes/no dialog used before deleting an event
│   ├── ErrorBoundary.jsx        # error boundary fallback screen
│   ├── EventCard.jsx            # clickable event card shown in the list
│   ├── EventCardSkeleton.jsx    # skeleton placeholder while loading
│   ├── EventFormModal.jsx       # shared modal form (create & edit)
│   ├── Navigation.jsx           # sticky header with links + "Add Event" button
│   └── Root.jsx                 # layout wrapper (Navigation + <Outlet />)
├── context/
│   └── EventsContext.jsx        # global state: events, categories, CRUD + toasts
├── pages/
│   ├── EventsPage.jsx           # list, search, filter, add-event modal, skeletons
│   ├── EventPage.jsx            # detail, edit modal, delete confirmation
│   └── AboutPage.jsx            # third page
├── utils/
│   ├── about.js                 # about data
│   └── format.js                # date/dateTime helpers
├── theme.js                     # custom Chakra UI design system (tokens)
└── main.jsx                     # router + providers + toaster
```

---

## Architecture

### Data flow

1. `main.jsx` sets up the router, wraps the app in the Chakra `Provider` (which now uses the custom design system), the `EventsProvider`, and mounts the `Toaster`.
2. On mount, `EventsProvider` fetches `/events` and `/categories` in parallel and stores them in context (`loading` / `error` are tracked too).
3. Every page reads events and categories from the context via the `useEvents()` hook — no prop drilling, and all pages stay in sync automatically.
4. CRUD operations (`addEvent`, `editEvent`, `removeEvent`) live in the context. Each one talks to the API layer, updates the shared state, and shows a **toast** on success or failure.
5. `getCategoryNames(event)` resolves an event's `categoryIds` to the real category names.

### Context and Provider (mandatory requirement)

`src/context/EventsContext.jsx` exposes `EventsProvider` and the `useEvents()` hook. It stores:

- `events`, `categories`, `loading`, `error`
- `addEvent`, `editEvent`, `removeEvent`
- `getCategoryNames`

### Design system (mandatory requirement)

`src/theme.js` defines a custom design system with `createSystem` / `defineConfig`: a brand color
palette (`brand.*` tokens) and semantic tokens such as `brandSolid`. `src/components/ui/provider.jsx`
injects this system into every Chakra component, so the entire app shares one consistent look and
dark/light mode.

### Forms, modals and skeletons

- `EventFormModal` is a single reusable modal used for both **creating** and **editing** events.
  It is a controlled form with a required `title`, `description`, `image` URL (with live preview),
  `location`, `startTime`, `endTime` and at least one category. It validates the time range and
  category selection, converts between `datetime-local` and ISO strings, and submits to the
  `onSubmit` callback passed by the parent.
- `DeleteConfirmDialog` is an `alertdialog` that asks the user to confirm before deleting.
- `EventCardSkeleton` (built from Chakra `Skeleton`) is rendered while events load.

### Navigation with React Router

- `/` → `EventsPage`
- `/event/:eventId` → `EventPage`
- `/about` → `AboutPage`

The "Add Event" navigation item navigates to `/` with router state (`{ openAddEvent: true }`);
`EventsPage` reads that state to open the create modal, then clears it so the modal never
re-opens on refresh or re-render.

---

## How It Was Built (Steps Taken)

1. **Inspected the starter project** — the provided `main.jsx`, `Root`, `Navigation`, `EventsPage`,
   `EventPage` and the `events.json` data structure (users, events, categories).
2. **Set up the design system** — created `src/theme.js` with `createSystem` (brand tokens, semantic colors, global styles) and wired it into the existing Chakra `Provider`.
3. **Built the API layer** — `src/api/events.js` wraps `fetch` for `GET/POST/PUT/DELETE` on
   `/events` and `/categories`, with error handling.
4. **Added global state** — `EventsContext` + `EventsProvider` to hold events, categories and the CRUD operations, with toast notifications for every mutation.
5. **Built shared components** — `EventCard`, `EventCardSkeleton`, `EventFormModal` (create/edit),
   `DeleteConfirmDialog` and `ErrorBoundary`.
6. **Built the Events list page** — grid of cards, search input, category filter checkboxes, skeleton loading state, empty/error states, and the add-event modal (wired to the nav button via router state).
7. **Built the Event detail page** — full details, edit modal (reusing `EventFormModal`), delete confirmation dialog and redirect after delete.
8. **Added the third page** — `AboutPage` with a navigation link.
9. **Structured routing & providers** — added the `/about` route, `EventsProvider`, `Toaster` and
   `ErrorBoundary` in `main.jsx`.

---

## API Reference

Base URL: `http://localhost:3000`

| Method   | Endpoint          | Description                        |
| -------- | ----------------- | ---------------------------------- |
| `GET`    | `/events`         | List all events                    |
| `GET`    | `/categories`     | List all categories                |
| `POST`   | `/events`         | Create a new event                 |
| `PUT`    | `/events/:id`     | Replace/update an event            |
| `DELETE` | `/events/:id`     | Delete an event                    |

---

## Learning Goals Covered

- Debugging and profiling in React (`ErrorBoundary`, console logging)
- Advanced React app structure with component composition
- Connecting the app to a back-end server (JSON Server)
- State management with Context and Context.Provider
- Complex UI: modals, dialogs, skeletons and toasts
- Custom hooks (`useEvents`, `useColorMode`, …) and reusable logic
- React Router navigation across multiple page components
- A mandatory Chakra UI design system with responsive, accessible UI
