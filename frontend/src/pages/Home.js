import React, { useState } from "react";
import { Box, Paper, Typography, Fab, Drawer } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Dashboard from "./Dashboard";
import Add from "./Add";
import { getTransactions } from "../storage";

const Home = () => {
  const [openAdd, setOpenAdd] = useState(false);

  const txns = getTransactions().slice().reverse();

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      {/* Top summary + tabs */}
      <Dashboard />

      {/* Recent transactions list */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Recent Transactions</Typography>
        <Box sx={{ mt: 2 }}>
          {txns.length === 0 ? (
            <Typography color="text.secondary">No transactions yet</Typography>
          ) : (
            txns.map((t) => (
              <Box key={t.id} sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {t.emoji ? `${t.emoji} ` : ""}{t.mainCategory ? `${t.mainCategory}/${t.category}` : t.category}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{t.date} • {t.account}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: t.type === "income" ? "green" : "error.main" }}>₹ {t.amount}</Typography>
              </Box>
            ))
          )}
        </Box>
      </Paper>

      {/* Floating Add button (mobile & desktop) */}
      <Fab color="primary" aria-label="add" sx={{ position: "fixed", right: 16, bottom: 80 }} onClick={() => setOpenAdd(true)}>
        <AddIcon />
      </Fab>

      {/* Add drawer */}
      <Drawer anchor="bottom" open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box sx={{ width: "100%" }}>
          <Add />
        </Box>
      </Drawer>
    </Box>
  );
};

export default Home;

