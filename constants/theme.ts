export const colors = {
    primary: "#FFFFFF",
    secondary: "#F3F0EE",
    box: '#F7EDEB',
    background: "#EEEAE7",
    button: "#1A8199",
    text: "#212121",
    error: "#B00020",
    fat: "#F8E559",
    protein: "#E98A67",
    carbs: "#FAAE5B",
  } as const; // Use `as const` for literal type inference

export const spacing = {
  small: 8,
  medium: 16,
  large: 24,
} as const;
  
export const typography = {
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
  },
} as const;

// Optional: Define a type for your theme
export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
};