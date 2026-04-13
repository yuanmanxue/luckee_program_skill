# Layout & Surfaces 布局与表面规范

## Spacing (间距与栅格)

Luckee uses an 8px base grid system for consistent rhythm.

| Token | Pixel Value | Usage Example |
| --- | --- | --- |
| **4xs** | `2px` | Icon to text spacing |
| **3xs** | `4px` | Tight element stacking |
| **2xs** | `8px` | Default gap between small items |
| **xs** | `12px` | Small padding |
| **sm** | `16px` | Standard container padding |
| **md** | `24px` | Section padding, card gaps |
| **lg** | `32px` | Large spacing |
| **xl** | `48px` | Section margins |
| **2xl** | `64px` | Major section breaks |

### Breakpoints
- **sm**: `640px`
- **md**: `768px`
- **lg**: `1024px`
- **xl**: `1200px`
- **2xl**: `1400px`

## Border Radius (圆角)

Corners define the organic feel of Luckee UI. Larger elements get softer curves.

| Value | Usage | Tailwind Class |
| --- | --- | --- |
| `0px` | Full bleed sections | `rounded-none` |
| `4px` | Checkboxes, tiny badges | `rounded-sm` |
| `8px` | Small tooltips, inner containers | `rounded-md` |
| `12px` | Standard dialogs, nested cards | `rounded-lg` |
| `16px` | **Input fields**, dropdown menus | `rounded-xl` |
| `20px` | **Main cards**, feature blocks, modals | `rounded-2xl` |
| `9999px` | **Buttons**, pill tags, avatars | `rounded-full` |

## Shadows & Elevation (阴影与层级)

Shadows in Luckee are diffused and layered, never harsh. They provide natural depth.

| Level | CSS Box Shadow | Description & Usage |
| --- | --- | --- |
| **Level 0** | `none` | Flat surface. Used for list items and secondary containers. |
| **Level 1** | `0 2px 8px rgba(0,0,0,0.04)` | Subtle hover state. |
| **Level 2** | `0 4px 24px rgba(0,0,0,0.06)` | **Main Cards**. Used for primary content blocks and feature cards. |
| **Level 3** | `0 8px 40px rgba(0,0,0,0.1)` | **Modals & Dialogs**. Floating UI elements. |
| **Brand CTA** | `0 8px 30px rgba(61,90,62,0.35)` | **Primary Buttons**. Green-tinted shadow for high-emphasis actions. |

## Surface Styles (表面样式)

### 1. Flat Card (扁平卡片)
Used for secondary content or list items.
- **Background**: `#FFFFFF`
- **Border**: `1px solid rgba(0,0,0,0.07)`
- **Shadow**: None
- **Radius**: `20px` (`rounded-2xl`)

### 2. Elevated Card (抬升卡片)
Used for main content blocks, feature highlights.
- **Background**: `#FFFFFF`
- **Border**: `1px solid rgba(0,0,0,0.05)`
- **Shadow**: `0 4px 24px rgba(0,0,0,0.06)`
- **Radius**: `20px` (`rounded-2xl`)

### 3. Glassmorphism Card (毛玻璃卡片)
Used for overlays, mega-menus, or sticky headers.
- **Background**: `rgba(255,255,255,0.65)`
- **Backdrop Filter**: `blur(24px)`
- **Border**: `1px solid rgba(255,255,255,0.5)`
- **Shadow**: `0 8px 40px rgba(0,0,0,0.08)`
- **Radius**: `20px` (`rounded-2xl`)
