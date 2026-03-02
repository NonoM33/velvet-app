/**
 * Velvet Design System v2.0
 * Premium train booking app - Apple HIG & Material Design 3 compliant
 */

// ============= COLOR PALETTE =============
// Sophisticated deep violet palette replacing candy pink
export const Colors = {
  // Primary Brand - Deep Violet (sophisticated, premium)
  primary: '#8B5CF6',        // Vivid violet
  primaryLight: '#A78BFA',   // Soft violet
  primaryDark: '#7C3AED',    // Deep violet
  primaryMuted: '#DDD6FE',   // Very light violet
  primaryGhost: 'rgba(139, 92, 246, 0.08)',

  // Secondary Brand - Refined Navy
  navy: '#1E1B4B',           // Deep indigo-navy
  navyLight: '#312E81',      // Lighter navy
  navyMuted: '#4338CA',      // Muted navy

  // Neutral Palette - Warm grays
  neutral50: '#FAFAFA',
  neutral100: '#F5F5F5',
  neutral200: '#E5E5E5',
  neutral300: '#D4D4D4',
  neutral400: '#A3A3A3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#FAFAFA',
  backgroundTertiary: '#F5F5F5',
  backgroundElevated: '#FFFFFF',
  backgroundGradientStart: '#FFFFFF',
  backgroundGradientEnd: '#FAF5FF',  // Very subtle violet tint

  // Surface & Cards
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#FAFAFA',
  cardBackground: '#FFFFFF',
  cardBorder: 'rgba(30, 27, 75, 0.06)',

  // Text colors - High contrast for accessibility
  textPrimary: '#171717',
  textSecondary: '#525252',
  textTertiary: '#737373',
  textMuted: '#A3A3A3',
  textLight: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // Status colors - Refined
  success: '#059669',        // Emerald 600
  successLight: '#D1FAE5',   // Emerald 100
  successMuted: '#ECFDF5',   // Emerald 50

  warning: '#D97706',        // Amber 600
  warningLight: '#FEF3C7',   // Amber 100
  warningMuted: '#FFFBEB',   // Amber 50

  error: '#DC2626',          // Red 600
  errorLight: '#FEE2E2',     // Red 100
  errorMuted: '#FEF2F2',     // Red 50

  info: '#2563EB',           // Blue 600
  infoLight: '#DBEAFE',      // Blue 100
  infoMuted: '#EFF6FF',      // Blue 50

  // Price colors
  priceExcellent: '#059669',
  priceGood: '#10B981',
  priceNormal: '#1E1B4B',
  priceHigh: '#D97706',
  priceVeryHigh: '#DC2626',

  // Occupancy colors
  occupancyLow: '#059669',
  occupancyMedium: '#D97706',
  occupancyHigh: '#DC2626',

  // AI Feature colors
  aiPrimary: '#8B5CF6',
  aiSecondary: '#A78BFA',
  aiGlow: 'rgba(139, 92, 246, 0.12)',
  aiGradientStart: '#8B5CF6',
  aiGradientEnd: '#7C3AED',

  // Interactive states
  pressed: 'rgba(139, 92, 246, 0.12)',
  hover: 'rgba(139, 92, 246, 0.06)',
  focused: 'rgba(139, 92, 246, 0.16)',
  disabled: '#E5E5E5',

  // Dividers & Borders
  divider: 'rgba(30, 27, 75, 0.06)',
  border: 'rgba(30, 27, 75, 0.08)',
  borderStrong: 'rgba(30, 27, 75, 0.12)',

  // Overlay
  overlay: 'rgba(23, 23, 23, 0.5)',
  overlayLight: 'rgba(23, 23, 23, 0.3)',

  // Legacy compatibility (map old colors)
  primaryOriginal: '#F0AAFF',
} as const;

