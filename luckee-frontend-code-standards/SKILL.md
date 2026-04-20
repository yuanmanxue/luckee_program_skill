---
name: luckee-frontend-code-standards
description: "AI coding standards for the motse-ai/luckee_frontend repository. Use for reading, modifying, or generating code in this Rsbuild + React + TypeScript frontend, especially chat pages, agent rendering, routing, Zustand stores, API integration, Tailwind UI, and project-specific architecture decisions."
---

# Luckee Frontend Code Standards

## Overview

Use this skill when working inside the **Luckee** frontend repository. Treat the repository as a **client-side React SPA**, not as a Next.js project, a Server Components project, or a generic Vite starter. Keep changes aligned with the existing Rsbuild, React Router, Zustand, React Query, Tailwind, and shadcn-style component patterns.

Before making any non-trivial change, read `references/project-context.md`. If the task touches chat entry, streaming, WebSocket messages, runtime API routing, or thread persistence, also read `references/task-playbooks.md`.

## Execution Workflow

Follow this order unless the task is trivial.

1. **Identify the change category.** Decide whether the task belongs to page routing, shared UI primitives, business components, store logic, chat/agent rendering, API/runtime integration, or i18n translation.
2. **Inspect the nearest existing implementation.** Reuse surrounding patterns before inventing a new abstraction. If creating new files, ALWAYS start from the provided `templates/` directory.
3. **Preserve the project contract.** Keep Rsbuild, React Router, Zustand, React Query, Tailwind tokens, and runtime service resolution intact.
4. **Implement the smallest coherent change.** Prefer extension over rewrite.
5. **Run focused validation.** At minimum, run formatting/lint checks on touched files. Run broader checks when the change crosses modules.
6. **Report architectural impact.** Explain what changed, what conventions were preserved, and any remaining risks or follow-up work.

## Non-Negotiable Project Rules

| Area | Require |
| --- | --- |
| App type | Treat the app as **Rsbuild + React 19 SPA** with `createBrowserRouter`, not Next.js or SSR-first architecture. |
| Language | Write **TypeScript** with `strict`-compatible code. Avoid weakening types unless the surrounding file already uses `any`. |
| UI | Prefer existing components under `src/components/ui` and business components under `src/components/cbm`. |
| Form controls | Prefer shared `Input` / `Textarea` from `src/components/ui` for normal text-entry controls. Only keep raw `<input>` / `<textarea>` when there is a clear implementation reason, such as hidden file inputs or contentEditable integrations. |
| Styling | Prefer **Tailwind utility classes** and semantic theme tokens. Use SCSS only when Tailwind is clearly insufficient or when editing existing SCSS/module files. |
| Class composition | Use `cn()` for conditional classes and `cva()` when adding reusable variants. |
| Icons | Use `lucide-react` unless the repository already uses an inline SVG for a special case. |
| State | Use **Zustand** for app/domain state and **React Query** for server-state caching. Do not introduce a second global state library. |
| Routing | Define pages in `src/pages`, wire routes in `src/pages/router.tsx`, and keep lazy-loading/auth guard patterns consistent. |
| Network | Do **not** hardcode service base URLs. MUST use `fetchApi` or `fetchEventStream` from `src/request`. |
| Feedback | Surface user-visible success/error states through the existing toast/snackbar flow (`toast.success()`, etc.) instead of `alert()`. MUST handle `ChunkLoadError` via `ErrorBoundary`. |
| i18n | NEVER hardcode Chinese strings. MUST use `useT` hook in components or `t` function elsewhere, and update `src/locales` files. |
| Dependencies | Avoid adding new dependencies unless the task cannot be solved with the current stack. |

## Implementation Rules by Area

### Build pages and routes the existing way

Place page-level screens in `src/pages/<PageName>/index.tsx`. Use lazy imports in `src/pages/router.tsx`. Keep authenticated behavior behind `AuthGuard` wrappers instead of embedding ad hoc redirect logic in every page.

### Build shared UI before business UI

If the task creates a reusable primitive, place it under `src/components/ui`. If it is specific to Luckee workflows, place it under `src/components/cbm` or another existing business folder. Avoid mixing one-off business rules into shared primitives.

### Component lookup rule — check before building

Before writing any UI element, check whether a component already exists in `src/components/ui`. If it does, use it. Do not re-implement buttons, badges, tooltips, spinners, skeletons, dialogs, inputs, or other primitives inline in business pages.

Common primitives already available:

| Need | Component |
| --- | --- |
| Button / CTA | `Button` from `src/components/ui/button` — use `variant` and `size` props |
| Tooltip / hover hint | `SimpleTooltip` from `src/components/ui/tooltip` |
| Loading spinner | `Spinner`, `SpinnerPage`, `SpinnerInline` from `src/components/ui/spinner` |
| Skeleton / loading placeholder | `Skeleton`, `ChatSkeleton` from `src/components/ui/skeleton` |
| Badge / tag | `Badge` from `src/components/ui/badge` |
| Card surface | `Card` from `src/components/ui/card` |
| Dialog / modal | `Dialog` from `src/components/ui/dialog` |
| Brand logo | `Logo` from `src/components/ui/logo` |
| Toast notification | `toast` from `src/hooks/use-toast` |

If the primitive does not exist, create it in `src/components/ui` before using it in business code. Never build a one-off version inside a page or business component.

### Component layer and file organization

The project uses three component layers. Keep them strictly separated.

