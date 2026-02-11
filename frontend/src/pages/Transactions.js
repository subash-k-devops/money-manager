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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getTransactions, updateTransaction, saveTransactions, getAccounts } from "../storage";

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

  useEffect(() => {
    setTxns(getTransactions());
  }, [location.pathname]);

  const deleteTxn = (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    const updated = txns.filter((t) => t.id !== id);
    saveTransactions(updated);
    setTxns(updated);
  };

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
      {txns.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No transactions yet
        </Typography>
      ) : (
        txns.map((t) => (
          <Paper
            key={t.id}
            sx={{
              p: 1.8,
              mb: 1.2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>
                {t.emoji && `${t.emoji} `}{t.category}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t.date} • {t.account}
                {t.source === "receipt" && " • Receipt"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <Chip
                label={`₹ ${Number(t.amount).toLocaleString()}`}
                color={t.type === "income" ? "success" : "default"}
                variant={t.type === "expense" ? "filled" : "filled"}
                sx={{ fontWeight: 600 }}
              />
              <IconButton size="small" onClick={() => openEdit(t)} title="Edit">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => deleteTxn(t.id)}
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
    </Container>
  );
}
