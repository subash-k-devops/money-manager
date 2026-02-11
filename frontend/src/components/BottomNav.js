import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SettingsIcon from "@mui/icons-material/Settings";

import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <Box
        sx={{
          overflowX: { xs: "auto", md: "hidden" },
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          display: "flex",
          justifyContent: { xs: "flex-start", md: "center" },
        }}
      >
        <BottomNavigation
          value={location.pathname}
          onChange={(_, value) => navigate(value)}
          showLabels
          sx={{
            height: 64,
            pb: "env(safe-area-inset-bottom)",
            minWidth: { xs: "max-content", md: "auto" },
            display: "flex",
          }}
        >
          <BottomNavigationAction
            label="Home"
            value="/"
            icon={<HomeIcon />}
            sx={{ minWidth: 80 }}
          />

          {/* ✅ FIXED ROUTE */}
          <BottomNavigationAction
            label="List"
            value="/transactions"
            icon={<ListIcon />}
            sx={{ minWidth: 80 }}
          />

          <BottomNavigationAction
            label="Add"
            value="/add"
            icon={<AddCircleIcon sx={{ fontSize: 36 }} />}
            sx={{ minWidth: 80 }}
          />

          <BottomNavigationAction
            label="Calendar"
            value="/calendar"
            icon={<CalendarMonthIcon />}
            sx={{ minWidth: 80 }}
          />

          <BottomNavigationAction
            label="Reports"
            value="/reports"
            icon={<BarChartIcon />}
            sx={{ minWidth: 80 }}
          />

          <BottomNavigationAction
            label="Accounts"
            value="/accounts"
            icon={<AccountBalanceIcon />}
            sx={{ minWidth: 80 }}
          />

          <BottomNavigationAction
            label="Settings"
            value="/settings"
            icon={<SettingsIcon />}
            sx={{ minWidth: 80 }}
          />
        </BottomNavigation>
      </Box>
    </Paper>
  );
};

export default BottomNav;
