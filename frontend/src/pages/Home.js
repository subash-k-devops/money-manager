import React, { useState, useMemo } from "react";
import { Box, Paper, Typography, Fab, Drawer, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Dashboard from "./Dashboard";
import Add from "./Add";
import { getTransactions } from "../storage";

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Home = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [openAttach, setOpenAttach] = useState(false);

  const txnsAll = useMemo(() => getTransactions().slice().reverse(), []);

  // default show last 7 days
  const last7 = useMemo(() => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 6);
    const fromKey = from.toISOString().split("T")[0];
    return txnsAll.filter((t) => t.date && t.date >= fromKey);
  }, [txnsAll]);

  const handleAIScan = async (file) => {
    if (!file) return;
    setOpenAI(false);
    // convert to data URL and navigate into Add via state by opening Add drawer with state
    const d = await toDataUrl(file);
    // navigate into Add with scanned processing: Add.js will read location.state.scanned if present
    // We'll open Add and pass scanned file via sessionStorage to keep simple
    sessionStorage.setItem("incomingAttachment", JSON.stringify(d));
    // also mark that AI scan should run in Add; we store a flag with a placeholder key
    sessionStorage.setItem("incomingAI", "1");
    setOpenAdd(true);
  };

  const handleAttach = async (file) => {
    if (!file) return;
    setOpenAttach(false);
    const d = await toDataUrl(file);
    sessionStorage.setItem("incomingAttachment", JSON.stringify(d));
    sessionStorage.removeItem("incomingAI");
    setOpenAdd(true);
  };

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Dashboard />

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Recent Activity (last 7 days)</Typography>
        <Box sx={{ mt: 2 }}>
          {last7.length === 0 ? (
            <Typography color="text.secondary">No recent transactions</Typography>
          ) : (
            last7.map((t) => (
              <Box key={t.id} sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {t.emoji ? `${t.emoji} ` : ""}{t.mainCategory ? `${t.mainCategory}/${t.category}` : t.category}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{t.date} • {t.account} {t.note ? `• ${t.note}` : ""}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: t.type === "income" ? "green" : "error.main" }}>₹ {t.amount}</Typography>
              </Box>
            ))
          )}
        </Box>
      </Paper>

      {/* FAB menu */}
      <Fab color="primary" aria-label="add" sx={{ position: "fixed", right: 16, bottom: 80 }} onClick={() => setOpenAdd(true)}>
        <AddIcon />
      </Fab>

      <Drawer anchor="bottom" open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box sx={{ width: "100%" }}>
          <Add />
        </Box>
      </Drawer>
    </Box>
  );
};

export default Home;

