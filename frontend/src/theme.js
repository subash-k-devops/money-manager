import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    success: { main: "#2e7d32" },
    error: { main: "#d32f2f" },
    background: {
      default: "#f7f9fc",
      paper: "#ffffff",
    },
  },

  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body2: { color: "#5f6368" },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 2,
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
