---
name: luckee-style-governance
description: "Govern style cleanup and UI refactors for the motse-ai/luckee_frontend repository. Use when the task involves inline style cleanup, dialog/modal standardization, shared UI extraction, token-first theming, or page alignment to the Luckee visual language without rewriting product logic."
---

# Luckee Style Governance

## Overview

Use this skill when working on **style normalization** inside `motse-ai/luckee_frontend`, especially when the repository has accumulated inline styles, inconsistent dialog surfaces, duplicated visual fragments, or page-level UI drift from the official Luckee design language.

This skill does **not** replace `luckee-ui-standards` or `luckee-frontend-code-standards`. Instead, it sits between them:

| Skill | Role |
| --- | --- |
| `luckee-ui-standards` | Defines the official Luckee visual language: typography, color, radius, shadows, feedback, and token mapping. |
| `luckee-frontend-code-standards` | Defines the engineering contract of `luckee_frontend`: Rsbuild SPA, React Router, Zustand, React Query, i18n, request flow, and component layering. |
| `luckee-style-governance` | Defines the **order of execution** and **governance rules** for turning a messy UI codebase into a maintainable Luckee-style implementation. |

Always treat this skill as a **workflow skill**. The value is not just the final CSS. The value is executing the migration in the correct order so that the project becomes more consistent after every step.

## When to Use This Skill

Use this skill when one or more of the following are true.

| Trigger | Use this skill? |
| --- | --- |
| Many components use `style={{ ... }}` for colors, spacing, typography, borders, or shadows | Yes |
| Dialogs/modals look inconsistent across business areas | Yes |
| Shared primitives under `src/components/ui` are missing or bypassed | Yes |
| A task asks for “1:1 UI alignment” to `luckee-ui` but the current codebase is visually inconsistent | Yes |
| A task only changes one isolated icon or typo with no style-system impact | Usually no |

## Required Reading Order

Before making non-trivial style changes, read supporting materials in this order.

1. Read `luckee-frontend-code-standards` and its `references/project-context.md` when the task touches repository structure or reusable components.
2. Read `luckee-ui-standards` when the task touches colors, typography, radius, surfaces, buttons, inputs, dialogs, cards, toasts, or page layout tone.
3. Read the relevant reference file in this skill based on the task type:
   - `references/governance-playbook.md` for execution order and migration strategy.
   - `references/inline-style-policy.md` for deciding whether inline style should be removed or kept.
   - `references/prompt-templates.md` for constrained prompts to Claude or another coding agent.

## Non-Negotiable Governance Rules

| Area | Rule |
| --- | --- |
| Migration order | Follow **audit → palette primitives → semantic theme → component tokens → primitives → dialog system → inline-style cleanup → shared business UI → pages → sweep**. Do not jump straight to page restyling when the base layer is still fragmented. |
| Architecture | Preserve the existing Rsbuild + React + TypeScript SPA architecture, routes, stores, runtime API model, i18n, error handling, and request flow. |
| Theme source | Treat `figmacode/src/app/components/DesignSystemPage.tsx` `Color Palette Definition` as the default palette baseline for routine visual work. |
| Styling | Prefer semantic tokens, Tailwind utility classes, `cn()`, and `cva()`. Do not add new visual systems in parallel. |
| New colors | Do not introduce a new hex, rgba, or Tailwind color utility directly in a component if it is meant to become part of the design language. Routine additions should come from the baseline palette. Intentional innovation extensions are allowed, but they must still enter through the palette layer first and then map forward. |
| Inline style | Remove **visual** inline styles when they can be represented by tokens or utilities. Keep inline style only for genuine runtime numeric values such as dynamic width, height, transform, or z-index. |
| Shared UI | If a style pattern appears repeatedly and is business-agnostic, move it toward `src/components/ui` or a minimal shared wrapper instead of duplicating classes. |
| Scope control | Implement the smallest coherent slice. If the task is broad, split it into steps and finish one step at a time. |
| Page work | Page-level 1:1 alignment happens **after** primitives and shared components are stable. |

## Workflow Decision Tree

1. **Need to understand the mess first?** Follow the **Audit workflow**.
2. **Need to change the global visual language?** Follow the **Token-first workflow**.
3. **Need to standardize inconsistent dialogs or cards?** Follow the **Primitive/Dialog workflow**.
4. **Need to remove inline styles safely?** Follow the **Inline-style cleanup workflow**.
5. **Need to make pages match `luckee-ui`?** Follow the **Page alignment workflow**, but only after the previous workflows are stable.

## Core Workflow

### 1. Audit the current UI debt

Start by locating the highest-leverage style debt.

Audit for these categories:

| Category | Typical signs |
| --- | --- |
| Token bypass | Hardcoded hex, rgba, or color utilities that ignore semantic tokens |
| Visual inline style | `style={{ color, background, padding, borderRadius, boxShadow, fontSize }}` |
| Fragmented dialogs | Multiple modal interiors using unrelated card/header/button styles |
| Missing primitives | Business files reproducing badge/card/header/section styles repeatedly |
| Premature page styling | Large page rewrites built on unstable primitives |

