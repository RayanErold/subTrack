
const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const themes = {
  light: {
    text: '#000',
    background: '#fff',
    card: '#f5f5f5',
    primary: '#6C63FF',
    secondary: '#FF6584',
    success: '#32D74B',
    warning: '#FFD60A',
    tint: '#2f95dc',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
    surface: 'rgba(255, 255, 255, 0.8)',
  },
  dark: {
    text: '#fff',
    background: '#0a0a0a',
    card: '#1c1c1e',
    primary: '#6C63FF',
    secondary: '#FF6584',
    success: '#32D74B',
    warning: '#FFD60A',
    tint: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
    surface: 'rgba(28, 28, 30, 0.6)',
  },
  navy: {
    text: '#e0e0e0',
    background: '#0a192f',
    card: '#112240',
    primary: '#64ffda', // Teal
    secondary: '#FF6584',
    success: '#32D74B',
    warning: '#FFD60A',
    tint: '#64ffda',
    tabIconDefault: '#8892b0',
    tabIconSelected: '#64ffda',
    surface: 'rgba(17, 34, 64, 0.7)',
  },
  sunset: {
    text: '#fff',
    background: '#2d1b2e', // Deep purple/brown
    card: '#442c46',
    primary: '#ff9e64', // Orange
    secondary: '#f7768e',
    success: '#9ece6a',
    warning: '#e0af68',
    tint: '#ff9e64',
    tabIconDefault: '#a9a1e1',
    tabIconSelected: '#ff9e64',
    surface: 'rgba(68, 44, 70, 0.7)',
  },
};

export const AccentColors = [
  { name: 'Indigo', value: '#6C63FF' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Sky', value: '#0EA5E9' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Crimson', value: '#DC2626' },
  { name: 'Goldenrod', value: '#DAA520' },
];

export const AppFonts = [
  'System',
  'Georgia',
  'Courier',
  'Inter',
  'Avenir',
  'Helvetica',
  'Baskerville',
  'Futura',
  'Palatino',
];

export const BackgroundColors = [
  { name: 'Deep Black', value: '#000000' },
  { name: 'Midnight Navy', value: '#0a192f' },
  { name: 'Dark Slate', value: '#1a1b26' },
  { name: 'Charcoal', value: '#121212' },
  { name: 'Pitch Dark', value: '#050505' },
  { name: 'Rich Espresso', value: '#1a0f0e' },
  { name: 'Deep Emerald', value: '#061613' },
  { name: 'Velvet Purple', value: '#120b1c' },
  { name: 'Pure White', value: '#ffffff' },
];

export const ThemePresets = [
  { name: 'Cyberpunk', primary: '#6C63FF', secondary: '#FF00FF' },
  { name: 'Ocean', primary: '#0EA5E9', secondary: '#64FFDA' },
  { name: 'Forest', primary: '#10B981', secondary: '#A5F3FC' },
  { name: 'Sunset', primary: '#F59E0B', secondary: '#F43F5E' },
  { name: 'Lavender', primary: '#8B5CF6', secondary: '#C084FC' },
  { name: 'Midnight Gold', primary: '#EAB308', secondary: '#FDE047' },
  { name: 'Boreal', primary: '#14B8A6', secondary: '#22D3EE' },
  { name: 'Midnight Rose', primary: '#F43F5E', secondary: '#FB7185' },
  { name: 'Nordic Blue', primary: '#3B82F6', secondary: '#60A5FA' },
  { name: 'Crimson Edge', primary: '#DC2626', secondary: '#F87171' },
];

export default {
  themes,
  AccentColors,
  BackgroundColors,
  ThemePresets,
  AppFonts,
  light: themes.light,
  dark: themes.dark,
};
