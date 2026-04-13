# Form & Button Components 表单与按钮组件规范

## Buttons (按钮)

Buttons in Luckee are always fully rounded (`rounded-full`) and use organic, soft shadows. The primary CTA uses the brand Forest Green.

### Variants

| Variant | Background | Text Color | Border | Shadow | Usage |
| --- | --- | --- | --- | --- | --- |
| **Primary** | `#3D5A3E` | `#FAF8F4` | None | `0 4px 16px rgba(61,90,62,0.25)` | Main actions, high emphasis. |
| **Secondary** | `transparent` | `#3D5A3E` | `1px solid rgba(61,90,62,0.25)` | None | Supporting actions, medium emphasis. |
| **Ghost / Text** | `transparent` | `#888888` (Hover `#3D5A3E`) | None | None | Minimal actions, inline controls. |
| **Danger** | `#DC2626` | `#FFFFFF` | None | `0 4px 16px rgba(220,38,38,0.2)` | Destructive actions (Delete, Remove). |

### Sizes

| Size | Padding (X / Y) | Font Size | Height | Usage |
| --- | --- | --- | --- | --- |
| **Large** | `px-10 py-3.5` | `1.05rem` | 52px | Hero sections, major page CTAs. |
| **Medium** | `px-6 py-2.5` | `0.82rem` | 40px | Standard forms, dialog actions. |
| **Small** | `px-4 py-1.5` | `0.75rem` | 32px | Tables, tight spaces, tags. |

### Interaction States

- **Default**: Base styles applied.
- **Hover**: `transform: translateY(-1px)` and enhanced shadow (e.g., Primary shadow becomes `0 6px 24px rgba(61,90,62,0.35)`).
- **Press / Active**: `transform: scale(0.97)` and reduced shadow (e.g., Primary shadow becomes `0 2px 8px rgba(61,90,62,0.2)`).
- **Disabled**: `opacity: 0.4`, `cursor: not-allowed`, no shadow or transform.

---

## Form Inputs (表单输入)

Inputs in Luckee are defined by a light cream background (`#F5F3EF`), subtle borders, and a distinct green focus ring. They are slightly taller and more rounded than default shadcn inputs.

### Base Input Anatomy

- **Radius**: `16px` (`rounded-xl`)
- **Height / Padding**: `py-3 px-4` (approx 44-48px height)
- **Font**: `0.85rem`, Weight `300` (Montserrat)
- **Text Color**: `#2D2D2D`

### State Matrix

| State | Background | Border | Box Shadow (Ring) | Text Color |
| --- | --- | --- | --- | --- |
| **Default** | `#F5F3EF` | `1px solid rgba(0,0,0,0.08)` | None | `#2D2D2D` |
| **Hover** | `#F0EDE7` | `1px solid rgba(0,0,0,0.14)` | None | `#2D2D2D` |
| **Focus** | `#F5F3EF` | `1px solid rgba(61,90,62,0.4)` | `0 0 0 3px rgba(61,90,62,0.08)` | `#2D2D2D` |
| **Disabled** | `#F0F0F0` | `1px solid rgba(0,0,0,0.04)` | None | `#BBBBBB` |
| **Error** | `#FEF2F2` | `1px solid rgba(220,38,38,0.35)` | `0 0 0 3px rgba(220,38,38,0.06)` | `#2D2D2D` |
| **Success** | `#ECFDF5` | `1px solid rgba(16,185,129,0.35)` | `0 0 0 3px rgba(16,185,129,0.06)` | `#2D2D2D` |

### Labels and Helper Text

- **Field Label**: `0.78rem`, `#555555`, Weight `400`. Margin bottom `6px`. Required asterisks are `#DC2626`.
- **Helper Text**: `0.72rem`, `#999999`, Weight `400`. Margin top `6px`. Error helper text uses `#DC2626`.

### Select Dropdowns

- **Trigger**: Uses the exact same state matrix as text inputs.
- **Dropdown Menu**: Background `#FFFFFF`, Border `1px solid rgba(0,0,0,0.08)`, Shadow `0 8px 32px rgba(0,0,0,0.08)`, Radius `16px` (`rounded-xl`).
- **Options**: Padding `px-4 py-2.5`, Font `0.82rem`.
- **Option Hover**: Background `rgba(61,90,62,0.06)`.
- **Option Selected**: Text `#3D5A3E`, Weight `500`, Background `rgba(61,90,62,0.05)`. Includes a green Check icon.
