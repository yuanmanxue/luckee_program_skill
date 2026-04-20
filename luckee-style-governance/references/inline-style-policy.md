# Inline Style Policy

Use this reference before removing `style={{ ... }}` mechanically.

## Core Rule

Keep inline style only when the value is genuinely determined at runtime and cannot be expressed safely through the existing token and utility system.

## Style Priority Decision Chain

Before writing any style, always follow this order. Move to the next level only when the current level cannot satisfy the requirement.

```
1. Semantic token class       bg-primary, text-foreground, border-border, text-muted-foreground ...
2. Tailwind utility class     rounded-xl, shadow-sm, font-medium, leading-relaxed ...
3. Tailwind arbitrary value   text-[0.88rem], w-[420px], leading-[1.55], text-[#3D5A3E] ...
4. inline style               style={{ ... }}   ← last resort only
```

**Tailwind arbitrary values count as token-governed styling.** They are not inline styles. Use `text-[0.88rem]` instead of `style={{ fontSize: '0.88rem' }}`. Use `w-[420px]` instead of `style={{ width: 420 }}`.

**Inline style is only justified when:**
- The value is computed from runtime data (e.g., chart bar height, progress width, carousel translateX)
- The value changes dynamically based on props or state
- The Tailwind arbitrary value would produce an unreadable class explosion

If none of the above apply, the style must move to level 1, 2, or 3.

## Common Conversions

| Old inline style | Correct replacement |
| --- | --- |
| `style={{ color: '#3D5A3E' }}` | `className='text-primary'` |
| `style={{ color: '#2D2D2D' }}` | `className='text-foreground'` |
| `style={{ color: '#999' }}` | `className='text-muted-foreground'` |
| `style={{ color: '#FAF8F4' }}` | `className='text-primary-foreground'` |
| `style={{ backgroundColor: '#3D5A3E' }}` | `className='bg-primary'` |
| `style={{ fontSize: '0.88rem' }}` | `className='text-[0.88rem]'` |
| `style={{ fontSize: '2.2rem' }}` | `className='text-[2.2rem]'` |
| `style={{ fontWeight: 500 }}` | `className='font-medium'` |
| `style={{ fontWeight: 700 }}` | `className='font-bold'` |
| `style={{ lineHeight: 1.55 }}` | `className='leading-[1.55]'` |
| `style={{ lineHeight: 1 }}` | `className='leading-none'` |
| `style={{ fontFamily: serif }}` | Remove — use global font from `tailwind-luckee.css` |
| `style={{ borderRadius: '24px' }}` | `className='rounded-[24px]'` |
| `style={{ padding: '48px 40px' }}` | `className='px-10 py-12'` |
| `style={{ whiteSpace: 'nowrap' }}` | `className='whitespace-nowrap'` |

## Allowed vs Disallowed

| Type | Keep inline style? | Notes |
| --- | --- | --- |
| Dynamic width/height from runtime data | Usually yes | Example: chart bar height, progress width |
| Dynamic transform/translate values | Usually yes | Example: carousel translateX based on active index |
| Dynamic z-index from stacking logic | Usually yes | Keep only when required by runtime ordering |
| Color, background, border, shadow | Usually no | Move to token class or Tailwind arbitrary value |
| Font size, font weight, line height | Usually no | Move to Tailwind utility or arbitrary value |
| Font family | No | Use global font defined in `tailwind-luckee.css`; do not pass as a JS variable |
| Padding, margin, border radius | Usually no | Move to Tailwind utility or arbitrary value |
| Static width/height | Usually no | Move to utilities unless a special layout reason exists |

## Decision Test

Before keeping inline style, ask all three questions.

1. Is this value computed from runtime data?
2. Would moving it to classes create a large unreadable class explosion?
3. Would extracting it to a variant or wrapper reduce repetition?

If the answer to question 1 is **no**, default to refactoring it out.

## Typical Refactor Targets

| Pattern | Better home |
| --- | --- |
| Hardcoded colors in business components | semantic token class (`text-primary`, `bg-muted`) |
| Non-standard font sizes | Tailwind arbitrary value (`text-[0.88rem]`) |
| Repeated card padding/radius/border style | shared card wrapper or primitive variant |
| Repeated tag or badge decoration | shared badge/status component |
| Repeated dialog content spacing and footer tone | shared dialog shell or dialog subcomponents |

## Typical Safe Exceptions

These often remain as inline style even in a clean codebase.

| Pattern | Reason |
| --- | --- |
| chart bar height percentage | driven by data values |
| progress bar width percentage | driven by data values |
| slider/carousel transform | driven by current index |
| avatar size from a prop | acceptable if prop-driven and isolated |
| `--css-variable` injection via style | when passing a CSS custom property value to a child element |

## Review Checklist

When reviewing a file with inline style, label each occurrence as one of the following.

| Label | Meaning |
| --- | --- |
| `remove-now` | purely visual, static, easy to convert |
| `keep-runtime` | runtime numeric value, justified |
| `extract-shared` | repeated pattern that should become a primitive or wrapper |
| `needs-judgment` | mixed case; inspect nearby usage before changing |

## Recommendation for Coding Agents

When reporting inline-style cleanup, always include a short table:

| file | occurrence | label | action |
| --- | --- | --- | --- |
| `path/to/file.tsx` | `style={{ ... }}` summary | `remove-now` / `keep-runtime` / `extract-shared` / `needs-judgment` | what to do |

This prevents random cleanup and keeps the migration auditable.
