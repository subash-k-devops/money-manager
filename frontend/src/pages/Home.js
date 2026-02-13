import React, { useState, useMemo } from "react";
import { Box, Paper, Typography, Fab, Drawer, Dialog, DialogTitle, DialogContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);

  const txnsAll = useMemo(() => getTransactions().slice().reverse(), []);

  // default show last 7 days
  const last7 = useMemo(() => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 6);
    const fromKey = from.toISOString().split("T")[0];
    return txnsAll.filter((t) => t.date && t.date >= fromKey);
  }, [txnsAll]);

  const openDetail = (t) => setSelectedTxn(t);
  const closeDetail = () => setSelectedTxn(null);

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
              <Box key={t.id} sx={{ display: "flex", justifyContent: "space-between", my: 1, cursor: "pointer" }} onClick={() => openDetail(t)}>
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

      <Dialog fullScreen open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box sx={{ width: "100%", height: "100vh", overflow: "auto" }}>
          <Add />
        </Box>
      </Dialog>
      <Dialog open={!!selectedTxn} onClose={closeDetail} fullWidth maxWidth="sm">
        <DialogTitle>Transaction detail</DialogTitle>
        <DialogContent>
          {selectedTxn && (
            <>
              <Typography variant="h6">{selectedTxn.emoji ? `${selectedTxn.emoji} `: ""}{selectedTxn.mainCategory ? `${selectedTxn.mainCategory}/${selectedTxn.category}` : selectedTxn.category}</Typography>
              <Typography variant="body2" color="text.secondary">{selectedTxn.date} • {selectedTxn.account}</Typography>
              <Typography sx={{ fontWeight: 700, mt: 1 }}>₹ {selectedTxn.amount}</Typography>
              {selectedTxn.note && <Typography sx={{ mt: 1 }}>{selectedTxn.note}</Typography>}
              {selectedTxn.attachments && selectedTxn.attachments.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {selectedTxn.attachments.map((a, i) => (
                    <Box key={i} sx={{ width: 160 }}>
                      {a.type && a.type.startsWith("image/") ? (
                        <img src={a.dataUrl} alt={a.name} style={{ width: "100%", borderRadius: 8, cursor: "pointer" }} onClick={() => setPreviewSrc(a.dataUrl)} />
                      ) : (
                        <Box sx={{ p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                          <Typography variant="caption">{a.name}</Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!previewSrc} onClose={() => setPreviewSrc(null)} maxWidth="xl">
        <DialogContent sx={{ p: 1, bgcolor: "background.default" }}>
          {previewSrc && <img src={previewSrc} alt="preview" style={{ width: "100%", height: "auto", display: "block", margin: "0 auto" }} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Home;

