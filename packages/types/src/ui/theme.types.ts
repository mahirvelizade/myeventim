import type { Theme } from '../enums';

export interface ThemeConfig {
  current: Theme;
  effective: 'light' | 'dark';
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
}

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  card: string;
  cardForeground: string;
  success: string;
  warning: string;
  info: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeTransitions {
  fast: string;
  normal: string;
  slow: string;
}
