---
name: APU GreenBag
colors:
  surface: '#e9ffee'
  surface-dim: '#cadfd0'
  surface-bright: '#e9ffee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e3f9e9'
  surface-container: '#def3e3'
  surface-container-high: '#d8eede'
  surface-container-highest: '#d2e8d8'
  on-surface: '#0d1f15'
  on-surface-variant: '#3f4944'
  inverse-surface: '#22342a'
  inverse-on-surface: '#e0f6e6'
  outline: '#707974'
  outline-variant: '#bfc9c2'
  surface-tint: '#246a52'
  primary: '#004734'
  on-primary: '#ffffff'
  primary-container: '#186049'
  on-primary-container: '#93d8bb'
  inverse-primary: '#90d4b7'
  secondary: '#226d1b'
  on-secondary: '#ffffff'
  secondary-container: '#a4f391'
  on-secondary-container: '#27711f'
  tertiary: '#5f3300'
  on-tertiary: '#ffffff'
  tertiary-container: '#804700'
  on-tertiary-container: '#ffbd82'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf1d3'
  primary-fixed-dim: '#90d4b7'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#a6f693'
  secondary-fixed-dim: '#8bd97a'
  on-secondary-fixed: '#002200'
  on-secondary-fixed-variant: '#005302'
  tertiary-fixed: '#ffdcc1'
  tertiary-fixed-dim: '#ffb877'
  on-tertiary-fixed: '#2e1600'
  on-tertiary-fixed-variant: '#6c3a00'
  background: '#e9ffee'
  on-background: '#0d1f15'
  surface-variant: '#d2e8d8'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses active campus environmentalism through a warm, tactile, and modern mobile aesthetic. The brand communicates accountability, collective student action, and tangible reward without falling into sterile corporate sustainability tropes. 

### Aesthetic Philosophy
The visual direction blends **Tactile Modernism** with clean utility. It grounds modern interface patterns in organic, physical cues inspired by recycled kraft paper, vibrant botanical life, and collegiate energy:
- **Warm & Organic Tone**: Cream ivory and soft kraft tones replace harsh, sterile blue-whites, lending warmth and earthiness to the digital surface.
- **Active & Motivating**: Bright leaf greens and warm ochre accents inject vibrancy, elevating everyday actions (borrowing, returning, earning stamps) into celebratory milestones.
- **Approachable Collegiate Utility**: Large tap targets, friendly geometry, and scannable tracking states ensure effortless one-handed use during fast-moving campus cafe queues.

## Colors

The palette balances deep arboreal foundation tones with vibrant botanical accents and tactile paper-inspired neutrals to maintain WCAG AAA compliance and high outdoor readability across campus.

### Palette Architecture
- **Primary (`#186049` - Deep Forest Green)**: Anchors key interactive landmarks, navigation bars, bottom sheets, and dominant primary actions. Conveys trust, depth, and institutional longevity.
- **Secondary (`#4A943E` - Fresh Leaf Green)**: Drives eco-progress indicators, verification states, completed returns, and positive impact meters.
- **Tertiary (`#D98327` - Warm Ochre Gold)**: Accentuates rewards, loyalty stamps, badge unlock states, streak counters, and urgent drop-off timers.
- **Neutral Dark (`#14261C` - Deep Slate Pine)**: The foundational text and structural icon color, formulated with a deep pine undertone to harmonize with the primary hue while providing superior contrast against light backgrounds.
- **Sub-Neutral Dark (`#2D3E35` - Muted Pine)**: Reserved for supporting typography, captions, and secondary icons.
- **Surface Background (`#FAF9F5` - Crisp Off-White)**: Global mobile canvas background. Delivers crisp contrast while avoiding optic fatigue.
- **Kraft Accent Surface (`#ECE8AF` - Soft Kraft Cream)**: Featured card backgrounds, stamp card containers, and voucher highlights.
- **Borders & Dividers (`#E2DEC2` - Pressed Fiber)**: Subtle structural outlines on card surfaces and input strokes.

## Typography

The typography leverages **Plus Jakarta Sans** across all roles to achieve a balance of geometric precision and humanist warmth. 

### Hierarchical Guidelines
- **Metric Impact (`display-metric`, `display-lg`)**: Bold, tightly-spaced numbers highlight tree-saving metrics, grams of plastic offset, and earned discount point totals.
- **Section Headers (`headline-lg`, `headline-md`, `headline-sm`)**: Semi-bold to bold weights establish clear orientation in modal views and scan flows.
- **Body Content (`body-lg`, `body-md`, `body-sm`)**: Generous line heights ensure readability on mid-tier mobile screens during transit across campus.
- **Badges and Caps (`label-caps`)**: Uppercase tracking (0.08em) for micro-tier badges ("ECO CHAMPION", "DUE IN 2 DAYS", "VERIFIED DROP-OFF").

## Layout & Spacing

The layout system is tailored for an ergonomic, mobile-first campus utility app based on a standard 4-column fluid mobile layout that scales to an 8-column layout on tablets.

