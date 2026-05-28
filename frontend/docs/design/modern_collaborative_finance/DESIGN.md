---
name: Modern Collaborative Finance
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#585f6c'
  on-secondary: '#ffffff'
  secondary-container: '#dce2f3'
  on-secondary-container: '#5e6572'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dce2f3'
  secondary-fixed-dim: '#c0c7d6'
  on-secondary-fixed: '#151c27'
  on-secondary-fixed-variant: '#404754'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-title:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  card-title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-main:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-metadata:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  currency-lg:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  currency-sm:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 20px
  gutter: 12px
---

## Brand & Style

The design system is anchored in the principles of **Modern Functionalism**. Designed specifically for the student demographic, it prioritizes clarity, shared responsibility, and financial transparency. The aesthetic is intentionally minimalist to reduce the cognitive load associated with money management, using a "data-first" approach where information hierarchy is the primary driver of the interface.

The emotional response should be one of calm reliability. By stripping away unnecessary ornamentation and focusing on high-contrast utility, the UI fosters a sense of control and trust. This is a tool, not a toy; it is professional enough to handle finances but modern enough to feel native to a mobile-first generation.

## Colors

The palette for this design system uses a high-action Indigo as the primary driver for all interactive elements. To ensure financial transparency, a strict semantic color language is applied: **Emerald Green** specifically denotes positive cash flow and credits, while **Vivid Red** is reserved exclusively for debits and critical alerts.

Neutral tones are pulled from a cool-grey spectrum to maintain a "Modern" feel without the harshness of pure black. Secondary tags for categorization utilize a distinct Blue/Amber split to provide immediate visual scannability between "Needs" (Essential) and "Wants" (Leisure).

## Typography

This design system utilizes **Inter** for all primary interface text to ensure maximum readability and a neutral, systematic tone. Headlines are set with a heavy weight to anchor sections and provide a clear entry point for the eye.

To differentiate financial data from descriptive text, **Space Grotesk** is introduced for currency values. Its geometric and slightly technical nature emphasizes the "collaborative/modern" tech aspect of the product. Use the boldest weights for primary balances and medium weights for transaction lists to maintain a clean, tabular feel.

## Layout & Spacing

The system operates on an 8px grid with a 4px baseline for micro-adjustments. The layout philosophy follows a **fixed-margin fluid grid**: screens maintain a consistent 20px horizontal margin on mobile devices, while internal components utilize 16px (md) spacing for standard grouping and 12px (gutter) for card-to-card relationships.

Vertical rhythm should be strictly enforced; use 24px (lg) spacing to separate distinct functional modules (e.g., the transition from "Current Balance" to "Recent Transactions"). This generous use of white space reinforces the minimalist brand identity.

## Elevation & Depth

Visual hierarchy in this design system is achieved through **Tonal Layering** combined with soft, ambient shadows. There are three distinct levels of depth:
1.  **Level 0 (Background):** The `#F9FAFB` base layer.
2.  **Level 1 (Cards/Surfaces):** Pure white `#FFFFFF` with a very soft shadow (0px 4px 12px, 5% opacity black). This is the primary container for all content.
3.  **Level 2 (Active States/Modals):** A slightly more pronounced shadow (0px 8px 24px, 10% opacity black) to indicate temporary or high-priority overlays.

Avoid heavy gradients or skeuomorphism. Depth should feel like thin sheets of paper stacked in a clean, physical space.

## Shapes

The design system adopts a **Rounded** shape language to soften the functionalist aesthetic, making the financial management experience feel approachable rather than clinical.

A standard radius of 12px is applied to all primary cards and containers. Buttons and inputs maintain consistent rounded corners to ensure a cohesive tactile language across the application. Interactive elements like tags and chips may use a full-pill radius to distinguish them from structural layout containers.

## Components

### Buttons
Primary buttons are 48px in height, using a solid Indigo background with white text. Secondary buttons utilize an Indigo outline and 1px border. Always use title-case for button labels.

### Inputs
Text inputs utilize the `#F3F4F6` background to distinguish them from the pure white card surfaces. Upon focus, the input should transition to a 2px Indigo border to provide clear interactive feedback.

### Cards
Cards are the primary organizational unit. They must feature a 12px border radius and the Level 1 shadow. Content inside cards should follow the 16px internal padding rule.

### Chips & Tags
Tags for "Essential" and "Leisure" should use low-opacity backgrounds (10-15%) of their respective colors with full-opacity text to maintain a modern, transparent look without overwhelming the user.

### List Items
Transactions should be displayed in a clean list format with a 1px border-bottom (`#F3F4F6`) separating items. Icons for transactions (Cap for education, Tag for shopping) should be minimalist 24px line icons in the Neutral grey.