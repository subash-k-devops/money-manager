import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Root = () => {
  const storedMode = localStorage.getItem("themeMode") || "light";
  const [mode, setMode] = useState(storedMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App setThemeMode={setMode} />
    </ThemeProvider>
  );
};

root.render(<Root />);