Output a prioritized table before editing broad areas. P0 items are issues that will cause repeated rework if left unresolved.

### 2. Fix the base layer first

Before touching business pages, standardize the bottom of the stack.

1. Align the palette primitive layer to `DesignSystemPage.tsx` for routine work.
2. Map palette primitives into semantic tokens such as `--background`, `--primary`, `--accent`, and `--border`.
3. Map semantic tokens into component tokens such as table, sidebar, dialog, and toast surfaces.
4. Ensure fonts, surfaces, radius, shadows, and focus rings match `luckee-ui-standards`.
5. Update shared primitives such as button, input, card, dialog, tabs, toast, and related wrappers.

Do not skip this stage. If the theme and primitives are wrong, every page-level adjustment becomes temporary.

### 3. Standardize dialog and feedback surfaces early

In `luckee_frontend`, dialog inconsistency usually carries the highest visual entropy. Normalize dialog overlay, container surface, title, description, close affordance, action footer, and common content shells before deep page work.

Prefer extending the current dialog primitive instead of inventing another modal stack.

### 4. Clean inline styles by policy, not by instinct

Not every inline style is a bug. Use the policy in `references/inline-style-policy.md`.

- Remove visual inline styles first.
- Keep runtime numeric styles when they are truly data-driven.
- If a repeated inline visual pattern appears in multiple files, convert it into a shared variant or wrapper.

### 5. Unify repeated business UI

After primitives are stable, inspect high-frequency business UI such as chat entry, result cards, collapsible panels, sidebar blocks, and account dialogs.

Ask these questions before extracting anything:

1. Is the pattern reused in multiple places?
2. Is it visually stable enough to deserve a shared abstraction?
3. Can it be implemented as a light wrapper or variant without moving business logic?

Only then extract.

### 6. Do page-level alignment last

Once tokens, primitives, dialogs, and repeated shared UI are stable, perform page-level 1:1 alignment to `luckee-ui`.

At this stage, page work should mostly involve:

- spacing and rhythm
- hierarchy and typography
- grouping and surfaces
- CTA arrangement
- empty-state and entry-panel tone

Avoid solving page differences by adding one-off styles that bypass the newly standardized system.

If a page seems to require a new color, stop and decide which layer it belongs to:

1. Palette primitive if it is a reusable shade from the default design palette
2. Semantic token if it represents a cross-app meaning
3. Component token if it only belongs to one visual surface family

If it does not exist in the default palette and the task is not explicitly exploratory, prefer reusing an existing color instead of inventing a new one.

## Output Requirements for Coding Agents

When using this skill during a coding task, always structure the response in this order:

1. State the current step goal.
2. List the target files.
3. Explain why those files are the correct extension points.
4. Provide a compact change summary table: `file / change type / logic impact / risk / rollback`.
5. Implement the smallest safe patch.
6. Describe validation steps.
7. List remaining risks or follow-up slices.

If the requested scope is too large, shrink it before coding.

## Validation Expectations

After each step, run the smallest reasonable validation.

| Change Type | Minimum validation |
| --- | --- |
| Theme/token file change | Start app or inspect compiled UI for token application |
| Primitive update | Check local render and run focused lint/format on touched files |
| Dialog cleanup | Open each touched dialog state and inspect overlay, title, footer, close action |
| Inline-style cleanup | Verify no visual regressions in the touched component |
| Page alignment | Compare against `luckee-ui` reference and check key interactions still work |

Prefer small commits after each stable step.

## References in This Skill

| File | Read when |
| --- | --- |
| `references/governance-playbook.md` | Need the full step-by-step migration order and target file hotspots |
| `references/inline-style-policy.md` | Need to judge whether an inline style should stay or be refactored |
| `references/prompt-templates.md` | Need reusable prompts for Claude or another coding agent |
| `references/usage-guide.md` | Need Chinese usage instructions, application scenarios, and ready-to-copy prompt demos for `luckee_frontend` |

## Avoid These Mistakes

Do not start with homepage cosmetics when the token layer is still wrong. Do not remove every inline style mechanically. Do not fork a second dialog system. Do not embed visual constants directly inside business components when a token or primitive can carry them. Do not turn a style cleanup task into a product-logic refactor.

**Style priority rule (must follow in every task):**
Always apply styles in this order. Only move to the next level when the current level cannot satisfy the requirement.

1. Semantic token class — `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border` …
2. Tailwind utility class — `rounded-xl`, `font-medium`, `leading-relaxed` …
3. Tailwind arbitrary value — `text-[0.88rem]`, `w-[420px]`, `leading-[1.55]` … ← **this is still token-governed, not inline style**
4. `style={{ ... }}` — last resort, only for runtime-computed values

Never use `style={{ fontSize: '...' }}` when `text-[...]` works. Never use `style={{ color: '#3D5A3E' }}` when `text-primary` works. Never pass `fontFamily` as a JS variable — use the global font defined in `tailwind-luckee.css`. See `references/inline-style-policy.md` for the full conversion table.
