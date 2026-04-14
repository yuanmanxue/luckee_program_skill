# Inline Style Policy

Use this reference before removing `style={{ ... }}` mechanically.

## Core Rule

Keep inline style only when the value is genuinely determined at runtime and cannot be expressed safely through the existing token and utility system.

## Allowed vs Disallowed

| Type | Keep inline style? | Notes |
| --- | --- | --- |
| Dynamic width/height from runtime data | Usually yes | Example: chart bar height, progress width |
| Dynamic transform/translate values | Usually yes | Example: carousel translateX based on active index |
| Dynamic z-index from stacking logic | Usually yes | Keep only when required by runtime ordering |
| Color, background, border, shadow | Usually no | Move to token, utility classes, or variants |
| Font size, font weight, line height | Usually no | Move to typography classes or shared component variants |
| Padding, margin, border radius | Usually no | Move to Tailwind utility classes or wrappers |
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
| Hardcoded colors in business components | semantic tokens or utility classes |
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
