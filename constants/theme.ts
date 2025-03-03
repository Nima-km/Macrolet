export const colors = {
    primary: "#2196F3",
    secondary: "#FF5722",
    background: "#FFFFFF",
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