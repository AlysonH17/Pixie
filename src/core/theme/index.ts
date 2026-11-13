/**
 * Editorial, minimalist design system.
 * Zero emojis, clean typography, refined contrast, Apple Photos / Linear aesthetic.
 */
export const theme = {
  colors: {
    background: '#0B0C0E',       // Pure dark matte
    surface: '#141519',          // Elevation 1
    surfaceElevated: '#1D1F24',  // Elevation 2
    surfaceHighlight: '#262930', // Hover / Selected
    border: '#2A2D35',           // Hairline border
    borderSubtle: '#1F2126',

    textPrimary: '#F2F2F3',      // High contrast legible white
    textSecondary: '#A0A3AB',    // Balanced subtitle
    textMuted: '#686B74',        // Secondary labels & captions

    accent: '#FFFFFF',           // Minimalist primary
    accentSubtle: '#2E323B',

    actionKeep: '#2EA043',       // Subtle organic green
    actionKeepSubtle: 'rgba(46, 160, 67, 0.12)',

    actionDiscard: '#DA3633',    // Refined muted crimson
    actionDiscardSubtle: 'rgba(218, 54, 51, 0.12)',

    pillActive: '#F2F2F3',
    pillInactive: '#1D1F24',
  },
  typography: {
    fontMono: 'monospace',
    headline: {
      fontSize: 22,
      fontWeight: '700' as const,
      letterSpacing: -0.4,
    },
    title: {
      fontSize: 17,
      fontWeight: '600' as const,
      letterSpacing: -0.2,
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500' as const,
      letterSpacing: 0.2,
    },
    labelSmall: {
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 0.6,
      textTransform: 'uppercase' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
};
