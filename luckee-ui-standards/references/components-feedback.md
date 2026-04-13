# Feedback & Overlay Components 反馈与浮层规范

## Modals & Dialogs (模态弹窗)

Modals in Luckee use a distinct, slightly tinted background and heavy, diffused shadows to separate them from the main content.

### General Anatomy

- **Overlay**: `rgba(250,248,244,0.85)` with `backdropFilter: blur(4px)`.
- **Card Background**: `#FAFAF8` (Info/Complex) or `#FFFBFB` (Danger).
- **Border Radius**: `20px` (`rounded-2xl`).
- **Shadow**: `0 32px 80px rgba(0,0,0,0.12)`.
- **Padding**: `px-8 pt-7 pb-8` for standard modals, `p-5` for smaller alerts.

### Typography

- **Eyebrow Label**: `0.65rem`, uppercase, letter spacing `0.1em`, weight `500`. Color `#bbb` or semantic color.
- **Title**: `Instrument Serif`, `1.05rem` - `1.4rem`, `#2D2D2D`, weight `400`.
- **Description**: `0.78rem` - `0.85rem`, `#888888`, weight `300`, line height `1.6`.

### Modal Actions

- Buttons are typically aligned right or full-width depending on the context.
- Primary actions use the Brand Forest Green CTA (`#3D5A3E`).
- Danger actions use Red (`#DC2626`).
- Cancel actions use Ghost/Text style (`#888888` text, transparent background).

---

## Global Messages / Toasts (全局提示)

Toasts are highly semantic and use tinted backgrounds and borders to immediately convey status. They do not use solid, saturated colors for the background.

### Anatomy

- **Border Radius**: `12px` (`rounded-xl`).
- **Padding**: `px-4 py-3`.
- **Text Size**: `0.82rem`, weight `400`.
- **Icon Size**: `18px`, `strokeWidth: 1.8`.

### Variants

| Type | Background | Border | Text Color | Icon Color | Icon Type |
| --- | --- | --- | --- | --- | --- |
| **Success** | `#ECFDF5` | `1px solid rgba(16,185,129,0.2)` | `#2D2D2D` | `#059669` | `CheckCircle2` |
| **Warning** | `#FFFBEB` | `1px solid rgba(217,119,6,0.2)` | `#2D2D2D` | `#D97706` | `AlertTriangle` |
| **Error** | `#FEF2F2` | `1px solid rgba(220,38,38,0.2)` | `#2D2D2D` | `#DC2626` | `AlertCircle` |
| **Info** | `#EFF6FF` | `1px solid rgba(37,99,235,0.2)` | `#2D2D2D` | `#2563EB` | `Info` |

---

## Notifications (通知提醒)

Notifications are larger than toasts and often contain a title, description, timestamp, and action.

- **Background**: `#FFFFFF`
- **Border**: `1px solid rgba(0,0,0,0.08)`
- **Shadow**: `0 4px 20px rgba(0,0,0,0.06)`
- **Radius**: `12px` (`rounded-xl`)
- **Padding**: `px-5 py-4`
- **Title**: `0.85rem`, `#2D2D2D`, weight `500`
- **Description**: `0.78rem`, `#888888`, weight `300`, line height `1.6`
- **Timestamp**: `0.65rem`, `#BBBBBB`, margin top `6px`

---

## Progress Indicators (进度条)

Progress bars in Luckee use thin tracks and semantic fill colors.

### Linear Progress

- **Track Background**: `rgba(0,0,0,0.06)`
- **Track Height**: `6px` (Thin) or `12px` (Thick)
- **Radius**: `rounded-full`
- **Fill Color**: `#3D5A3E` (Brand/Active), `#059669` (Success/Complete), `#DC2626` (Error).
- **Label**: `0.78rem`, `#555555`.
- **Value Text**: `0.72rem`, semantic color, weight `500`.
