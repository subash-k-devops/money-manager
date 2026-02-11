import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { getPasscode, setUnlocked } from "../storage";

export default function PasscodeLock({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const saved = getPasscode();
    if (saved && pin === saved) {
      setUnlocked(true);
      onUnlock?.();
    } else {
      setError(true);
      setPin("");
    }
  };

  const saved = getPasscode();
  if (!saved) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        p: 2,
      }}
    >
      <Paper sx={{ p: 3, maxWidth: 320, width: "100%" }}>
        <Typography variant="h6" align="center" gutterBottom>
          Enter passcode
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            placeholder="Passcode"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            error={error}
            helperText={error ? "Wrong passcode" : ""}
            inputProps={{ maxLength: 20, autoComplete: "off" }}
            sx={{ mb: 2 }}
          />
          <Button fullWidth type="submit" variant="contained">
            Unlock
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
