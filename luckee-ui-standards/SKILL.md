---
name: luckee-ui-standards
description: "Complete design system and UI standards for the Luckee frontend. Contains strict specifications for typography, color palette, spacing, shadows, border radii, component variants, and a ready-to-use Tailwind v4 theme file that maps Figma tokens to CSS custom properties. Use this skill when building, refactoring, or theming UI components."
---

# Luckee UI Standards

## Overview

This skill defines the official visual language and design system for the **Luckee** project. It is based on the `luckee-ui` Figma Make prototype and has been engineered to integrate directly with the `luckee_frontend` repository's Tailwind v4 + CSS custom property architecture.

**Core Aesthetic:** Luckee's visual identity is organic, calm, and professional. It uses a low-saturation earthy color palette (Forest Green `#3D5A3E` and Oat Cream `#FAF8F4`), paired with elegant serif headings (`Instrument Serif`) and clean sans-serif body text (`Montserrat`). Elements feature soft, large border radii and subtle, layered shadows rather than harsh borders.

## Non-Negotiable UI Rules

| Area | Rule |
| --- | --- |
| **Typography** | MUST use `Instrument Serif` for headings (H1-H3) and `Montserrat` for all body text, labels, and UI controls. Weight `300` for body, `400` for labels, `500` for buttons. |
| **Color Palette** | Brand primary is **Forest Green** (`#3D5A3E` / HSL `122 19% 30%`). Backgrounds use **Oat Cream** (`#FAF8F4` / HSL `40 25% 97%`). NEVER use pure black or pure white for text; use `#2D2D2D` and `#888888`. |
| **Border Radius** | Buttons and tags: `rounded-full` (9999px). Cards and modals: `rounded-xl` (20px). Inputs: `rounded-lg` (16px). |
| **Shadows** | Soft and organic only. Brand CTA buttons MUST use green-tinted shadow `0 4px 16px rgba(61,90,62,0.25)`. |
| **Borders** | Very subtle: `1px solid rgba(0,0,0,0.06)`. Focus rings: `0 0 0 3px rgba(61,90,62,0.08)`. |
| **Icons** | `lucide-react`, default `20px`, `strokeWidth: 1.5`. |
| **Motion** | `ease-out` 150ms for micro-interactions, `ease-in-out` 300ms for layout. No bounce/elastic. |

## Architecture: How Tokens Flow

The `luckee_frontend` project uses a **two-layer token architecture**. Understanding this is critical for safe, minimal-cost style changes:

```
Layer 1 (Source of Truth)          Layer 2 (Tailwind Bridge)         Layer 3 (Components)
─────────────────────────          ─────────────────────────         ────────────────────
:root {                            @theme {                          <button className="
  --primary: 122 19% 30%;    →      --color-primary:            →     bg-primary
  --radius: 16px;                      hsl(var(--primary));            text-primary-foreground
}                                    --radius-lg: var(--radius);       rounded-full
                                   }                                 " />
```

**Key insight:** You only need to change **Layer 1** (the `:root` CSS variables) to transform the entire app's appearance. Layer 2 and Layer 3 are already wired correctly in 87% of the codebase.

## Quick Start: Applying the Theme

A ready-to-use theme file is provided at `references/tailwind-luckee.css`. To apply it:

1. Copy `tailwind-luckee.css` to `src/style/` in the `luckee_frontend` repository.
2. In `src/main.tsx`, change the import:
   ```diff
   - import './style/tailwind.css';
   + import './style/tailwind-luckee.css';
   ```
3. Add Google Fonts to `index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
   ```
4. Done. All components using `bg-primary`, `text-foreground`, `rounded-lg` etc. will automatically adopt the Luckee design.

**Rollback:** Simply revert the import in `src/main.tsx` to restore the previous theme. Zero component changes needed.

## Implementation References

| Reference | Contents |
| --- | --- |
| `references/tailwind-luckee.css` | **Ready-to-use** Tailwind v4 theme file with all Luckee tokens mapped to HSL CSS variables (light mode only). |
| `references/token-mapping-strategy.md` | Detailed HEX→HSL conversion table, radius mapping, and 4-step migration execution plan. |
| `references/typography-and-colors.md` | Full type scale (Display→Eyebrow), 50-900 shade palettes for Forest Green, Oat, Neutral, and Semantic colors. |
| `references/layout-and-surfaces.md` | 8px spacing grid, border radius mapping, 4-level shadow system, 3 card surface styles (Flat, Elevated, Glass). |
| `references/components-form-and-button.md` | Button variants (Primary/Secondary/Ghost/Danger) × 3 sizes × 4 states. Input state matrix (6 states with exact CSS). |
| `references/components-feedback.md` | Modal anatomy, 4 Toast variants, Notification cards, Progress indicators. |
| `references/prompt.md` | Chinese usage guide with current `luckee_frontend` scenarios and ready-to-copy Claude prompts. |

## Testing & Validation Checklist

After applying the theme, verify these critical checkpoints:

| Check | How to Verify | Expected Result |
| --- | --- | --- |
| Primary CTA color | Click any main action button | Forest Green `#3D5A3E` background |
| Page background | Open any page | Warm Oat Cream `#FAF8F4`, not cold grey |
| Heading font | Inspect any `<h1>`-`<h3>` | `Instrument Serif` in computed style |
| Body font | Inspect any `<p>` | `Montserrat` weight 300 |
| Card corners | Inspect any card | `border-radius: 20px` |
| Button corners | Inspect any button | `border-radius: 9999px` |
| Focus ring | Tab to any input | Green ring `rgba(61,90,62,0.08)` |

## Known Migration Hotspots

These 5 files contain hardcoded colors that bypass the token system and need manual attention:

| File | Issue | Fix |
| --- | --- | --- |
| `components/base/ErrorBoundary/index.tsx` | Hardcoded `#8b5cf6`, `#d32f2f` | Replace with `bg-primary`, `text-destructive` |
| `components/cbm/CapabilitiesDialog/index.tsx` | Hardcoded `#F0B100` gold | Define as `--color-luckee-gold` or keep as brand accent |
| `components/cbm/InvitationCodeDialog/index.tsx` | Hardcoded `#9333ea` purple | Replace with `bg-primary` or define as accent |
| `components/chat-render/CardPanel/index.tsx` | Hardcoded `rgba(34,197,94,0.12)` | Replace with `bg-success-bg` or `bg-accent/10` |
| `components/chat-render/CollapsePanel/index.tsx` | Same as above | Same fix |
