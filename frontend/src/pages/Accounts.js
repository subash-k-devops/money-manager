import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAccounts,
  saveAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  getTransactions,
} from "../storage";

const calculateBalance = (accountName, opening, transactions) => {
  let balance = Number(opening) || 0;
  transactions.forEach((t) => {
    if (t.account === accountName) {
      if (t.type === "income") balance += Number(t.amount);
      if (t.type === "expense") balance -= Number(t.amount);
    }
    if (t.type === "transfer" && typeof t.account === "string") {
      const [from, to] = t.account.split(" → ").map((s) => s.trim());
      if (from === accountName) balance -= Number(t.amount);
      if (to === accountName) balance += Number(t.amount);
    }
  });
  return balance;
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dialog, setDialog] = useState({
    open: false,
    id: null,
    name: "",
    type: "Asset",
    openingBalance: "",
  });

  const load = () => {
    setAccounts(getAccounts());
    setTransactions(getTransactions());
  };

  useEffect(() => load(), []);

  const totals = accounts.reduce(
    (acc, a) => {
      const balance = calculateBalance(
        a.name,
        a.openingBalance,
        transactions
      );
      if (a.type === "Asset") acc.assets += balance;
      else acc.liabilities += balance;
      return acc;
    },
    { assets: 0, liabilities: 0 }
  );

  const openAdd = () => {
    setDialog({
      open: true,
      id: null,
      name: "",
      type: "Asset",
      openingBalance: "0",
    });
  };

  const openEdit = (a) => {
    setDialog({
      open: true,
      id: a.id,
      name: a.name,
      type: a.type || "Asset",
      openingBalance: String(a.openingBalance ?? 0),
    });
  };

  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  const saveDialog = () => {
    const name = dialog.name?.trim();
    if (!name) return;
    const openingBalance = Number(dialog.openingBalance) || 0;
    if (dialog.id) {
      updateAccount(dialog.id, {
        name,
        type: dialog.type,
        openingBalance,
      });
    } else {
      addAccount({ name, type: dialog.type, openingBalance });
    }
    load();
    closeDialog();
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete account "${name}"? Transactions using this account will keep the name but the account will be removed from the list.`)) return;
    deleteAccount(id);
    load();
  };

  return (
    <Box sx={{ p: 2, pb: 9 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Accounts</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>
          Add
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2">Total Assets</Typography>
        <Typography color="success.main">₹ {totals.assets.toLocaleString()}</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2">Total Liabilities</Typography>
        <Typography color="error.main">₹ {totals.liabilities.toLocaleString()}</Typography>
      </Paper>

      <Grid container spacing={2}>
        {accounts.map((a) => {
          const balance = calculateBalance(
            a.name,
            a.openingBalance,
            transactions
          );
          return (
            <Grid item xs={12} key={a.id}>
              <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="subtitle1">{a.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {a.type}
                  </Typography>
                  <Typography
                    color={balance >= 0 ? "success.main" : "error.main"}
                    fontWeight={600}
                  >
                    Balance: ₹ {balance.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => openEdit(a)} title="Edit account">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(a.id, a.name)}
                    title="Delete account"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={dialog.open} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>{dialog.id ? "Edit account" : "Add account"}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            label="Account name"
            value={dialog.name}
            onChange={(e) => setDialog((d) => ({ ...d, name: e.target.value }))}
            fullWidth
            sx={{ mt: 1 }}
            placeholder="e.g. Cash, Bank, Card"
          />
          <TextField
            select
            label="Type"
            value={dialog.type}
            onChange={(e) => setDialog((d) => ({ ...d, type: e.target.value }))}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="Asset">Asset</MenuItem>
            <MenuItem value="Liability">Liability</MenuItem>
          </TextField>
          <TextField
            label="Opening balance"
            type="number"
            value={dialog.openingBalance}
            onChange={(e) => setDialog((d) => ({ ...d, openingBalance: e.target.value }))}
            fullWidth
            sx={{ mt: 2 }}
            inputProps={{ step: 0.01 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveDialog}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts;
