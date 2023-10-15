import { createTheme } from "@mui/material";

const mode = "dark";

export const theme = createTheme({
  spacing: 8,
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#3772FF" },
          background: { default: "#ffffff" },
        }
      : {
          primary: { main: "#3772FF" },
          background: { default: "#18181b" },
        }),
  },
  typography: {
    fontFamily: "inter",
    fontSize: 14,
    h1: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h2: { fontSize: "2rem" },
    h3: { fontSize: "1.75rem" },
    h4: { fontSize: "1.5rem" },
    h5: { fontSize: "1.25rem" },
    h6: { fontSize: "1rem" },
    body1: { fontSize: "0.875rem" },
    body2: { fontSize: "0.8125rem" },
  },
});
