# Fluently - Frontend

A React + TypeScript frontend for a SaaS platform built for language teachers to manage students, schedule and record lessons, assign and generate AI-powered homework, track student goals, and log payments — all in one place.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+ (or your preferred package manager)
- A running instance of the Rails backend API

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fluently/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `frontend/` directory:

   ```env
   VITE_API_URL=http://localhost:3001
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

   | Variable                      | Description                                   |
   | ----------------------------- | --------------------------------------------- |
   | `VITE_API_URL`                | Base URL of the Rails backend API             |
   | `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for payment processing |

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Available Scripts

| Script            | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the development server with HMR |
| `npm run build`   | Type-check and build for production   |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`    | Run ESLint                            |

## Project Structure

```
src/
├── api/          # Axios instance and base API config
├── contexts/     # Auth and Alert React contexts
├── features/     # Feature modules by role (public, student, admin, shared)
├── layouts/      # Page shell components
├── routes/       # Route definitions and auth guards
├── styles/       # Global CSS
├── type/         # Shared TypeScript types
├── ui/           # Reusable UI components
└── utils/        # Utility functions
```

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite** — build tool
- **Tailwind CSS** — styling
- **React Router v7** — routing
- **TanStack Query v5** — server state management
- **Axios** — HTTP client
- **Tiptap** — rich text editor
- **Stripe** — payment processing
- **dnd-kit** — drag and drop