### Mobile Grid & Spatial Rhythm
- **Canvas Margins**: Set to `1rem` (16px) on mobile viewports to maximize usable screen real estate, expanding to `2rem` (32px) on tablets.
- **Vertical Flow**: A modular 8pt/0.5rem grid underpins all vertical rhythms.
  - Micro-gaps (`space-xs` = 4px, `space-sm` = 8px) pair titles with their metric subtitles or badge icons.
  - Component padding (`space-md` = 16px, `space-lg` = 24px) gives touch targets comfortable separation inside cards.
  - Section dividers (`space-xl` = 32px) delineate functional clusters (e.g., active rentals vs. reward tier progress).
- **Thumb Zone Design**: Primary navigation and the central QR scanner trigger remain anchored within the lower 35% of the mobile viewport.

## Elevation & Depth

Elevation eschews deep artificial drop-shadows in favor of warm, tinted atmospheric depth combined with tactile surface layering.

### Depth Levels
- **Level 0 (Flat / Canvas)**: Pure `#FAF9F5` background.
- **Level 1 (Soft Cards & Shelves)**: Tonal separation achieved via a 1px solid border of `#E2DEC2` combined with an ambient diffuse shadow: `0px 2px 8px rgba(20, 38, 28, 0.04)`.
- **Level 2 (Active Cards & Modals)**: Lifted state for interactive reward vouchers and return verification cards: `0px 8px 24px rgba(20, 38, 28, 0.08)`.
- **Level 3 (Floating Action Button & Bottom Bar)**: Elevated floating action buttons (FAB) and floating bottom bars receive an accent-tinted drop: `0px 12px 28px rgba(24, 96, 73, 0.22)`.
- **Scanner Backdrop / Scrim**: High-density forest overlay: `rgba(20, 38, 28, 0.85)` with a backdrop blur of `12px` to emphasize the central viewfinder reticle.

## Shapes

The interface embraces organic curvature without sacrificing visual structure.

### Curvature Tokens
- **Standard Components (`0.5rem` / 8px)**: Segmented controls, input fields, and drop-down selectors.
- **Containers & Cards (`1rem` to `1.5rem` / 16px to 24px)**: Reward cards, bag checkout summary modules, and bottom modal sheets utilize deep, welcoming radii.
- **Pill Elements (`9999px` / Full Rounded)**: Badges, progress pills, status tags, toggle chips, and standard button footprints.

## Components

### Buttons
- **Primary Action (Scan / Borrow / Confirm Return)**: Full-width or large pill buttons filled with Deep Forest Green (`#186049`), styled with white text (`#FAF9F5`), 16px vertical padding, and a subtle inner highlight.
- **Secondary (Redeem / Details)**: Pill button filled with Kraft Cream (`#ECE8AF`), text set in Deep Forest Green (`#186049`), with a 1px border of `#E2DEC2`.
- **Floating Scan Trigger (Center FAB)**: A circular 64px button elevated with a Deep Forest Green base, featuring a bold leaf/QR graphic in White, haloed by an ambient ring shadow.

### Chips & Pill Badges
- **Status Badges**:
  - *Active Borrowed*: `#FAF9F5` background, `#186049` text, 1px border of `#4A943E`.
  - *Expiring / Overdue Warning*: `#D98327` background at 15% opacity with solid `#D98327` text and clock icon.
  - *Returned / Complete*: Leaf Green tint (`#4A943E` at 12%) with solid `#4A943E` text and checkmark.
- **Filter Chips**: Pill-shaped filters for browsing eco-vendors and reward partners. Unselected states use an off-white fill with an `#E2DEC2` border; selected states use a solid `#186049` fill with white text.

### Cards
- **Impact & Metric Cards**: Clean `#FAF9F5` or `#ECE8AF` backgrounds with 20px border radius, featuring huge numeric displays (`display-metric`) in `#186049`, flanked by small eco-leaf badges and micro-progress bars.
- **Stamp & Reward Cards**: Featuring a simulated perforated edge on the right or bottom border (using dashed strokes or decorative punchouts). Displays circle stamp slots that transition from empty circles (dashed `#E2DEC2`) to filled golden seal stamps (`#D98327`).

### QR Scanner Reticle
- **Viewfinder**: Centered 260px × 260px square with 24px rounded outer corners. Framed by 3px solid corner brackets in Fresh Leaf Green (`#4A943E`).
- **Scan Beam**: Horizontal gradient line passing from `#4A943E` to transparent.
- **Reticle Instructions**: Pill container floating directly below the reticle filled with `rgba(20, 38, 28, 0.85)` holding white instructions in `label-md`.

### Form Inputs & Checkboxes
- **Input Fields**: 52px height, 12px radius, filled with `#FAF9F5`, bordered by `#E2DEC2`. On focus, transitions to a 2px border of `#186049`.
- **Eco Checkboxes**: 22px rounded squares (6px radius). When active, filled with `#186049` displaying a crisp off-white checkmark.