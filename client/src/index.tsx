import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";
import FakeStackOverflow from "./components/fakestackoverflow";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff9e44",
      light: "#ffbe7a",
      dark: "#e67e19",
    },
    secondary: {
      main: "#0095ff",
      light: "#4db8ff",
      dark: "#0077cc",
    },
    background: {
      default: "#f8f9f9",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS across browsers */}
      <FakeStackOverflow />
    </ThemeProvider>
  );
}
