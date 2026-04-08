# UI/UX Pro Max - Design Intelligence Skill

## Overview

UI/UX Pro Max is a comprehensive design intelligence system providing structured guidance for web and mobile application interfaces. The skill encompasses 50+ design styles, 161 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 10 technology stacks.

## Core Purpose

This skill applies when tasks involve "UI structure, visual design decisions, interaction patterns, or user experience quality control." It must be invoked for designing pages, creating components, choosing visual systems, reviewing UI code, or implementing navigation and animations.

## Ten Priority Categories

The guidance is organized by impact level:

1. **Accessibility (CRITICAL)** — Contrast ratios, focus states, alt text, keyboard navigation
2. **Touch & Interaction (CRITICAL)** — Target sizing (44×44px minimum), spacing, feedback mechanisms
3. **Performance (HIGH)** — Image optimization, lazy loading, layout stability (CLS < 0.1)
4. **Style Selection (HIGH)** — Consistency with product type, SVG icons, platform adaptation
5. **Layout & Responsive (HIGH)** — Mobile-first design, viewport configuration, breakpoint systems
6. **Typography & Color (MEDIUM)** — Line height (1.5–1.75), semantic tokens, accessible color pairs
7. **Animation (MEDIUM)** — Duration (150–300ms), transform-based performance, reduced-motion support
8. **Forms & Feedback (MEDIUM)** — Visible labels, error placement, progressive disclosure
9. **Navigation Patterns (HIGH)** — Bottom nav limits (≤5 items), deep linking, state preservation
10. **Charts & Data (LOW)** — Accessible color choices, legend visibility, responsive simplification

## Workflow

**Step 1:** Analyze user requirements (product type, audience, style keywords)

**Step 2:** Generate design system using the command:
```
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system
```

**Step 3:** Supplement with domain-specific searches as needed (style, color, typography, ux, chart)

**Step 4:** Apply stack-specific guidelines (React Native, etc.)

## Key Anti-Patterns

The skill explicitly identifies what to avoid: removing focus rings, icon-only buttons without labels, mixing design styles randomly, horizontal scroll on mobile, text below 12px, placeholder-only form labels, and decoration-only animations.

## Pre-Delivery Validation

Before implementation, verify no emoji icons are used as structural elements, touch targets meet minimums, contrast meets WCAG standards (4.5:1 for normal text), animations respect reduced-motion preferences, and safe areas are respected on mobile devices.
