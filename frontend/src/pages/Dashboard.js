import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import SummaryCard from "../components/SummaryCard";
import { getTransactions, getBudgets } from "../storage";
import { LinearProgress, Typography } from "@mui/material";

const getThisMonth = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

const Dashboard = () => {
  const [range, setRange] = useState("monthly");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [budgetList, setBudgetList] = useState([]);

  const handleChange = (_, newValue) => {
    setRange(newValue);
  };

  useEffect(() => {
    const transactions = getTransactions();
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += Number(t.amount);
      if (t.type === "expense") totalExpense += Number(t.amount);
    });
    setIncome(totalIncome);
    setExpense(totalExpense);

    const budgets = getBudgets();
    const monthPrefix = getThisMonth();
    const monthTxns = transactions.filter(
      (t) => t.type === "expense" && t.date && t.date.startsWith(monthPrefix)
    );
    const byCategory = monthTxns.reduce((acc, t) => {
      const key = t.mainCategory || t.category || "Other";
      acc[key] = (acc[key] || 0) + Number(t.amount);
      return acc;
    }, {});
    setBudgetList(
      Object.entries(budgets)
        .filter(([, v]) => v > 0)
        .map(([cat, budgetAmt]) => ({
          category: cat,
          budget: budgetAmt,
          actual: byCategory[cat] || 0,
        }))
    );
  }, []);

  const balance = income - expense;

  return (
    <Box sx={{ p: 2, pb: 9 }}>
      <Tabs
        value={range}
        onChange={handleChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Daily" value="daily" />
        <Tab label="Weekly" value="weekly" />
        <Tab label="Monthly" value="monthly" />
        <Tab label="Total" value="total" />
      </Tabs>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Income"
            value={income}
            color="success"
            icon={<ArrowDownwardIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Expense"
            value={expense}
            color="error"
            icon={<ArrowUpwardIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Balance"
            value={balance}
            color="primary"
            icon={<AccountBalanceWalletIcon />}
          />
        </Grid>

        {budgetList.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Budget this month
            </Typography>
            {budgetList.map(({ category, budget, actual }) => {
              const pct = budget > 0 ? Math.min(100, (actual / budget) * 100) : 0;
              const over = actual > budget;
              return (
                <Paper key={category} sx={{ p: 1.5, mb: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2">{category}</Typography>
                    <Typography variant="body2" color={over ? "error" : "text.secondary"}>
                      ₹{actual.toLocaleString()} / ₹{budget.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    color={over ? "error" : "primary"}
                    sx={{ height: 6, borderRadius: 1 }}
                  />
                </Paper>
              );
            })}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