| Layer | Location | Rule |
| --- | --- | --- |
| **UI primitives** | `src/components/ui/` | Stateless or lightly stateful. No business logic, no API calls, no i18n keys from business domains. Reusable across any page. |
| **Shared business components** | `src/components/cbm/` | Encapsulate Luckee-specific workflows (chat, data source, pricing, etc.). May call APIs and use stores. Not page-specific. |
| **Page-level components** | `src/pages/<PageName>/` | Compose primitives and business components. Contain routing, page-level state, and layout only. |

**File organization rules:**

- One primary exported component per file. If a file exports `default function FooPage`, that is the only public surface.
- Sub-components that are only used inside one file are acceptable as local functions in the same file, **but only when they are small (< 30 lines) and have no independent reuse potential**. If a sub-component grows beyond that, extract it to its own file.
- If a file contains more than 2–3 local helper components, it is a signal to split. Create a `components/` subfolder next to the file and move each sub-component into its own file.
- Never define business logic (API calls, store reads, side effects) inside a UI primitive component.
- Never define shared visual patterns (card shells, status icons, layout wrappers) directly inside a page file. Extract them to `ui/` or `cbm/` first.

**Example — correct structure for a complex page:**

```
src/pages/Chat/
  index.tsx              ← page entry, routing, layout
  components/
    MessageList.tsx      ← extracted sub-component
    InputToolbar.tsx     ← extracted sub-component
    TypingIndicator.tsx  ← extracted sub-component
```

**Example — wrong:**

```
src/pages/Chat/index.tsx   ← 1500 lines with 8 local function components defined inline
```

### Extend chat and agent UI compositionally

The repository already composes chat output from primitives such as `ChatContainer`, `ChatMessages`, `ChatMessage`, `CardPanel`, `CollapsePanel`, and `TextPanel`. Extend this composition model before inventing a parallel rendering framework. When rendering black-box agent output, prefer adding typed adapters or block transformers around the current message pipeline instead of replacing the entire chat page.

### Respect the runtime integration model

The app resolves service domains from `window.appInfo.services` at runtime. Build HTTP URLs through the existing API config helpers. Build WebSocket integrations in the same style as the current chat transport, passing thread, language, and user context consistently.

### Preserve chat draft and thread semantics

The chat entry flow generates a `thread_id`, persists input and attachment metadata in `localforage`, and hands off to `/chat`. Reuse the existing key scheme and storage behavior when expanding chat capabilities. Do not introduce a second incompatible persistence model for drafts or attachments unless migration is explicitly part of the task.

## Output Expectations for AI Coding Agents

When responding to a coding task in this repository, do the following.

1. State the target files and why they are the right extension points.
2. Mention which existing pattern is being reused.
3. Implement code that matches the repository’s naming, typing, and styling conventions.
4. Keep comments sparse and meaningful. Do not add tutorial-style commentary.
5. Avoid speculative refactors unrelated to the requested task.
6. If a task requires broader architectural change, implement the minimal safe slice and call out the follow-up path separately.

## Validation

Use the repository’s existing commands when possible.

| Goal | Command |
| --- | --- |
| Install deps | `pnpm install` |
| Local dev | `pnpm local` |
| HTTPS local dev | `pnpm locals` |
| Lint and format | `pnpm lint` |
| Format only | `pnpm format` |
| Focused file validation | `pnpm exec biome check --write <files...>` |
| Production build | `pnpm build` |

For normal frontend/UI changes, a focused `pnpm exec biome check --write <files...>` on the touched files is the default validation and is usually sufficient. Do **not** run a full production build by default after every small change. Reserve `pnpm build` for cases where the user asks for it, the change touches build/runtime wiring, or you have a concrete reason to suspect a compile or bundling issue that Biome will not catch.

## Read These References When Needed

| Reference | Read when |
| --- | --- |
| `references/project-context.md` | Need repository overview, stack, directory conventions, dependencies, and architectural constraints. |
| `references/task-playbooks.md` | Need concrete implementation guidance for routes, chat UI, streaming, API integration, stores, and styling decisions. |
| `references/api-and-data-fetching.md` | Need to call APIs, define new API routes, or handle Server-Sent Events (SSE). |
| `references/i18n-standards.md` | Need to add user-visible text, translate strings, or handle multi-language switching. |
| `references/error-handling-and-feedback.md` | Need to show toast notifications, handle API errors, or implement `ErrorBoundary` for lazy-loaded components. |
| `references/prompt.md` | Need Chinese usage instructions and ready-to-copy Claude prompts tailored to the current `luckee_frontend` codebase. |
| `templates/` | Need to create a new page (`page.tsx`), UI component (`ui-component.tsx`), or Zustand store (`store.ts`). |

## Avoid These Mistakes

Do not generate Next.js-specific code such as App Router files, server actions, or `next/*` imports. Do not introduce raw CSS-in-JS patterns, Redux, MUI, Ant Design, or another component system unless explicitly requested. Do not hardcode API hosts, bypass runtime service config, or replace existing storage keys without a migration plan. Do not collapse business components and shared primitives into a single layer. Avoid hand-styling raw `<input>` / `<textarea>` in business pages when shared form primitives already exist.

Do not re-implement a UI primitive that already exists in `src/components/ui`. Always check the component library first. Do not write more than 2–3 local sub-components inside a single file — extract them when they grow. Do not put business logic (API calls, store reads) inside `src/components/ui` primitives. Do not put reusable visual patterns directly inside page files.
