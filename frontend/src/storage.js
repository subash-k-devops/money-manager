import { CATEGORY_MASTER } from "./master/categories";

const KEY_TX = "money_manager_transactions";
const KEY_CATEGORIES = "money_manager_categories";
const KEY_ACCOUNTS = "money_manager_accounts";
const KEY_BUDGETS = "money_manager_budgets";
const KEY_BOOKMARKS = "money_manager_bookmarks";
const KEY_PASSCODE = "money_manager_passcode";
const KEY_SUBCATEGORY_ON = "money_manager_subcategory_on";

// ---------- Transactions ----------
export function getTransactions() {
  return JSON.parse(localStorage.getItem(KEY_TX)) || [];
}

export function saveTransactions(data) {
  localStorage.setItem(KEY_TX, JSON.stringify(data));
}

export function addTransaction(transaction) {
  const existing = getTransactions();
  const updated = [...existing, { ...transaction, id: transaction.id || Date.now() }];
  saveTransactions(updated);
}

export function updateTransaction(id, updates) {
  const existing = getTransactions();
  const index = existing.findIndex((t) => t.id === id);
  if (index === -1) return;
  existing[index] = { ...existing[index], ...updates };
  saveTransactions(existing);
}

export function deleteTransaction(id) {
  saveTransactions(getTransactions().filter((t) => t.id !== id));
}

// ---------- Categories (editable; fallback to CATEGORY_MASTER) ----------
export function getCategories() {
  const stored = localStorage.getItem(KEY_CATEGORIES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (_) {}
  }
  return { expense: CATEGORY_MASTER, income: getDefaultIncomeCategories() };
}

function getDefaultIncomeCategories() {
  return {
    Income: {
      emoji: "💰",
      sub: {
        Salary: "💰",
        Allowance: "🤑",
        "Petty cash": "💵",
        Bonus: "🏅",
        Other: "📦",
      },
    },
  };
}

export function saveCategories(categories) {
  localStorage.setItem(KEY_CATEGORIES, JSON.stringify(categories));
}

// ---------- Subcategory ON/OFF (like Money Manager) ----------
export function getSubcategoryEnabled() {
  const v = localStorage.getItem(KEY_SUBCATEGORY_ON);
  return v === null ? true : v === "true";
}

export function setSubcategoryEnabled(enabled) {
  localStorage.setItem(KEY_SUBCATEGORY_ON, String(enabled));
}

// ---------- Accounts (editable) ----------
const DEFAULT_ACCOUNTS = [
  { id: "1", name: "Cash", type: "Asset", openingBalance: 0 },
  { id: "2", name: "Bank", type: "Asset", openingBalance: 0 },
  { id: "3", name: "Card", type: "Liability", openingBalance: 0 },
];

export function getAccounts() {
  const stored = localStorage.getItem(KEY_ACCOUNTS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (_) {}
  }
  return DEFAULT_ACCOUNTS;
}

export function saveAccounts(accounts) {
  localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(accounts));
}

export function addAccount(account) {
  const list = getAccounts();
  const id = String(Date.now());
  list.push({ ...account, id: account.id || id });
  saveAccounts(list);
}

export function updateAccount(id, updates) {
  const list = getAccounts();
  const index = list.findIndex((a) => a.id === id || a.name === id);
  if (index === -1) return;
  list[index] = { ...list[index], ...updates };
  saveAccounts(list);
}

export function deleteAccount(id) {
  saveAccounts(getAccounts().filter((a) => a.id !== id && a.name !== id));
}

// ---------- Budgets (per category, per month) ----------
export function getBudgets() {
  const stored = localStorage.getItem(KEY_BUDGETS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (_) {}
  }
  return {};
}

export function saveBudgets(budgets) {
  localStorage.setItem(KEY_BUDGETS, JSON.stringify(budgets));
}

export function setBudget(categoryKey, amount) {
  const b = getBudgets();
  b[categoryKey] = Number(amount) || 0;
  saveBudgets(b);
}

// ---------- Bookmarks (frequent transactions) ----------
export function getBookmarks() {
  const stored = localStorage.getItem(KEY_BOOKMARKS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (_) {}
  }
  return [];
}

export function saveBookmarks(bookmarks) {
  localStorage.setItem(KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

export function addBookmark(bookmark) {
  const list = getBookmarks();
  list.push({ ...bookmark, id: bookmark.id || Date.now() });
  saveBookmarks(list);
}

export function removeBookmark(id) {
  saveBookmarks(getBookmarks().filter((b) => b.id !== id));
}

// ---------- Passcode ----------
export function getPasscode() {
  return localStorage.getItem(KEY_PASSCODE) || null;
}

export function setPasscode(pin) {
  if (pin) localStorage.setItem(KEY_PASSCODE, pin);
  else localStorage.removeItem(KEY_PASSCODE);
}

export function isUnlocked() {
  return sessionStorage.getItem("money_manager_unlocked") === "1";
}

export function setUnlocked(value) {
  if (value) sessionStorage.setItem("money_manager_unlocked", "1");
  else sessionStorage.removeItem("money_manager_unlocked");
}
