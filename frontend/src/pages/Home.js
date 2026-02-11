import React from "react";
import { Box, Grid, Paper, Typography, Fab, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import Add from "./Add";
import { getTransactions } from "../storage";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const txns = getTransactions().slice().reverse();

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Quick Add</Typography>
            {!isMobile && (
              <Box sx={{ mt: 2 }}>
                <Add />
              </Box>
            )}
            {isMobile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Use the + button to add a transaction.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Transactions</Typography>
            <Box sx={{ mt: 2 }}>
              {txns.length === 0 ? (
                <Typography color="text.secondary">No transactions yet</Typography>
              ) : (
                txns.map((t) => (
                  <Box key={t.id} sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{t.emoji ? `${t.emoji} ` : ""}{t.mainCategory ? `${t.mainCategory}/${t.category}` : t.category}</Typography>
                      <Typography variant="caption" color="text.secondary">{t.date} • {t.account}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: t.type === "income" ? "green" : "error.main" }}>₹ {t.amount}</Typography>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {isMobile && (
        <Fab color="primary" aria-label="add" sx={{ position: "fixed", right: 16, bottom: 80 }} onClick={() => navigate("/add")}>
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Home;

