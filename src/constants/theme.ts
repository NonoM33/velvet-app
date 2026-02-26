export const Colors = {
  // Velvet Brand Colors
  primary: '#F0AAFF', // Soft pink/violet - signature color
  primaryLight: '#F8D4FF',
  primaryDark: '#D580E8',

  // Navy accent
  navy: '#003399',
  navyLight: '#1A4DB3',
  navyDark: '#002266',

  // Background colors - Light & Airy
  background: '#FFFFFF',
  backgroundSecondary: '#FAFAFE',
  backgroundTertiary: '#F5F5FA',
  backgroundGradientStart: '#FFFFFF',
  backgroundGradientEnd: '#FDF5FF', // Very light pink tint

  // Card colors
  cardBackground: '#FFFFFF',
  cardBorder: 'rgba(0, 51, 153, 0.08)',
  cardShadow: 'rgba(0, 51, 153, 0.08)',

  // Text colors
  textPrimary: '#003399', // Navy for headings
  textSecondary: '#4A5568',
  textMuted: '#9CA3AF',
  textLight: '#FFFFFF',

  // Status colors
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Price colors
  priceGreen: '#10B981',
  priceOrange: '#F59E0B',
  priceRed: '#EF4444',

  // Occupancy colors
  occupancyLow: '#10B981',
  occupancyMedium: '#F59E0B',
  occupancyHigh: '#EF4444',

  // AI Feature colors
  aiAccent: '#F0AAFF',
  aiGlow: 'rgba(240, 170, 255, 0.2)',
  aiGradientStart: '#F0AAFF',
  aiGradientEnd: '#D580E8',

  // Interactive states
  pressed: 'rgba(240, 170, 255, 0.1)',
  hover: 'rgba(240, 170, 255, 0.05)',

  // Dividers
  divider: 'rgba(0, 51, 153, 0.08)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#003399',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#003399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  large: {
    shadowColor: '#003399',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#F0AAFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};
