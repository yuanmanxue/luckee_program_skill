---
name: luckee-ui-standards
description: "Design system and UI standards for the Luckee frontend. Contains strict specifications for typography, color palette, spacing, shadows, border radii, and component variants based on the official Figma Make design system. Use this skill when building or refactoring UI components to match the brand aesthetic."
---

# Luckee UI Standards

## Overview

This skill defines the official visual language and design system for the **Luckee** project. It is based on the `luckee-ui` Figma Make prototype. 

When you are asked to "style this like Luckee", "apply the brand design", or "refactor the UI to match the design system", you MUST strictly follow the tokens, scales, and component anatomies defined here.

**Core Aesthetic:**
Luckee's visual identity is organic, calm, and professional. It uses a low-saturation earthy color palette (Forest Green and Oat/Cream), paired with a mix of elegant serif headings (`Instrument Serif`) and clean sans-serif body text (`Montserrat`). Elements feature soft, large border radii (often `rounded-2xl` or `rounded-full`) and subtle, layered shadows rather than harsh borders.

## Non-Negotiable UI Rules

| Area | Rule |
| --- | --- |
| **Typography** | MUST use `Instrument Serif` for headings (Display, H1, H2, H3) and `Montserrat` for all body text, labels, and UI controls. |
| **Color Palette** | Brand primary is **Forest Green** (`#3D5A3E`). Backgrounds use **Cream/Oat** (`#FAF8F4`). NEVER use pure black (`#000000`) or pure white (`#FFFFFF`) for large text blocks; use `#2D2D2D` for primary text and `#888888` for secondary text. |
| **Border Radius** | Use large, soft corners. Buttons and tags MUST be fully rounded (`rounded-full` / `9999px`). Cards and modals MUST use `2xl` (`20px`). Inputs use `xl` (`16px`). |
| **Shadows** | Shadows must be soft and organic. Never use harsh, short-distance shadows. Brand CTA buttons MUST use a green-tinted shadow (`0 8px 30px rgba(61,90,62,0.3)`). |
| **Borders** | Borders are used sparingly and should be very subtle (e.g., `1px solid rgba(0,0,0,0.06)`). Focus states use a combination of a solid border and a translucent ring (e.g., `boxShadow: 0 0 0 3px rgba(61,90,62,0.08)`). |
| **Icons** | Use `lucide-react`. Default size is `20px` (md) with a `strokeWidth` of `1.5px`. |
| **Motion** | Use `ease-out` for micro-interactions (150ms) and `ease-in-out` for layout changes (300ms). Avoid bouncy or elastic easing. |

## Implementation References

To apply these standards correctly, read the detailed specifications in the `references/` directory:

| Reference | Contents |
| --- | --- |
| `references/typography-and-colors.md` | Exact hex codes for the 50-900 shade scales (Forest Green, Oat, Neutral, Semantic), type scale sizes, and font weights. |
| `references/layout-and-surfaces.md` | Spacing scale (8px grid), border radius mapping, shadow definitions, and card surface styling. |
| `references/components-form-and-button.md` | Exact CSS values for button variants (Primary, Secondary, Danger), input states (Default, Hover, Focus, Error), and select dropdowns. |
| `references/components-feedback.md` | Specifications for Modals, Toasts (Success, Warning, Error, Info), Notifications, and Progress indicators. |

## Tailwind Integration Note

When applying these styles in the `luckee_frontend` repository, prefer mapping these hex values and shadows to Tailwind v4 theme variables or arbitrary values (e.g., `bg-[#3D5A3E]`, `shadow-[0_8px_30px_rgba(61,90,62,0.3)]`, `rounded-[20px]`). Do not invent new Tailwind utility names unless defining them globally in the CSS.
