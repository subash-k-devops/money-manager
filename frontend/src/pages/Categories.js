import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  saveCategories,
  getSubcategoryEnabled,
  setSubcategoryEnabled,
} from "../storage";

const Categories = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [categories, setCategories] = useState({ expense: {}, income: {} });
  const [subcategoryOn, setSubcategoryOn] = useState(true);
  const [tab, setTab] = useState("expense");
  const [dialog, setDialog] = useState({
    open: false,
    mode: "main",
    mainName: "",
    mainEmoji: "",
    subName: "",
    subEmoji: "",
    editMainKey: null,
    editSubKey: null,
  });

  useEffect(() => {
    setCategories(getCategories());
    setSubcategoryOn(getSubcategoryEnabled());
  }, []);

  const handleSubcategoryToggle = (e) => {
    const v = e.target.checked;
    setSubcategoryOn(v);
    setSubcategoryEnabled(v);
  };

  const mainList = Object.entries(categories[tab] || {});

  const openAddMain = () => {
    setDialog({
      open: true,
      mode: "main",
      mainName: "",
      mainEmoji: "📌",
      subName: "",
      subEmoji: "",
      editMainKey: null,
      editSubKey: null,
    });
  };

  const openEditMain = (mainName, data) => {
    setDialog({
      open: true,
      mode: "main",
      mainName,
      mainEmoji: data.emoji || "📌",
      subName: "",
      subEmoji: "",
      editMainKey: mainName,
      editSubKey: null,
    });
  };

  const openAddSub = (mainName, mainData) => {
    setDialog({
      open: true,
      mode: "sub",
      mainName,
      mainEmoji: mainData.emoji,
      subName: "",
      subEmoji: "📌",
      editMainKey: mainName,
      editSubKey: null,
    });
  };

  const openEditSub = (mainName, subName, subEmoji) => {
    const mainData = categories[tab][mainName];
    setDialog({
      open: true,
      mode: "sub",
      mainName,
      mainEmoji: mainData?.emoji || "📌",
      subName,
      subEmoji: subEmoji || "📌",
      editMainKey: mainName,
      editSubKey: subName,
    });
  };

  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  const saveDialog = () => {
    const next = { ...categories };
    const current = { ...(next[tab] || {}) };

    if (dialog.mode === "main") {
      const emoji = dialog.mainEmoji?.trim() || "📌";
      const name = dialog.mainName?.trim();
      if (!name) return;
      if (dialog.editMainKey) {
        const oldSub = current[dialog.editMainKey]?.sub || {};
        delete current[dialog.editMainKey];
        current[name] = { emoji, sub: oldSub };
      } else {
        current[name] = { emoji, sub: current[name]?.sub || {} };
      }
    } else {
      const mainName = dialog.mainName?.trim();
      const subName = dialog.subName?.trim();
      const subEmoji = dialog.subEmoji?.trim() || "📌";
      if (!mainName || !subName) return;
      if (!current[mainName]) current[mainName] = { emoji: dialog.mainEmoji || "📌", sub: {} };
      if (!current[mainName].sub) current[mainName].sub = {};
      if (dialog.editSubKey) delete current[mainName].sub[dialog.editSubKey];
      current[mainName].sub[subName] = subEmoji;
    }

    next[tab] = current;
    setCategories(next);
    saveCategories(next);
    closeDialog();
  };

  const deleteMain = (mainName) => {
    if (!window.confirm(`Delete category "${mainName}" and all its subcategories?`)) return;
    const next = { ...categories };
    const current = { ...(next[tab] || {}) };
    delete current[mainName];
    next[tab] = current;
    setCategories(next);
    saveCategories(next);
  };

  const deleteSub = (mainName, subName) => {
    if (!window.confirm(`Delete subcategory "${subName}"?`)) return;
    const next = { ...categories };
    const current = { ...(next[tab] || {}) };
    if (current[mainName]?.sub) {
      delete current[mainName].sub[subName];
      if (Object.keys(current[mainName].sub).length === 0) {
        current[mainName].sub = {};
      }
    }
    next[tab] = current;
    setCategories(next);
    saveCategories(next);
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          {tab === "expense" ? "Expense" : "Income"} Categories
        </Typography>
        <IconButton size="small" onClick={openAddMain}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={subcategoryOn}
              onChange={handleSubcategoryToggle}
              color="primary"
            />
          }
          label="Subcategory"
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1, px: 2, mb: 2 }}>
        <Button
          variant={tab === "expense" ? "contained" : "outlined"}
          onClick={() => setTab("expense")}
          size="small"
        >
          Expense
        </Button>
        <Button
          variant={tab === "income" ? "contained" : "outlined"}
          onClick={() => setTab("income")}
          size="small"
        >
          Income
        </Button>
      </Box>

      <List sx={{ px: 1 }}>
        {mainList.map(([mainName, data]) => (
          <Paper key={mainName} sx={{ mb: 2, overflow: "hidden" }}>
            <ListItem
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography sx={{ mr: 1 }}>{data.emoji || "📌"}</Typography>
              <ListItemText
                primary={mainName}
                secondary={
                  subcategoryOn &&
                  data.sub &&
                  Object.keys(data.sub).length > 0 &&
                  Object.keys(data.sub).join(", ")
                }
              />
              <ListItemSecondaryAction>
                <IconButton size="small" onClick={() => openAddSub(mainName, data)}>
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => openEditMain(mainName, data)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => deleteMain(mainName)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {subcategoryOn && data.sub && (
              <List disablePadding>
                {Object.entries(data.sub).map(([subName, subEmoji]) => (
                  <ListItem key={subName} sx={{ pl: 4 }}>
                    <Typography sx={{ mr: 1 }}>{subEmoji}</Typography>
                    <ListItemText primary={subName} />
                    <IconButton
                      size="small"
                      onClick={() => openEditSub(mainName, subName, subEmoji)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteSub(mainName, subName)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        ))}
      </List>

      <Dialog open={dialog.open} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>
          {dialog.mode === "main"
            ? dialog.editMainKey
              ? "Edit category"
              : "Add category"
            : dialog.editSubKey
            ? "Edit subcategory"
            : "Add subcategory"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {dialog.mode === "main" ? (
            <>
              <TextField
                label="Name"
                value={dialog.mainName}
                onChange={(e) => setDialog((d) => ({ ...d, mainName: e.target.value }))}
                fullWidth
                autoFocus
              />
              <TextField
                label="Emoji"
                value={dialog.mainEmoji}
                onChange={(e) => setDialog((d) => ({ ...d, mainEmoji: e.target.value }))}
                fullWidth
                placeholder="📌"
              />
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                Under: {dialog.mainName}
              </Typography>
              <TextField
                label="Subcategory name"
                value={dialog.subName}
                onChange={(e) => setDialog((d) => ({ ...d, subName: e.target.value }))}
                fullWidth
                autoFocus
              />
              <TextField
                label="Emoji"
                value={dialog.subEmoji}
                onChange={(e) => setDialog((d) => ({ ...d, subEmoji: e.target.value }))}
                fullWidth
                placeholder="📌"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveDialog}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;
