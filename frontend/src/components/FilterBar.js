import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";

const FilterBar = ({ filters, setFilters, onReset }) => {
  const handleChange = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            type="date"
            label="From"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={filters.from}
            onChange={handleChange("from")}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            type="date"
            label="To"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={filters.to}
            onChange={handleChange("to")}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            select
            label="Type"
            fullWidth
            value={filters.type}
            onChange={handleChange("type")}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6}>
          {Array.isArray(categoryOptions) ? (
            <TextField
              select
              label="Category"
              fullWidth
              value={filters.category}
              onChange={handleChange("category")}
            >
              <MenuItem value="">All</MenuItem>
              {categoryOptions.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              label="Category"
              fullWidth
              value={filters.category}
              onChange={handleChange("category")}
              placeholder="Food, Travel..."
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onReset}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterBar;
