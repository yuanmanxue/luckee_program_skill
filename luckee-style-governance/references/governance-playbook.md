# Governance Playbook

Use this reference when the task is broader than a single primitive change and you need the safest execution order.

## Recommended Order

| Step | Goal | Typical files |
| --- | --- | --- |
| 1 | Audit style debt | broad grep/search across `src/` |
| 2 | Align token and global theme | `src/style/*`, `src/main.tsx`, `index.html` |
| 3 | Stabilize primitives | `src/components/ui/button.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx`, `tabs.tsx`, `toast.tsx` |
| 4 | Normalize dialog consumers | `src/components/cbm/*Dialog*`, account/invitation/data-source dialogs |
| 5 | Clean visual inline styles | `ErrorBoundary`, `TextAvatar`, business panels with visual `style={{...}}` |
| 6 | Extract repeated shared UI | `src/components/ui/*`, light wrappers for badge/card/section shells |
| 7 | Align high-frequency business UI | `ChatArea`, `sidebar`, `chat-render/*` |
| 8 | Perform page-level polish | `src/pages/*` |
| 9 | Sweep hardcoded leftovers | grep hex/rgba/small radius/heavy shadows |

## Prioritization Rules

Classify findings before editing.

| Priority | Meaning | Examples |
| --- | --- | --- |
| P0 | Must fix first or later work will be repeated | wrong theme tokens, fragmented dialog shell, missing shared button/input/card language |
| P1 | Important consistency issue but not global blocker | business components with heavy hardcoded color styling |
| P2 | Local polish or cleanup | isolated spacing or one-off decorative mismatch |

## Known Hotspots

These hotspots often need manual attention because they bypass a clean token-only approach.

| Area | Why it is risky |
| --- | --- |
| `components/base/ErrorBoundary` | visual inline styles and hardcoded colors |
| `components/cbm/CapabilitiesDialog` | mixed accent colors, charts, repeated card fragments |
| `components/cbm/InvitationCodeDialog` | often keeps legacy accent styling |
| `components/chat-render/CardPanel` | business visual states often drift from shared card language |
| `components/chat-render/CollapsePanel` | same as above |
| `components/ui/sidebar` | layout, density, and panel tone often diverge from the target style |

## Small-Step Execution Pattern

For each step, follow this micro-loop.

1. Define one narrow goal.
2. List touched files only.
3. Reuse nearest existing patterns.
4. Implement the smallest coherent patch.
5. Validate touched files.
6. Commit immediately if stable.

## Commit Strategy

Prefer one commit per stable step.

| Commit Type | Example message |
| --- | --- |
| Token layer | `feat(skill): add governance references and token-first workflow` |
| Primitive cleanup | `feat(ui): normalize button and dialog foundations` |
| Inline-style cleanup | `refactor(ui): remove visual inline styles from error surfaces` |
| Dialog consumer alignment | `refactor(dialog): align capabilities dialog to shared shell` |

## Do Not Do This

Do not combine token changes, primitive rewrites, dialog cleanup, page alignment, and audit fixes into one giant patch. That makes visual regressions hard to isolate and hard to roll back.
