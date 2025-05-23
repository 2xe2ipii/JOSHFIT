export const COLORS = {
  // Primary
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#C8E6C9',
  // Accent
  accent: '#FF5722',
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#F5F5F5',
  gray: '#9E9E9E',
  darkGray: '#616161',
  // Status
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  // Dark mode
  darkBackground: '#121212',
  darkSurface: '#1E1E1E',
  darkText: '#FFFFFF',
  darkBorder: '#333333',
};
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  // Font sizes
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  body: 14,
  small: 12,
  tiny: 10,
};
export const SIZES = {
  // Padding/Margin
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  // Border radius
  borderRadiusSm: 4,
  borderRadiusMd: 8,
  borderRadiusLg: 16,
  borderRadiusXl: 24,
  // Screen dimensions
  width: 0, // To be set dynamically
  height: 0, // To be set dynamically
};
export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 8,
  },
};

