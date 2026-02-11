import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Select,
  MenuItem,
  TextField,
  Box,
  Button,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getBudgets,
  setBudget,
  getBookmarks,
  removeBookmark,
  getPasscode,
  setPasscode,
  getSubcategoryEnabled,
  setSubcategoryEnabled,
  getTransactions,
  saveTransactions,
  getCategories,
  saveCategories,
  getAccounts,
  saveAccounts,
  saveBookmarks,
} from "../storage";
import { getMainCategories } from "../utils/categoryUtils";

const Settings = ({ setThemeMode }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("themeMode") || "light");
  const [budgets, setBudgets] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [passcode, setPasscodeState] = useState("");
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [subcategoryOn, setSubcategoryOn] = useState(true);
  const [newBudgetCat, setNewBudgetCat] = useState("");
  const [newBudgetAmt, setNewBudgetAmt] = useState("");

  useEffect(() => {
    setBudgets(getBudgets());
    setBookmarks(getBookmarks());
    setPasscodeEnabled(!!getPasscode());
    setSubcategoryOn(getSubcategoryEnabled());
  }, []);

  const handleThemeChange = (e) => {
    const mode = e.target.checked ? "dark" : "light";
    setTheme(mode);
    localStorage.setItem("themeMode", mode);
    setThemeMode(mode);
  };

  const handleSubcategoryToggle = (e) => {
    const v = e.target.checked;
    setSubcategoryOn(v);
    setSubcategoryEnabled(v);
  };

  const addBudget = () => {
    const key = newBudgetCat.trim() || "General";
    const amt = Number(newBudgetAmt) || 0;
    setBudget(key, amt);
    setBudgets(getBudgets());
    setNewBudgetCat("");
    setNewBudgetAmt("");
  };

  const removeBudget = (key) => {
    setBudget(key, 0);
    setBudgets(getBudgets());
  };

  const handleExport = () => {
    const data = {
      transactions: getTransactions(),
      categories: getCategories(),
      accounts: getAccounts(),
      budgets: getBudgets(),
      bookmarks: getBookmarks(),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `money-manager-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result || "{}");
        if (data.transactions) saveTransactions(data.transactions);
        if (data.categories) saveCategories(data.categories);
        if (data.accounts) saveAccounts(data.accounts);
        if (data.budgets && typeof data.budgets === "object")
          Object.entries(data.budgets).forEach(([k, v]) => setBudget(k, v));
        if (Array.isArray(data.bookmarks)) saveBookmarks(data.bookmarks);
        alert("Backup restored. Reload the page.");
        window.location.reload();
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const enablePasscode = () => {
    const pin = passcode.trim();
    if (pin.length < 4) {
      alert("Passcode must be at least 4 digits");
      return;
    }
    setPasscode(pin);
    setPasscodeState("");
    setPasscodeEnabled(true);
  };

  const disablePasscode = () => {
    if (!window.confirm("Remove passcode? Your app will no longer be locked.")) return;
    setPasscode(null);
    setPasscodeEnabled(false);
  };

  const expenseMainCats = getMainCategories("expense").map((m) => m.name);

  return (
    <Container sx={{ pb: 10 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Settings
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={theme === "dark"} onChange={handleThemeChange} />}
          label="Dark Mode"
        />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Currency</Typography>
        <Select fullWidth size="small" value="INR">
          <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
        </Select>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Categories & Subcategories</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" variant="outlined" onClick={() => navigate("/categories")} startIcon={<EditIcon />}>
            Manage categories
          </Button>
          <Button size="small" variant="outlined" onClick={() => navigate("/accounts")} startIcon={<EditIcon />}>
            Manage accounts
          </Button>
        </Box>
        <FormControlLabel
          control={<Switch checked={subcategoryOn} onChange={handleSubcategoryToggle} />}
          label="Subcategory ON"
          sx={{ mt: 1 }}
        />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Budget by category (₹/month)</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
          <TextField
            size="small"
            select
            label="Category"
            value={newBudgetCat}
            onChange={(e) => setNewBudgetCat(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">Select...</MenuItem>
            {expenseMainCats.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            type="number"
            placeholder="Amount"
            value={newBudgetAmt}
            onChange={(e) => setNewBudgetAmt(e.target.value)}
            sx={{ width: 120 }}
            inputProps={{ min: 0 }}
          />
          <Button variant="outlined" size="small" onClick={addBudget}>Add</Button>
        </Box>
        <List dense sx={{ mt: 1 }}>
          {Object.entries(budgets).filter(([, v]) => v > 0).map(([cat, amt]) => (
            <ListItem key={cat}>
              <ListItemText primary={cat} secondary={`₹ ${Number(amt).toLocaleString()}`} />
              <ListItemSecondaryAction>
                <IconButton size="small" onClick={() => removeBudget(cat)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Bookmarks (frequent transactions)</Typography>
        <Typography variant="caption" color="text.secondary">
          Add from Add page using the star icon after filling the form.
        </Typography>
        <List dense>
          {bookmarks.map((b) => (
            <ListItem key={b.id}>
              <ListItemText
                primary={`${b.emoji || ""} ${b.category} – ₹${b.amount}`}
                secondary={b.account}
              />
              <ListItemSecondaryAction>
                <IconButton size="small" onClick={() => { removeBookmark(b.id); setBookmarks(getBookmarks()); }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Backup & Restore</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button variant="outlined" size="small" onClick={handleExport}>
            Export backup
          </Button>
          <Button variant="outlined" size="small" component="label">
            Restore from file
            <input type="file" hidden accept=".json" onChange={handleImport} />
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Passcode lock</Typography>
        {passcodeEnabled ? (
          <Button color="error" size="small" onClick={disablePasscode}>
            Disable passcode
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              size="small"
              type="password"
              placeholder="4+ digits"
              value={passcode}
              onChange={(e) => setPasscodeState(e.target.value)}
              inputProps={{ maxLength: 20 }}
            />
            <Button variant="contained" size="small" onClick={enablePasscode}>
              Enable
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Settings;
