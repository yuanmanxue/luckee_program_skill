# Typography & Colors 字体与色彩规范

## Typography (字体排版)

Luckee uses a dual-font system. Headings are elegant and organic, while body text is clean and legible.

### Font Families
- **Headings (Display, H1-H3)**: `Instrument Serif`, serif. Weight: `400` (Regular).
- **Body & UI (Paragraphs, Labels, Buttons)**: `Montserrat`, sans-serif. Weights: `300` (Light), `400` (Regular), `500` (Medium).

### Type Scale
| Role | Font Family | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- | --- |
| **Display** | Instrument Serif | `3.4rem` | 400 | 1.15 | Hero primary heading |
| **H1** | Instrument Serif | `2.2rem` | 400 | 1.3 | Page title |
| **H2** | Instrument Serif | `1.8rem` | 400 | 1.3 | Section title |
| **H3** | Instrument Serif | `1.3rem` | 400 | 1.3 | Subsection title |
| **Body Large** | Montserrat | `1rem` | 300 | 1.6 | Lead paragraph |
| **Body Default** | Montserrat | `0.88rem` | 300 | 1.6 | Standard paragraph |
| **Body Small** | Montserrat | `0.78rem` | 300 | 1.6 | Helper text, secondary text |
| **Label** | Montserrat | `0.7rem` | 400 | 1.5 | Tags, small labels |
| **Eyebrow** | Montserrat | `0.65rem` | 500 | 1.5 | Uppercase category labels (tracking `0.1em`) |

## Color Palette (色彩体系)

### Core Brand Tokens
- `--bg-primary`: `#FAF8F4` (Oat Cream 100) - Main page background.
- `--bg-card`: `#FFFFFF` - Primary card and modal surface.
- `--bg-input`: `#F5F3EF` - Default input background.
- `--color-brand`: `#3D5A3E` (Forest Green 600) - Primary CTA and brand accents.
- `--text-primary`: `#2D2D2D` (Neutral 900) - Headings and primary body text.
- `--text-secondary`: `#888888` (Neutral 500) - Subtitles and secondary text.
- `--text-muted`: `#BBBBBB` - Disabled text, placeholders, and subtle borders.
- `--border-default`: `rgba(0,0,0,0.07)` - Standard subtle border.

### Shade Scales

**Forest Green (品牌主色)**
- 50: `#F0F5F0` (Tags bg)
- 100: `#D9E8DA`
- 200: `#B3D1B5`
- 300: `#8DBA90`
- 400: `#6A9E6D`
- 500: `#4E7E50`
- **600: `#3D5A3E` (Brand Primary CTA)**
- 700: `#324A33`
- 800: `#273A28`
- 900: `#1C2B1D`

**Oat / Cream (背景与表面)**
- 50: `#FEFDFB`
- **100: `#FAF8F4` (Page Bg)**
- 200: `#F5F1EA`
- 300: `#EDE8DF`
- 400: `#E2DCD1`
- 500: `#D4CEC3`
- 600: `#B8B2A7`
- 700: `#9A9489`
- 800: `#7A756C`
- 900: `#5A564F`

**Neutral (中性色)**
- 50: `#FAFAFA`
- 100: `#F0F0F0` (Disabled bg)
- 200: `#E0E0E0`
- 300: `#CCCCCC`
- 400: `#AAAAAA`
- 500: `#888888` (Secondary text)
- 600: `#666666`
- 700: `#555555`
- 800: `#3A3A3A`
- **900: `#2D2D2D` (Primary text)**

**Semantic Colors (语义色)**
- **Success**: Text `#059669` (600), Bg `#ECFDF5` (50), Border `#10B981` (500)
- **Warning**: Text `#D97706` (600), Bg `#FFFBEB` (50), Border `#F59E0B` (500)
- **Error**: Text `#DC2626` (600), Bg `#FEF2F2` (50), Border `#EF4444` (500)
- **Info**: Text `#2563EB` (600), Bg `#EFF6FF` (50), Border `#3B82F6` (500)
