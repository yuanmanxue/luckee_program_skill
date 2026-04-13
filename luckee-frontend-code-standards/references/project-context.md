# Project Context

## Repository Identity

This repository is **`luckee-frontend`**, a frontend application for the Luckee product. It is primarily a **chat-oriented AI/agent experience** with authentication, sidebar layout, capability dialogs, threaded chat entry, WebSocket-based streaming messages, and agent-style result rendering.

## Project Type

This is a **client-rendered SPA** built with **Rsbuild + React + TypeScript**. Routing is handled by **React Router** through `createBrowserRouter`. There is no Next.js App Router, Pages Router, server action layer, or React Server Components model in the current architecture.

## Core Stack

| Layer | Current choice |
| --- | --- |
| Language | TypeScript 5 |
| UI runtime | React 19 + React DOM 19 |
| Build tool | Rsbuild |
| Router | React Router v7 |
| Server-state | TanStack React Query |
| Client/domain state | Zustand |
| Styling | Tailwind CSS v4 + SCSS |
| Component style | shadcn-style local UI primitives + Radix UI building blocks |
| Animation | Framer Motion |
| Icons | Lucide React |
| Persistence | localStorage, sessionStorage, localforage |
| Transport | Axios for HTTP, native WebSocket via custom hook |
| Lint/format | Biome |

## Important Runtime Characteristics

The application boots from `src/main.tsx` into `src/app/App.tsx`. The bootstrap layer initializes Immer helpers, local storage utilities, Zustand store initialization, React Query, Suspense, ErrorBoundary, RouterProvider, and the Toaster.

The project uses **runtime service discovery** through `window.appInfo.services`, not compile-time-only environment variables. HTTP URL construction is centralized in `src/config/apiConfig.ts`, which maps request paths to service domains. Any new API integration should preserve this model.

The project also uses a **custom theme attribute** rather than framework-default dark mode configuration. Theme state is attached to `data-ad-color-scheme` on the document root, and Tailwind tokens are designed around semantic CSS variables.

## Directory Conventions

| Path | Purpose |
| --- | --- |
| `src/app` | Application bootstrap and app-level wrappers |
| `src/pages` | Route-level screens |
| `src/pages/router.tsx` | Central browser router definition |
| `src/components/ui` | Shared UI primitives |
| `src/components/cbm` | Business components tied to Luckee workflows |
| `src/components/base` | Cross-cutting infrastructure components such as guards and boundaries |
| `src/components/chat-render` | Agent/chat result rendering panels |
| `src/hooks` | Reusable hooks such as socket, theme, auth checks, and toast integration |
| `src/stores` | Zustand stores and boot-time store initialization |
| `src/config` | Runtime configuration and API routing helpers |
| `src/locales` | i18n resources |
| `src/style` and `src/global.scss` | Tailwind theme tokens and global styling |

## Route Model

The route tree is defined in `src/pages/router.tsx`. The root path renders the main shell page and nests the initial prompt composer plus the `/chat` page. Authentication-sensitive routes use `AuthGuard` wrappers. New pages should follow the same lazy-imported route registration pattern.

## Chat and Agent Model

The chat flow has two major stages.

First, `src/components/cbm/ChatArea/index.tsx` acts as the prompt entry layer. It creates a UUID `thread_id`, persists draft input and attachment metadata into `localforage`, applies file blacklist and size-limit rules, checks login/points via `useAuthCheck`, and navigates to `/chat`.

Second, `src/pages/Chat/index.tsx` consumes the thread context, opens a WebSocket through `useSocket`, sends the initial query payload, and renders messages with a composition of shared chat primitives and agent render panels.

This means chat changes should usually preserve three things: **thread continuity**, **storage compatibility**, and **streaming resilience**.

## Core Dependencies and Intended Usage

| Dependency | Use it for |
| --- | --- |
| `@tanstack/react-query` | Remote data fetching, caching, invalidation |
| `zustand` | Global app/user/domain state |
| `axios` | HTTP requests |
| `localforage` | Persisting chat drafts and file blobs |
| `class-variance-authority` | Variant management for reusable UI primitives |
| `clsx` + `tailwind-merge` | Conditional Tailwind class merging through `cn()` |
| `lucide-react` | Icons |
| `framer-motion` | Motion and animated entry effects |
| `@radix-ui/*` | Accessible headless primitives behind local UI components |

## Existing Style Contract

Prefer semantic utility classes such as `bg-background`, `text-foreground`, `border-border`, and `text-muted-foreground` rather than hardcoded hex values. Keep layouts responsive and compose classes with `cn()`. Use `cva()` if a primitive needs formal variants. Favor the project’s local UI components before reaching for raw Radix building blocks.

## Existing State and Feedback Contract

Global UX feedback flows through the toast/snackbar system exposed from the global store and `use-toast`. Authentication and user information are managed in Zustand stores, with persistence and boot-time initialization already in place. Reuse this infrastructure rather than creating per-page ad hoc notification and auth state.

## AI-Agent-Specific Guidance

This repository is already evolving toward a **chat + agent UI** product. When adding new result renderers, block schemas, preview panels, or streaming adapters, prefer an incremental path that wraps the current message pipeline. Avoid replacing the current chat architecture with a completely different rendering model unless the task explicitly requests a foundational rewrite.
