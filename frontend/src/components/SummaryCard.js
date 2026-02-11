import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const SummaryCard = ({ title, value, color, icon }) => {
  return (
    <Paper
      sx={{
        p: 2.4,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: 2,
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 4,
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: `${color}.light`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: `${color}.main`,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, mb: 0.3 }}
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700 }}
          color={`${color}.main`}
        >
          ₹ {value.toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SummaryCard;
