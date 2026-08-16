import { createTheme } from "@mui/material/styles";

/**
 * MUI theme mapped from the site's existing design tokens (src/app/globals.css)
 * so Material components sit visually consistent with the hand-built sections.
 */
export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  palette: {
    mode: "dark",
    background: {
      default: "#0a0a0c",
      paper: "#101014",
    },
    text: {
      primary: "#f2f1ec",
      secondary: "#9a9aa3",
      disabled: "#6e6e76",
    },
    primary: {
      main: "#c9f24d",
      dark: "#9ec22f",
      contrastText: "#0a0a0c",
    },
    error: {
      main: "#ff6b6b",
    },
    divider: "rgb(255 255 255 / 9%)",
  },
  typography: {
    fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
    h1: { fontFamily: "var(--font-inter-tight), Inter, sans-serif" },
    h2: { fontFamily: "var(--font-inter-tight), Inter, sans-serif" },
    h3: { fontFamily: "var(--font-inter-tight), Inter, sans-serif" },
    h4: { fontFamily: "var(--font-inter-tight), Inter, sans-serif" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, minHeight: 44 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgb(255 255 255 / 9%)",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
  },
});
