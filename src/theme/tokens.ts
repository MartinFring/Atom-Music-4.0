/**
 * Design tokens for the YouTube Music Desktop App.
 * Centralizes shared values used across plugins and components.
 */

export const colors = {
  // App-level colors (override YouTube Music variables)
  black1: '#212121',
  black2: '#181818',
  black3: '#030303',
  black4: '#030303',
  blackPure: '#000',
  white: '#ffffff',
  textPrimary: '#f1f1f1',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  scrollbarThumb: 'rgb(126, 126, 126)',
  separator: 'rgba(255, 255, 255, 0.2)',
  hoverOverlay: 'hsla(0, 0%, 100%, 0.1)',
  accent: '#49f3f7',
  glassBg: 'rgba(0, 0, 0, 0.35)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassBorderHover: 'rgba(255, 255, 255, 0.18)',
  sidebarItemHover: 'rgba(255, 255, 255, 0.06)',
  sidebarItemActive: 'rgba(255, 255, 255, 0.1)',
  tabInactive: 'rgba(255, 255, 255, 0.5)',
} as const;

export const spacing = {
  xxs: '2px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  pill: '200px',
  round: '50%',
} as const;

export const typography = {
  fontSizeXs: '10px',
  fontSizeSm: '12px',
  fontSizeMd: '14px',
  fontSizeLg: '16px',
  fontSizeXl: '18px',
  fontFamily:
    'Satoshi, Avenir, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  letterSpacingTight: '-0.02em',
  letterSpacingNormal: '-0.01em',
  letterSpacingWide: '0.02em',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 1000,
  overlay: 10000,
  titlebar: 10000000,
  modal: 10000001,
} as const;

export const transitions = {
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
  xslow: '550ms',
  easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeInOut: 'cubic-bezier(0.2, 0, 0.6, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smoothOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const glass = {
  blur: 'blur(30px) saturate(180%)',
  blurLight: 'blur(20px) saturate(150%)',
} as const;

export const layout = {
  menuBarHeight: '32px',
  minWindowWidth: '325px',
  minWindowHeight: '425px',
  titleBarOverlayHeight: 32,
} as const;
