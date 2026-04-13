# Task Playbooks

## Add or Modify a Route Page

Start from an existing page under `src/pages`. Keep the route component in `src/pages/<Name>/index.tsx`, then register it in `src/pages/router.tsx` with lazy loading if the surrounding routes use that pattern. If the page requires login, reuse `AuthGuard` rather than embedding auth checks directly into render logic.

When the page is conceptually part of the main application shell, fit it into the existing nested route structure instead of creating a parallel shell.

## Add a Reusable UI Component

Prefer `src/components/ui` when the component is a true primitive or cross-feature building block. Use `src/components/cbm` when the component contains Luckee-specific business semantics. Keep the visual API narrow, typed, and variant-driven. Compose Tailwind classes through `cn()` and formalize recurring variants with `cva()`.

If an existing primitive already solves eighty percent of the task, extend it rather than cloning a new one.

## Extend Chat Rendering

Treat the chat page as a **message pipeline**, not just a screen. A safe extension path is usually: normalize incoming message shape, map it into the current render model, then choose a renderer such as text panel, card panel, collapse panel, or preview block.

When the backend output is partially black-box, insert a tolerant adapter layer close to the render boundary. This adapter may infer block type, extract metadata, detect URLs or downloadables, and provide graceful fallback to raw markdown/text when parsing confidence is low.

Do not make the entire chat view depend on one brittle schema assumption. Always preserve a fallback presentation.

## Work with WebSocket Streaming

Keep WebSocket logic in hooks or transport-adjacent modules, following the current `useSocket` pattern. Preserve heartbeat handling, reconnect semantics, thread context, and language/user query parameters. When adding new message types, parse defensively and keep unknown payloads from crashing the UI.

For progressive rendering, prefer append-only or patch-safe state transitions. Partial stream chunks should never corrupt previously rendered messages.

## Integrate an API

Use `fetchApi` or `fetchEventStream` from `src/request`. Do NOT use raw `fetch` or `axios` directly. Define new endpoints in `src/services/` using the `METHOD@PATH` format. The runtime API resolver from `src/config/apiConfig.ts` will automatically match the correct service domain based on the path prefix.

If the surrounding module already wraps a request in React Query (`useQuery` / `useMutation`), extend that pattern rather than mixing in a different fetching approach. See `references/api-and-data-fetching.md` for details.

## Modify State Management

Reach for Zustand only when state must outlive a single component tree or coordinate multiple distant nodes. Keep derived UI-local state inside components or hooks. Do not move every piece of state into the global store.

When changing persisted state, check boot-time initialization and backwards compatibility. A storage key change without migration may silently break chat restoration or login-dependent flows.

## Style New UI

Prefer Tailwind v4 utilities and semantic theme tokens. Match existing spacing, borders, radii, muted text, and dark-mode behavior. Use motion sparingly and align with current Framer Motion usage. Avoid raw color literals if a semantic token exists.

If a design requires non-trivial custom visuals, first check whether the effect already exists in shared styles such as `src/style/tailwind.css` or a nearby component.

## Handle Errors and Empty States

Surface actionable issues through the global toast system (`toast.success`, `toast.error`, etc. from `src/hooks/use-toast.ts`). Never use `alert()`. 

Catch and handle `ApiError` specifically when making requests. For lazy-loaded route components, MUST wrap them in `src/components/base/ErrorBoundary` to gracefully handle `ChunkLoadError` when the app updates.

Keep transport failures, parse failures, and permission failures distinguishable. In agent rendering flows, separate **transport success but render fallback** from **true request failure**. See `references/error-handling-and-feedback.md` for details.

## Handle i18n and Text

NEVER hardcode Chinese or English strings directly in components. 
1. Define the translation keys in both `src/locales/zh/` and `src/locales/en/` files.
2. Inside React components, use `const t = useT('namespace');` and render with `{t('key')}`.
3. Outside React components, use the static `t('namespace', 'key')` function.
See `references/i18n-standards.md` for details.

## Preferred Change Strategy for AI Agents

Use this decision order.

| Situation | Preferred action |
| --- | --- |
| Existing module already matches the task | Extend that module with minimal new abstraction |
| Similar component exists elsewhere | Reuse or extract shared logic before adding another variant |
| Backend contract is unstable or opaque | Add a tolerant adapter with fallback UI |
| Change touches chat rendering and downloads/previews | Build a typed preview bridge, but retain generic file fallback |
| Task requests broad redesign without backend support | Deliver a staged architecture slice, not a full rewrite |

## Final Checklist

Before finishing, verify the following.

| Check | Expectation |
| --- | --- |
| Architecture | No Next.js-only patterns, no new global state library, no hardcoded service domain |
| UI | Tailwind + local components remain the default path |
| Data | `fetchApi` is used, and current thread/storage semantics are preserved |
| i18n | No hardcoded Chinese strings; `useT` or `t` is used for all user-visible text |
| Robustness | `ErrorBoundary` is used for lazy components; fallback UI exists for malformed backend data |
| Validation | Formatting/linting has been run at least on touched files |
| Summary | Final note explains extension points, conventions preserved, and remaining follow-up |
