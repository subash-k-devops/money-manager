import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";
import { getTransactions } from "../storage";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const startOfMonth = dayjs().startOf("month");
  const daysInMonth = startOfMonth.daysInMonth();

  const dailyTotals = {};

  transactions.forEach((t) => {
    dailyTotals[t.date] = dailyTotals[t.date] || { income: 0, expense: 0 };
    dailyTotals[t.date][t.type] += Number(t.amount);
  });

  const transactionsForDate = selectedDate
    ? transactions.filter((t) => t.date === selectedDate)
    : [];

  return (
    <Box sx={{ p: 2, pb: 9 }}>
      <Typography variant="h6">
        {dayjs().format("MMMM YYYY")}
      </Typography>

      <Grid container spacing={1}>
        {[...Array(daysInMonth)].map((_, i) => {
          const date = startOfMonth.add(i, "day").format("YYYY-MM-DD");
          const totals = dailyTotals[date];

          return (
            <Grid item xs={12 / 7} key={date}>
              <Paper
                sx={{ p: 1, height: 90, cursor: "pointer" }}
                onClick={() => setSelectedDate(date)}
              >
                <Typography variant="caption">{i + 1}</Typography>

                {totals?.income > 0 && (
                  <Typography variant="caption" color="green" display="block">
                    +₹{totals.income}
                  </Typography>
                )}

                {totals?.expense > 0 && (
                  <Typography variant="caption" color="error" display="block">
                    -₹{totals.expense}
                  </Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={Boolean(selectedDate)} onClose={() => setSelectedDate(null)} fullWidth>
        <DialogTitle>
          {dayjs(selectedDate).format("DD MMM YYYY")}
        </DialogTitle>
        <DialogContent>
          <List>
            {transactionsForDate.length === 0 && (
              <Typography>No transactions</Typography>
            )}
            {transactionsForDate.map((t) => (
              <ListItem key={t.id}>
                <ListItemText
                  primary={`${t.category} – ₹${t.amount}`}
                  secondary={`${t.type} • ${t.account || "-"}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;
