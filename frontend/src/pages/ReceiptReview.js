import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  IconButton,
  Grid,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import { addTransaction } from "../storage";

/* 🔹 SIMPLE SMART CATEGORY DETECTOR */
const detectCategory = (text = "") => {
  const t = text.toLowerCase();

  if (
    t.includes("pasta") ||
    t.includes("biriyani") ||
    t.includes("coffee") ||
    t.includes("tea") ||
    t.includes("food") ||
    t.includes("meal")
  )
    return "Food";

  if (
    t.includes("flight") ||
    t.includes("bus") ||
    t.includes("train") ||
    t.includes("uber") ||
    t.includes("ola")
  )
    return "Travel";

  if (
    t.includes("eb") ||
    t.includes("electric") ||
    t.includes("bill") ||
    t.includes("gas")
  )
    return "Bills";

  if (
    t.includes("doctor") ||
    t.includes("hospital") ||
    t.includes("medicine")
  )
    return "Health";

  if (
    t.includes("amazon") ||
    t.includes("flipkart") ||
    t.includes("shopping")
  )
    return "Shopping";

  return "Others";
};

const emptyRow = {
  item: "",
  category: "",
  emoji: "",
  amount: "",
};

const categories = [
  "Food",
  "Grocery & Veggies",
  "Bills",
  "Health",
  "Travel",
  "Entertainment",
  "Shopping",
  "Education",
  "Others",
];

const ReceiptReview = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [merchant, setMerchant] = useState(
    state?.merchant || "Unknown Merchant"
  );
  const [date, setDate] = useState(
    state?.date || new Date().toISOString().split("T")[0]
  );

  const [rows, setRows] = useState(
    state?.splits?.length
      ? state.splits.map((s) => ({
          item: s.subCategory || s.item || "",
          category: s.category || detectCategory(s.subCategory || s.item),
          emoji: s.emoji || "",
          amount: s.amount || "",
        }))
      : [{ ...emptyRow }]
  );

  const total = rows.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );

  const updateRow = (index, field, value) => {
    const updated = [...rows];

    updated[index][field] = value;

    // 🔹 AUTO-DETECT CATEGORY WHEN ITEM NAME CHANGES
    if (field === "item") {
      updated[index].category = detectCategory(value);
    }

    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!rows.length) {
      alert("No items to save");
      return;
    }

    rows.forEach((r) => {
      if (!r.amount || !r.category) return;

      addTransaction({
        id: Date.now() + Math.random(),
        type: "expense",
        mainCategory: r.category,
        category: r.item,
        emoji: r.emoji,
        amount: Number(r.amount),
        date,
        note: merchant,
        source: "receipt",
      });
    });

    navigate("/transactions");
  };

  return (
    <Box sx={{ p: 2, pb: 9 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Merchant"
          fullWidth
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
        />

        <TextField
          sx={{ mt: 2 }}
          type="date"
          label="Date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Paper>

      {rows.map((row, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Item Name"
                fullWidth
                value={row.item}
                onChange={(e) =>
                  updateRow(index, "item", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                label="Category"
                fullWidth
                value={row.category}
                onChange={(e) =>
                  updateRow(index, "category", e.target.value)
                }
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Emoji"
                fullWidth
                value={row.emoji}
                onChange={(e) =>
                  updateRow(index, "emoji", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={row.amount}
                onChange={(e) =>
                  updateRow(index, "amount", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} textAlign="right">
              <IconButton
                color="error"
                onClick={() => removeRow(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        fullWidth
        variant="outlined"
        onClick={addRow}
      >
        Add Item
      </Button>

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">
          Total: ₹ {total.toFixed(2)}
        </Typography>
      </Paper>

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={handleSave}
      >
        CONFIRM & SAVE
      </Button>
    </Box>
  );
};

export default ReceiptReview;