// ============= SPACING SYSTEM =============
// 8pt grid with half-unit for fine adjustments
export const Spacing = {
  xxs: 2,   // 0.25 × base
  xs: 4,    // 0.5 × base
  sm: 8,    // 1 × base
  smd: 12,  // 1.5 × base (new)
  md: 16,   // 2 × base
  lg: 24,   // 3 × base
  xl: 32,   // 4 × base
  xxl: 48,  // 6 × base
  xxxl: 64, // 8 × base
} as const;

// ============= BORDER RADIUS =============
// Consistent rounded corners
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  full: 9999,
} as const;

// ============= TYPOGRAPHY =============
// Apple HIG compliant with proper line-heights and letter-spacing
export const Typography = {
  // Display - Large hero text
  display: {
    fontSize: 40,
    fontWeight: '700' as const,
    lineHeight: 48,
    letterSpacing: -0.5,
  },

  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.1,
  },
  h4: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },

  // Body text - Apple standard 17pt
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 17,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySemibold: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyBold: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },

  // Callout - Slightly smaller body
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  calloutMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },

  // Subhead
  subhead: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  subheadMedium: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Caption
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0,
  },
  captionMedium: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
    letterSpacing: 0,
  },
  captionBold: {
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0,
  },

  // Footnote & Small
  footnote: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },
  footnoteMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },
  small: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 14,
    letterSpacing: 0.1,
  },
  smallBold: {
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 14,
    letterSpacing: 0.1,
  },

  // Micro - Labels, badges
  micro: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 12,
    letterSpacing: 0.2,
  },
} as const;

// ============= SHADOWS & ELEVATION =============
// Material Design 3 inspired elevation system
export const Shadows = {
  // Level 0 - No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Level 1 - Subtle (cards, list items)
  sm: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  // Level 2 - Default (elevated cards)
  md: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Level 3 - Prominent (modals, popovers)
  lg: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  // Level 4 - Maximum (bottom sheets, dialogs)
  xl: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },

  // Special - Glow effect for AI elements
  glow: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  // Special - Success glow
  glowSuccess: {
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  // Inner shadow simulation
  inner: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 0,
  },

  // Legacy names
  small: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  large: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

// ============= MOTION & ANIMATION =============
// Physics-based spring animations (Apple HIG compliant)
export const Motion = {
  // Spring configurations
  spring: {
    // Default - smooth, natural
    default: {
      damping: 20,
      stiffness: 300,
      mass: 1,
    },
    // Gentle - subtle feedback
    gentle: {
      damping: 25,
      stiffness: 200,
      mass: 1,
    },
    // Snappy - quick response
    snappy: {
      damping: 15,
      stiffness: 400,
      mass: 0.8,
    },
    // Bouncy - playful
    bouncy: {
      damping: 10,
      stiffness: 350,
      mass: 1,
    },
    // Stiff - minimal overshoot
    stiff: {
      damping: 30,
      stiffness: 500,
      mass: 1,
    },
  },

  // Timing durations (in ms)
  duration: {
    instant: 100,    // Micro-interactions
    fast: 150,       // Toggle, tap feedback
    normal: 250,     // Standard transitions
    slow: 350,       // Full-screen transitions
    slower: 500,     // Complex animations
  },

  // Easing curves (Material Design 3)
  easing: {
    standard: [0.2, 0, 0, 1],
    entrance: [0, 0, 0.2, 1],
    exit: [0.2, 0, 1, 1],
    emphasized: [0.2, 0, 0, 1],
  },

  // Stagger delays for list animations
  stagger: {
    fast: 30,
    normal: 50,
    slow: 80,
  },
} as const;

// ============= TOUCH TARGETS =============
// Apple HIG minimum 44pt
export const TouchTargets = {
  minimum: 44,
  comfortable: 48,
  large: 56,
} as const;

// ============= Z-INDEX LAYERS =============
export const ZIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  overlay: 600,
  max: 999,
} as const;

// ============= LAYOUT =============
export const Layout = {
  screenPadding: 16,
  cardPadding: 16,
  sectionSpacing: 24,
  maxContentWidth: 600,
} as const;

// ============= BREAKPOINTS (for web) =============
export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// ============= HELPER FUNCTIONS =============
export const withOpacity = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};
