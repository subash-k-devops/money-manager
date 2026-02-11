import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import PasscodeLock from "./components/PasscodeLock";
import { getPasscode, isUnlocked } from "./storage";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Add from "./pages/Add";
import CalendarPage from "./pages/Calendar";
import Reports from "./pages/Reports";
import Accounts from "./pages/Accounts";
import Settings from "./pages/Settings";
import ReceiptReview from "./pages/ReceiptReview";
import Home from "./pages/Home";
import Categories from "./pages/Categories";

export default function App({ setThemeMode }) {
  const [locked, setLocked] = useState(() => !!getPasscode() && !isUnlocked());

  useEffect(() => {
    setLocked(!!getPasscode() && !isUnlocked());
  }, []);

  if (locked) {
    return (
      <PasscodeLock onUnlock={() => setLocked(false)} />
    );
  }

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* 🏠 Home */}
        <Route path="/" element={<Home />} />

        {/* 📃 Transactions (KEEP existing) */}
        <Route path="/transactions" element={<Transactions />} />

        {/* 📃 List (NEW – required for BottomNav) */}
        <Route path="/list" element={<Transactions />} />

        {/* ➕ Add */}
        <Route path="/add" element={<Add />} />

        {/* 🧾 Receipt Review */}
        <Route path="/receipt-review" element={<ReceiptReview />} />

        {/* 📅 Calendar */}
        <Route path="/calendar" element={<CalendarPage />} />

        {/* 📊 Reports */}
        <Route path="/reports" element={<Reports />} />

        {/* 🏦 Accounts */}
        <Route path="/accounts" element={<Accounts />} />

        {/* 📁 Categories management */}
        <Route path="/categories" element={<Categories />} />

        {/* ⚙️ Settings */}
        <Route
          path="/settings"
          element={<Settings setThemeMode={setThemeMode} />}
        />
      </Routes>

      <BottomNav />
    </BrowserRouter>
  );
}
