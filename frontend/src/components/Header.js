import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        height: 56,
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ minHeight: 56 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: "0.2px",
          }}
        >
          Money Manager
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
