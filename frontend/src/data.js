// ❗ IMPORTANT:
// This file must NOT contain transactions.
// Transactions come ONLY from localStorage (storage.js).

export const accounts = [
  { id: 1, name: "Cash", type: "Asset", openingBalance: 2000 },
  { id: 2, name: "Bank", type: "Asset", openingBalance: 10000 },
  { id: 3, name: "Card", type: "Liability", openingBalance: 0 },
];

export const settings = {
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  categories: {
    income: ["Salary", "Bonus", "Interest"],
    expense: ["Food", "Travel", "Shopping", "Bills", "Health"],
  },
};
