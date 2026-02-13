import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getTransactions, updateTransaction, saveTransactions, getAccounts } from "../storage";
import FilterBar from "../components/FilterBar";

// helpers to compute date ranges for presets
const getToday = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};
const getStartOfWeek = () => {
  const d = new Date();
  const day = d.getDay(); // 0 Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split("T")[0];
};
const getStartOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split("T")[0];
};

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const [txns, setTxns] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    type: "expense",
    category: "",
    account: "",
    amount: "",
    date: "",
    note: "",
  });
  const [range, setRange] = useState("daily");
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    type: "all",
    category: "",
  });

  useEffect(() => {
    setTxns(getTransactions());
  }, [location.pathname]);

  useEffect(() => {
    // when range changes, update filters.from/to appropriately
    if (range === "daily") {
      setFilters((f) => ({ ...f, from: getToday(), to: getToday() }));
    } else if (range === "weekly") {
      setFilters((f) => ({ ...f, from: getStartOfWeek(), to: getToday() }));
    } else if (range === "monthly") {
      setFilters((f) => ({ ...f, from: getStartOfMonth(), to: getToday() }));
    } else {
      setFilters((f) => ({ ...f, from: "", to: "" }));
    }
  }, [range]);

  const deleteTxn = (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    const updated = txns.filter((t) => t.id !== id);
    saveTransactions(updated);
    setTxns(updated);
  };

  const resetFilters = () => {
    setFilters({ from: "", to: "", type: "all", category: "" });
    setRange("total");
  };

  const filteredTxns = txns.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.category) {
      const sel = (filters.category || "").toString().toLowerCase();
      const main = (t.mainCategory || "").toString().toLowerCase();
      const cat = (t.category || "").toString().toLowerCase();
      if (!(main === sel || cat === sel || cat.includes(sel))) return false;
    }
    if (filters.from && t.date < filters.from) return false;
    if (filters.to && t.date > filters.to) return false;
    return true;
  });

  const openEdit = (t) => {
    setEditId(t.id);
    setEditForm({
      type: t.type || "expense",
      category: t.category || "",
      account: typeof t.account === "string" ? t.account.split(" → ")[0]?.trim() || t.account : "",
      amount: String(t.amount ?? ""),
      date: t.date || "",
      note: t.note || "",
    });
  };
  const [detail, setDetail] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const openDetail = (t) => setDetail(t);
  const closeDetail = () => setDetail(null);

  const closeEdit = () => {
    setEditId(null);
  };

  const saveEdit = () => {
    if (!editId || !editForm.category || !editForm.amount) return;
    updateTransaction(editId, {
      type: editForm.type,
      category: editForm.category,
      account: editForm.account,
      amount: Number(editForm.amount),
      date: editForm.date,
      note: editForm.note,
    });
    setTxns(getTransactions());
    closeEdit();
  };

  const accounts = getAccounts().map((a) => a.name);

  return (
    <Container sx={{ pb: 9, pt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Tabs value={range} onChange={(_, v) => setRange(v)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
          <Tab label="Daily" value="daily" />
          <Tab label="Weekly" value="weekly" />
          <Tab label="Monthly" value="monthly" />
          <Tab label="Total" value="total" />
        </Tabs>
      </Box>

      <FilterBar filters={filters} setFilters={setFilters} onReset={resetFilters} />

      {filteredTxns.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No transactions found
        </Typography>
      ) : (
        filteredTxns.map((t) => (
          <Paper
            key={t.id}
            sx={{
              p: 1.8,
              mb: 1.2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={() => openDetail(t)}
          >
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>
                {t.emoji && `${t.emoji} `}{t.mainCategory ? `${t.mainCategory}/${t.category}` : t.category}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t.date} • {t.account} {t.note ? `• ${t.note}` : ""} {t.source === "receipt" && " • Receipt"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <Chip
                label={`₹ ${Number(t.amount).toLocaleString()}`}
                color={t.type === "income" ? "success" : "default"}
                variant={t.type === "expense" ? "filled" : "filled"}
                sx={{ fontWeight: 600 }}
              />
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEdit(t); }} title="Edit">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => { e.stopPropagation(); deleteTxn(t.id); }}
                title="Delete"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        ))
      )}

      <Dialog open={!!editId} onClose={closeEdit} fullWidth maxWidth="xs">
        <DialogTitle>Edit transaction</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            select
            label="Type"
            value={editForm.type}
            onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}
            fullWidth
            sx={{ mt: 1 }}
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="transfer">Transfer</MenuItem>
          </TextField>
          <TextField
            label="Category"
            value={editForm.category}
            onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            select
            label="Account"
            value={editForm.account}
            onChange={(e) => setEditForm((f) => ({ ...f, account: e.target.value }))}
            fullWidth
            sx={{ mt: 2 }}
          >
            {accounts.map((acc) => (
              <MenuItem key={acc} value={acc}>{acc}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Amount"
            type="number"
            value={editForm.amount}
            onChange={(e) => setEditForm((f) => ({ ...f, amount: e.target.value }))}
            fullWidth
            sx={{ mt: 2 }}
            inputProps={{ step: 0.01, min: 0 }}
          />
          <TextField
            label="Date"
            type="date"
            value={editForm.date}
            onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Note"
            value={editForm.note}
            onChange={(e) => setEditForm((f) => ({ ...f, note: e.target.value }))}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
  {/* Detail dialog */}
  <Dialog open={!!detail} onClose={closeDetail} fullWidth maxWidth="sm">
    <DialogTitle>Transaction detail</DialogTitle>
    <DialogContent>
      {detail && (
        <>
          <Typography variant="h6">{detail.emoji ? `${detail.emoji} `: ""}{detail.mainCategory ? `${detail.mainCategory}/${detail.category}` : detail.category}</Typography>
          <Typography variant="body2" color="text.secondary">{detail.date} • {detail.account}</Typography>
          <Typography sx={{ fontWeight: 700, mt: 1 }}>₹ {detail.amount}</Typography>
          {detail.note && <Typography sx={{ mt: 1 }}>{detail.note}</Typography>}
          {detail.attachments && detail.attachments.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {detail.attachments.map((a, i) => (
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
    </Container>
  );
}
