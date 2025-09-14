# Design Tokens (Draft)

## Color Palette
Primary (Violet): hsl(265 83% 60%)
Primary Dark Variant: hsl(265 83% 52%)
Secondary (Sky): hsl(192 94% 67%)
Accent (Pink): hsl(340 82% 67%)
Success: hsl(151 55% 45%)
Warning: hsl(43 96% 56%)
Danger: hsl(0 84% 60%)
Background Light: hsl(222 100% 99%)
Background Dark: hsl(230 30% 8%)
Card Light: hsl(0 0% 100%)
Card Dark: hsl(230 25% 14%)

Gradient: linear-gradient(135deg, hsl(265 83% 60%), hsl(192 94% 67%))

## Spacing Scale
2 4 6 8 12 16 20 24 32 40 48 56 64 (rem fractions via tailwind defaults)

## Radius
sm: 6px
md: 12px
lg: 18px
xl: 28px
full: 999px

## Elevation
--elevation-1: 0 2px 4px -1px rgba(20,20,40,.08), 0 1px 2px rgba(20,20,40,.04)
--elevation-2: 0 4px 14px -2px rgba(20,20,60,.12), 0 2px 6px rgba(20,20,50,.08)
--elevation-glow: 0 0 0 1px hsl(265 83% 60% / .3), 0 4px 24px -4px hsl(265 83% 60% / .45)

## Motion
Ease Standard: cubic-bezier(.4,.2,.2,1)
Ease Out: cubic-bezier(.16,1,.3,1)
Ease In: cubic-bezier(.7,0,.84,0)
Spring (Framer): { type: "spring", stiffness: 210, damping: 26, mass: 0.9 }
Quick Transition: 160ms
Medium Transition: 280ms
Slow Transition: 520ms

## Typography
Font: Inter / System
Display Weight: 700
Heading Weight: 600
Body Weight: 400–500
Mono: 'JetBrains Mono', ui-monospace, monospace (optional future)

## Component Patterns
Buttons: Elevated + gradient hover + subtle press scale.
Cards: Slight glass effect + subtle border + gradient edge accent.
Nav: Underline motion indicator + fading background on scroll.
Inputs: Focus ring with glow and 2px accent border.

## Accessibility
Contrast target: >= 4.5:1 for body text, >= 3:1 for large text.
Supports reduced motion via prefers-reduced-motion; fallbacks to opacity.

(Will evolve as we implement.)
