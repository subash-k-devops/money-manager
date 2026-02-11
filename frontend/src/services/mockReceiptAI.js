// src/services/mockReceiptAI.js

export const mockReceiptAI = async (file) => {
    // Simulated AI response
    return Promise.resolve({
      merchant: "Reliance Smart",
      date: new Date().toISOString(),
      splits: [
        {
          category: "Grocery and Veggies",
          subCategory: "Dairy",
          amount: 128,
          confidence: 0.92
        },
        {
          category: "Grocery and Veggies",
          subCategory: "Shop Veggies",
          amount: 268,
          confidence: 0.89
        }
      ]
    });
  };
  