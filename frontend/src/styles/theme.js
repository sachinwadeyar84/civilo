/**
 * Design tokens. Single source of truth for colors, spacing, typography.
 * Keep this small — Swiggy/Zomato use 1 brand color + neutrals.
 */

export const colors = {
  primary:   '#FF5A1F',  // confident orange (construction-energy, but warm)
  primaryDark:'#D44510',
  bg:        '#FFFFFF',
  bgMuted:   '#F7F7F8',
  text:      '#1A1A1A',
  textMuted: '#666666',
  border:    '#EAEAEA',
  success:   '#0E9F6E',
  warn:      '#F5A524',
  star:      '#FFB400',
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
};

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 24,
};

export const font = {
  h1: { fontSize: 24, fontWeight: '700' },
  h2: { fontSize: 20, fontWeight: '700' },
  h3: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
};
