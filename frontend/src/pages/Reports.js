import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getTransactions } from "../storage";
import FilterBar from "../components/FilterBar";

const COLORS = [
  "#1976d2",
  "#d32f2f",
  "#388e3c",
  "#f57c00",
  "#7b1fa2",
];

const Reports = () => {
  const [range, setRange] = useState("monthly");
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    type: "all",
    category: "",
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const resetFilters = () =>
    setFilters({ from: "", to: "", type: "all", category: "" });

  /* APPLY FILTERS */
  const filtered = transactions.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (
      filters.category &&
      !t.category.toLowerCase().includes(filters.category.toLowerCase())
    )
      return false;
    if (filters.from && t.date < filters.from) return false;
    if (filters.to && t.date > filters.to) return false;
    return true;
  });

  const expenses = filtered.filter((t) => t.type === "expense");
  const income = filtered.filter((t) => t.type === "income");

  const totalExpense = expenses.reduce((s, t) => s + Number(t.amount), 0);
  const totalIncome = income.reduce((s, t) => s + Number(t.amount), 0);

  /* DONUT DATA */
  // Group by mainCategory when available (show main categories only)
  const pieData = Object.values(
    expenses.reduce((acc, cur) => {
      const key = cur.mainCategory || cur.category || "Other";
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += Number(cur.amount);
      return acc;
    }, {})
  );

  /* BAR DATA */
  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
  ];

  /* LINE DATA: expense by month (last 6 months) */
  const monthMap = {};
  expenses.forEach((t) => {
    if (!t.date) return;
    const month = t.date.slice(0, 7);
    monthMap[month] = (monthMap[month] || 0) + Number(t.amount);
  });
  const sortedMonths = Object.keys(monthMap).sort().slice(-6);
  const lineData = sortedMonths.length
    ? sortedMonths.map((m) => ({ name: m, amount: monthMap[m] }))
    : [{ name: "No data", amount: 0 }];

  return (
    <Box sx={{ p: 2, pb: 9 }}>
      <Tabs
        value={range}
        onChange={(_, v) => setRange(v)}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Daily" value="daily" />
        <Tab label="Weekly" value="weekly" />
        <Tab label="Monthly" value="monthly" />
        <Tab label="Total" value="total" />
      </Tabs>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Expense by Category</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  isAnimationActive={true}
                  animationDuration={800}
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹ ${v}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Income vs Expense</Typography>
            <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} isAnimationActive={true} animationDuration={800}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => `₹ ${v}`} />
              <Legend />
              <Bar dataKey="amount" fill="#1976d2" />
            </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Expense Trend</Typography>
            <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lineData} isAnimationActive={true} animationDuration={800}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => `₹ ${v}`} />
                <Legend />
                <Line dataKey="amount" stroke="#f57c00" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
