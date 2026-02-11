import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Drawer,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MenuIcon from "@mui/icons-material/Menu";
import LoopIcon from "@mui/icons-material/Loop";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import GridViewIcon from "@mui/icons-material/GridView";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useNavigate } from "react-router-dom";

import { addTransaction, getAccounts, addBookmark, getBookmarks } from "../storage";
import { getMainCategories } from "../utils/categoryUtils";
import { scanReceipt } from "../utils/receiptOCR";

// Blue theme color (matches app)
const THEME_BLUE = "#1976d2";

// Transfer labels (accounts are from storage)
const TRANSFER_LABELS = [
  { emoji: "🔁", label: "Cash → Bank" },
  { emoji: "🔁", label: "Bank → Cash" },
];

// Numeric keypad keys (1-9, empty, 0, .) + backspace & Done
const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "."];

const formatDateDisplay = (dateStr) => {
  const d = new Date(dateStr);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} (${days[d.getDay()]})`;
};

const Add = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const mainCategories = useMemo(() => getMainCategories("expense"), []);
  const incomeCategoriesList = useMemo(() => {
    const mains = getMainCategories("income");
    const list = [];
    mains.forEach((m) => {
      (m.subs || []).forEach((s) => list.push({ emoji: s.emoji, label: s.name }));
    });
    return list.length ? list : [
      { emoji: "💰", label: "Salary" },
      { emoji: "🤑", label: "Allowance" },
      { emoji: "🏅", label: "Bonus" },
      { emoji: "📦", label: "Other" },
    ];
  }, []);
  const accountsList = useMemo(() => getAccounts().map((a) => a.name), []);

  const [type, setType] = useState("expense");
  const [form, setForm] = useState({
    mainCategory: "",
    category: "",
    emoji: "",
    account: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    description: "",
    fromAccount: "",
    toAccount: "",
  });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showSubPicker, setShowSubPicker] = useState(false);
  const [selectedMain, setSelectedMain] = useState(null);
  const [scanningReceipt, setScanningReceipt] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcExpr, setCalcExpr] = useState("");

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const loadBookmarks = () => setBookmarks(getBookmarks());

  const handleAddBookmark = () => {
    if (!form.category || !form.amount) {
      alert("Fill Category and Amount first to save as bookmark.");
      return;
    }
    addBookmark({
      type,
      category: form.category,
      emoji: form.emoji,
      amount: form.amount,
      account: form.account || form.fromAccount || "",
    });
    loadBookmarks();
  };

  const applyBookmark = (b) => {
    setType(b.type || "expense");
    setForm((prev) => ({
      ...prev,
      type: b.type || "expense",
      category: b.category || "",
      emoji: b.emoji || "",
      mainCategory: b.mainCategory || "",
      amount: b.amount || "",
      account: b.account || "",
    }));
  };

  const handleAmountClick = () => setShowKeypad(true);
  const handleKeypadInput = (key) => {
    if (!key) return;
    setForm((prev) => ({ ...prev, amount: String(prev.amount || "") + key }));
  };
  const handleKeypadBackspace = () => {
    setForm((prev) => ({ ...prev, amount: String(prev.amount || "").slice(0, -1) }));
  };
  const handleKeypadDone = () => setShowKeypad(false);

  const inputCalc = (v) => {
    setCalcExpr((s) => s + v);
  };

  const clearCalc = () => setCalcExpr("");

  const backspaceCalc = () => setCalcExpr((s) => s.slice(0, -1));

  const evalCalc = () => {
    // only allow safe characters
    if (!/^[0-9+\-*/().\s]+$/.test(calcExpr)) {
      alert("Invalid expression");
      return;
    }
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${calcExpr})`)();
      const val = Number(result);
      if (!Number.isFinite(val)) {
        alert("Invalid result");
        return;
      }
      setForm((prev) => ({ ...prev, amount: String(val) }));
      setShowCalculator(false);
      setCalcExpr("");
    } catch (err) {
      alert("Could not evaluate expression");
    }
  };

  const handleCategorySelect = (cat) => {
    if (type === "expense") {
      // Open subcategory picker so user can choose the exact subcategory
      setSelectedMain(cat);
      setShowSubPicker(true);
    } else if (type === "income") {
      setForm({
        ...form,
        category: cat.label,
        emoji: cat.emoji,
        mainCategory: "income",
      });
      setShowCategoryPicker(false);
    } else {
      setForm({
        ...form,
        category: cat.label,
        emoji: cat.emoji,
        mainCategory: "transfer",
      });
      setShowCategoryPicker(false);
    }
  };

  const handleSubSelect = (sub) => {
    setForm({
      ...form,
      mainCategory: selectedMain.name,
      category: sub.name,
      emoji: sub.emoji,
    });
    setShowSubPicker(false);
    setShowCategoryPicker(false);
    setSelectedMain(null);
  };

  const handleAccountSelect = (accountName) => {
    if (type === "transfer") {
      if (!form.fromAccount) {
        setForm({ ...form, fromAccount: accountName });
      } else {
        setForm({ ...form, toAccount: accountName });
        setShowAccountPicker(false);
      }
    } else {
      setForm({ ...form, account: accountName });
      setShowAccountPicker(false);
    }
  };

  const handleSwapAccounts = () => {
    setForm({
      ...form,
      fromAccount: form.toAccount,
      toAccount: form.fromAccount,
    });
  };

  const handleSubmit = (andContinue = false) => {
    const cat = form.category || (type === "transfer" ? "Transfer" : "");
    const amt = form.amount;
    const acc =
      type === "transfer"
        ? form.fromAccount || form.toAccount || ""
        : form.account;

    if (!cat || !amt) {
      alert("Please select Category and enter Amount");
      return;
    }
    if (type === "transfer" && (!form.fromAccount || !form.toAccount)) {
      alert("Please select From and To accounts");
      return;
    }

    addTransaction({
      id: Date.now(),
      type,
      mainCategory: form.mainCategory || type,
      category: form.category || (type === "transfer" ? "Transfer" : ""),
      emoji: form.emoji,
      account: type === "transfer" ? `${form.fromAccount} → ${form.toAccount}` : acc,
      amount: Number(amt),
      date: form.date,
      note: form.note,
      description: form.description,
      source: "manual",
    });

    if (andContinue) {
      setForm({
        ...form,
        amount: "",
        note: "",
        description: "",
        category: "",
        emoji: "",
        mainCategory: "",
      });
    } else {
      navigate("/transactions");
    }
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanningReceipt(true);
    try {
      const result = await scanReceipt(file);
      const splits = (result.items || []).map((item) => ({
        subCategory: item.category,
        category: item.mainCategory,
        emoji: item.emoji || "🧾",
        amount: item.amount || 0,
      }));
      navigate("/receipt-review", {
        state: {
          merchant: result.merchant || "Scanned Receipt",
          date: (result.date || new Date().toISOString()).split("T")[0],
          splits,
        },
      });
    } catch (err) {
      console.error("Receipt scan failed:", err);
      navigate("/receipt-review", {
        state: {
          merchant: "Uploaded Receipt",
          date: new Date().toISOString().split("T")[0],
          splits: [],
        },
      });
    } finally {
      setScanningReceipt(false);
    }
  };

  const accentColor = THEME_BLUE;

  const bgColor = isDark ? "#1a1a1a" : "#f5f5f5";
  const cardBg = isDark ? "#2d2d2d" : "#ffffff";
  const inputBg = isDark ? "#383838" : "#eeeeee";

  const closeCategoryPicker = () => {
    setShowCategoryPicker(false);
    setShowSubPicker(false);
    setSelectedMain(null);
  };

  useEffect(() => loadBookmarks(), []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: bgColor,
        pb: 10,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          bgcolor: cardBg,
          borderBottom: `1px solid ${alpha(
            theme.palette.divider,
            isDark ? 0.3 : 0.2
          )}`,
        }}
      >
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>
          {type === "expense"
            ? "Expense"
            : type === "income"
            ? "Income"
            : "Transfer"}
        </Typography>
        <Box>
          <IconButton size="small" onClick={handleAddBookmark} title="Save as bookmark (favorite)">
            <StarBorderIcon />
          </IconButton>
          <IconButton size="small">
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Bookmarks quick add */}
      {bookmarks.length > 0 && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            Quick add
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {bookmarks.map((b) => (
              <Chip
                key={b.id}
                size="small"
                label={`${b.emoji || ""} ${b.category} ₹${b.amount}`}
                onClick={() => applyBookmark(b)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Transaction type tabs */}
      <Box sx={{ display: "flex", gap: 0.5, p: 2, pb: 1 }}>
        {["income", "expense", "transfer"].map((t) => (
          <Button
            key={t}
            variant={type === t ? "contained" : "outlined"}
            onClick={() => {
              setType(t);
              setForm({
                ...form,
                category: "",
                emoji: "",
                mainCategory: "",
                fromAccount: "",
                toAccount: "",
              });
              closeCategoryPicker();
              setShowAccountPicker(false);
              setShowKeypad(false);
            }}
            sx={{
              flex: 1,
              textTransform: "capitalize",
              fontWeight: 600,
              borderRadius: 2,
              ...(type === t && {
                bgcolor: THEME_BLUE,
                color: "#fff",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
              }),
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </Box>

      {/* Form */}
      <Box sx={{ px: 2 }}>
        <Box
          sx={{
            bgcolor: cardBg,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: isDark ? "none" : 1,
          }}
        >
          {/* Date */}
          <label htmlFor="add-date-picker" style={{ cursor: "pointer", display: "block" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.5,
                borderBottom: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.2 : 0.15
                )}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Date
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, position: "relative" }}>
                <Typography variant="body2">
                  {formatDateDisplay(form.date)} 12:00 am
                </Typography>
                <IconButton size="small" component="span">
                  <LoopIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  Rep/Inst.
                </Typography>
                <input
                  id="add-date-picker"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Box>
          </label>

          {/* Amount */}
          <Box
            onClick={handleAmountClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleAmountClick()}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              borderBottom: `2px solid ${accentColor}`,
              cursor: "pointer",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                {form.amount || "0"}
              </Typography>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); setShowCalculator(true); setShowKeypad(false); }} title="Open calculator">
                <CalculateIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Category */}
          <Box
            onClick={() => setShowCategoryPicker(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowCategoryPicker(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${alpha(
                theme.palette.divider,
                isDark ? 0.2 : 0.15
              )}`,
              cursor: "pointer",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body2">
              {form.mainCategory && form.category
                ? `${form.emoji || ""} ${form.mainCategory}/${form.category}`
                : form.emoji && form.category
                ? `${form.emoji} ${form.category}`
                : "Select"}
            </Typography>
          </Box>

          {/* Account (Expense/Income) or From/To (Transfer) */}
          {type === "transfer" ? (
            <>
              <Box
                onClick={() => setShowAccountPicker(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setShowAccountPicker(true)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.2 : 0.15
                  )}`,
                  cursor: "pointer",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  From
                </Typography>
                <Typography variant="body2">
                  {form.fromAccount || "Select"}
                </Typography>
              </Box>
              <Box
                onClick={() => setShowAccountPicker(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setShowAccountPicker(true)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.2 : 0.15
                  )}`,
                  cursor: "pointer",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  To
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2">
                    {form.toAccount || "Select"}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwapAccounts();
                    }}
                  >
                    <SwapVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </>
          ) : (
            <Box
              onClick={() => setShowAccountPicker(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setShowAccountPicker(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.5,
                borderBottom: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.2 : 0.15
                )}`,
                cursor: "pointer",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Account
              </Typography>
              <Typography variant="body2">
                {form.account || "Select"}
              </Typography>
            </Box>
          )}

          {/* Note */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${alpha(
                theme.palette.divider,
                isDark ? 0.2 : 0.15
              )}`,
            }}
          >
            <TextField
              fullWidth
              placeholder="Note"
              value={form.note}
              onChange={handleChange("note")}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ "& input": { fontSize: "0.875rem" } }}
            />
          </Box>

          {/* Description + Camera / Receipt scan */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1.5,
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              placeholder="Description"
              value={form.description}
              onChange={handleChange("description")}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ "& input": { fontSize: "0.875rem" } }}
            />
            <Button
              component="label"
              disabled={scanningReceipt}
              sx={{ minWidth: "auto", px: 1 }}
            >
              {scanningReceipt ? (
                <CircularProgress size={24} />
              ) : (
                <CameraAltIcon />
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleReceiptUpload}
              />
            </Button>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleSubmit(false)}
            sx={{
              py: 1.5,
              borderRadius: 2,
              bgcolor: THEME_BLUE,
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            Save
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleSubmit(true)}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            Continue
          </Button>
        </Box>
      </Box>

      {/* Category picker – Drawer */}
      <Drawer
        anchor="bottom"
        open={showCategoryPicker}
        onClose={closeCategoryPicker}
        sx={{
          "& .MuiDrawer-paper": {
            maxHeight: "70vh",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            bgcolor: cardBg,
          },
        }}
      >
        <Box sx={{ p: 2, pb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              pb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {showSubPicker && selectedMain && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setShowSubPicker(false);
                    setSelectedMain(null);
                  }}
                >
                  <ArrowBackIosIcon fontSize="small" />
                </IconButton>
              )}
              <Typography variant="subtitle1" fontWeight={600}>
                {showSubPicker && selectedMain
                  ? `${selectedMain.emoji} ${selectedMain.name}`
                  : showSubPicker
                  ? "Subcategory"
                  : "Category"}
              </Typography>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={() => {
                  closeCategoryPicker();
                  navigate("/categories");
                }}
                title="Manage categories"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={closeCategoryPicker}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {showSubPicker && selectedMain ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedMain.subs.map((sub) => (
                <Box
                  key={sub.name}
                  onClick={() => handleSubSelect(sub)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: inputBg,
                    cursor: "pointer",
                    "&:hover": { bgcolor: alpha(THEME_BLUE, 0.15) },
                  }}
                >
                  <span>{sub.emoji}</span>
                  <Typography variant="body2">{sub.name}</Typography>
                </Box>
              ))}
            </Box>
          ) : type === "expense" ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1.5,
              }}
            >
              {mainCategories.map((cat) => (
                <Box
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 2,
                    borderRadius: 2,
                    bgcolor: inputBg,
                    cursor: "pointer",
                    "&:hover": { bgcolor: alpha(THEME_BLUE, 0.15) },
                  }}
                >
                  <Typography sx={{ fontSize: "1.5rem", mb: 0.5 }}>
                    {cat.emoji}
                  </Typography>
                  <Typography variant="caption" textAlign="center">
                    {cat.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {(type === "income" ? incomeCategoriesList : TRANSFER_LABELS).map(
                (cat) => (
                  <Box
                    key={cat.label}
                    onClick={() => handleCategorySelect(cat)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 2,
                      py: 2,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      cursor: "pointer",
                      "&:hover": { bgcolor: alpha(THEME_BLUE, 0.1) },
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{cat.emoji}</span>
                    <Typography>{cat.label}</Typography>
                  </Box>
                )
              )}
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Account picker – Drawer */}
      <Drawer
        anchor="bottom"
        open={showAccountPicker}
        onClose={() => setShowAccountPicker(false)}
        sx={{
          "& .MuiDrawer-paper": {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            bgcolor: cardBg,
          },
        }}
      >
        <Box sx={{ p: 2, pb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              pb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Accounts
            </Typography>
            <Box>
              <IconButton size="small">
                <GridViewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setShowAccountPicker(false);
                  navigate("/accounts");
                }}
                title="Manage accounts"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => setShowAccountPicker(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {accountsList.map((acc) => (
              <Box
                key={acc}
                onClick={() => handleAccountSelect(acc)}
                sx={{
                  flex: "1 1 30%",
                  minWidth: 80,
                  py: 2,
                  borderRadius: 2,
                  bgcolor: inputBg,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: alpha(THEME_BLUE, 0.15) },
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {acc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>

      {/* Numeric keypad – Drawer */}
      <Drawer
        anchor="bottom"
        open={showKeypad}
        onClose={handleKeypadDone}
        sx={{
          "& .MuiDrawer-paper": {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            bgcolor: cardBg,
            pb: "env(safe-area-inset-bottom)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              pb: 1.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Amount
            </Typography>
            <IconButton size="small" onClick={handleKeypadDone}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {showCalculator && (
              <Box sx={{ p: 1, borderRadius: 1, bgcolor: inputBg }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2">Calculator</Typography>
                  <Box>
                    <Button size="small" onClick={clearCalc}>AC</Button>
                    <Button size="small" onClick={backspaceCalc}>⌫</Button>
                  </Box>
                </Box>
                <Box sx={{ textAlign: "right", minHeight: 36, mb: 1 }}>
                  <Typography variant="h6">{calcExpr || "0"}</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
                  {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","+","="].map((k) => (
                    <Button
                      key={k}
                      variant="outlined"
                      onClick={() => (k === "=" ? evalCalc() : inputCalc(k))}
                      sx={{ py: 1.5 }}
                    >
                      {k}
                    </Button>
                  ))}
                  <Button variant="contained" onClick={evalCalc} sx={{ gridColumn: "span 4", py: 1.5, bgcolor: THEME_BLUE, "&:hover": { bgcolor: "#1565c0" } }}>Use result</Button>
                </Box>
              </Box>
            )}

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
              {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k) => (
                <Button
                  key={k}
                  variant="outlined"
                  onClick={() => (k === "⌫" ? handleKeypadBackspace() : handleKeypadInput(k))}
                  sx={{ py: 2, borderRadius: 2, fontSize: "1.25rem", fontWeight: 600 }}
                >
                  {k}
                </Button>
              ))}
            </Box>

            <Button variant="contained" onClick={handleKeypadDone} sx={{ py: 2, borderRadius: 2, bgcolor: THEME_BLUE, "&:hover": { bgcolor: "#1565c0" } }}>
              Done
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Add;
