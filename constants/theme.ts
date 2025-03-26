export const colors = {
    primary: "#FFFFFF",
    secondary: "#F3F0EE",
    background: "#F3F0EE",
    text: "#212121",
    error: "#B00020",
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