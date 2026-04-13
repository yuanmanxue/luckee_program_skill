# Token Mapping & Migration Strategy

## 1. The Challenge

The `luckee_frontend` repository currently uses a Tailwind v4 setup with CSS custom properties defined in **HSL color space** (e.g., `--primary: 222 47% 11%`). The active theme is located in `src/style/tailwind.css` and defaults to a "Deep Grey" aesthetic.

However, the official Luckee design system (`luckee-ui-standards`) is defined in **HEX/RGBA** with a "Forest Green / Oat Cream" aesthetic. 

Because 87% of the components in the repository (34 out of 39 files) already correctly use semantic Tailwind classes (like `bg-primary`, `text-foreground`, `rounded-lg`), **we do NOT need to rewrite all components**. We only need to map the new design system tokens into the existing Tailwind theme structure.

## 2. Single Source of Truth Mapping

To achieve a low-cost, highly maintainable migration, we must update the root CSS variables in `src/style/tailwind.css` to match the new design system. 

Since Tailwind v4 `hsl()` functions require HSL values without the `hsl()` wrapper (e.g., `120 20% 50%`), we must convert the brand HEX colors to HSL.

### Color Mapping Table (HEX to HSL)

| Semantic Token | Design System HEX | Converted HSL Value | Tailwind Usage |
| --- | --- | --- | --- |
| `--background` | `#FAF8F4` (Oat Cream) | `40 25% 97%` | `bg-background` |
| `--foreground` | `#2D2D2D` (Neutral 900) | `0 0% 18%` | `text-foreground` |
| `--card` | `#FFFFFF` | `0 0% 100%` | `bg-card` |
| `--card-foreground`| `#2D2D2D` | `0 0% 18%` | `text-card-foreground`|
| `--popover` | `#FFFFFF` | `0 0% 100%` | `bg-popover` |
| `--popover-foreground`| `#2D2D2D` | `0 0% 18%` | `text-popover-foreground`|
| `--primary` | `#3D5A3E` (Forest Green)| `122 19% 30%` | `bg-primary` |
| `--primary-foreground`| `#FAF8F4` | `40 25% 97%` | `text-primary-foreground`|
| `--secondary` | `#F5F3EF` (Input Bg) | `40 20% 95%` | `bg-secondary` |
| `--secondary-foreground`|`#3D5A3E` | `122 19% 30%` | `text-secondary-foreground`|
| `--muted` | `#F0F0F0` | `0 0% 94%` | `bg-muted` |
| `--muted-foreground`| `#888888` | `0 0% 53%` | `text-muted-foreground`|
| `--accent` | `#D9E8DA` (Green 100) | `124 28% 88%` | `bg-accent` |
| `--accent-foreground`| `#1C2B1D` (Green 900)| `124 21% 14%` | `text-accent-foreground`|
| `--destructive` | `#DC2626` | `0 72% 51%` | `bg-destructive` |
| `--destructive-foreground`|`#FFFFFF` | `0 0% 100%` | `text-destructive-foreground`|
| `--border` | `rgba(0,0,0,0.07)` | `0 0% 0%` (opacity handled by TW)| `border-border` |
| `--input` | `rgba(0,0,0,0.08)` | `0 0% 0%` | `border-input` |
| `--ring` | `#3D5A3E` | `122 19% 30%` | `ring-ring` |

### Radius Mapping Table

The design system requires much larger border radii than the current `6px` default.

| Token | Current Value | New Value | Usage |
| --- | --- | --- | --- |
| `--radius` | `6px` | `16px` | Inputs, Selects (`rounded-xl` in design) |
| `--radius-lg` | `var(--radius)` | `20px` | Cards, Modals (`rounded-2xl` in design) |
| `--radius-md` | `calc(...)` | `12px` | Inner containers (`rounded-lg` in design)|
| `--radius-sm` | `calc(...)` | `8px` | Small tooltips (`rounded-md` in design) |

*Note: Buttons in the design system are fully rounded (`9999px`). The `Button` component in `src/components/ui/button.tsx` should be updated to use `rounded-full` instead of `rounded-[var(--radius)]`.*

## 3. Dark Mode Strategy

The Figma design system currently lacks a defined Dark Mode. However, the frontend project uses `data-ad-color-scheme="dark"` to toggle themes.

**Recommendation:** Do not remove the dark mode selector. Instead, generate a "Dark Forest" palette that inverses the lightness of the Oat Cream and Forest Green colors, ensuring the app doesn't break when users switch themes.

## 4. Migration Execution Plan (Minimizing Risk)

If you ask the AI to "apply the Luckee design system", use the following step-by-step prompt strategy to ensure minimal disruption:

### Step 1: Update the Root Tokens (Low Risk, High Impact)
Modify `src/style/tailwind.css` to replace the `:root` variables with the HSL values mapped above. Update the `--radius` variables in the `@theme` block. This single change will instantly update 87% of the app's colors and curves.

### Step 2: Update the Button Primitive (Medium Risk)
Modify `src/components/ui/button.tsx`.
- Change the base class from `rounded-[var(--radius)]` to `rounded-full`.
- Update the shadow classes to match the brand CTA shadow (`shadow-[0_4px_16px_rgba(61,90,62,0.25)]`).

### Step 3: Update Typography (Medium Risk)
Modify `src/style/tailwind.css` or `globals.css` to import `Instrument Serif` and `Montserrat` from Google Fonts. Update the `@layer base` typography rules to apply these fonts to `h1`-`h6` and `body`.

### Step 4: Clean Up Hardcoded Colors (Manual Audit)
Search for the 5 files containing hardcoded hex colors (e.g., `ErrorBoundary/index.tsx` uses `#8b5cf6` and `#d32f2f`). Refactor these to use the new semantic Tailwind classes (e.g., `bg-primary` and `text-destructive`).
