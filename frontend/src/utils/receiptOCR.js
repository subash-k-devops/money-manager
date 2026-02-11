// ✅ PRODUCTION-SAFE OCR SIMULATOR (GitLab Pages Compatible)

export async function scanReceipt(file) {
    if (!file) {
      throw new Error("NO_FILE");
    }
  
    const name = file.name.toLowerCase();
  
    // 🔹 Default structure
    let result = {
      merchant: "Unknown Merchant",
      date: new Date().toISOString().split("T")[0],
      items: [],
    };
  
    // 🧾 FOOD RECEIPTS
    if (
      name.includes("food") ||
      name.includes("restaurant") ||
      name.includes("hotel") ||
      name.includes("cafe")
    ) {
      result.merchant = "Foodie Hub Restaurant";
      result.items = [
        {
          mainCategory: "Food",
          category: "Restaurant",
          emoji: "🍝",
          amount: 180,
          confidence: 0.96,
        },
        {
          mainCategory: "Food",
          category: "Snacks",
          emoji: "🥪",
          amount: 120,
          confidence: 0.94,
        },
        {
          mainCategory: "Food",
          category: "Coffee",
          emoji: "☕",
          amount: 90,
          confidence: 0.93,
        },
      ];
    }
  
    // 💡 EB / BILL RECEIPTS
    else if (
      name.includes("eb") ||
      name.includes("bill") ||
      name.includes("electric")
    ) {
      result.merchant = "Electricity Board";
      result.items = [
        {
          mainCategory: "Bills",
          category: "EB Bill",
          emoji: "⚡",
          amount: 1250,
          confidence: 0.98,
        },
      ];
    }
  
    // 🛒 GROCERY
    else if (
      name.includes("reliance") ||
      name.includes("mart") ||
      name.includes("grocery")
    ) {
      result.merchant = "Reliance Smart";
      result.items = [
        {
          mainCategory: "Grocery & Veggies",
          category: "Shop Veggies",
          emoji: "🥕",
          amount: 268,
          confidence: 0.95,
        },
        {
          mainCategory: "Grocery & Veggies",
          category: "Dairy",
          emoji: "🥛",
          amount: 128,
          confidence: 0.94,
        },
      ];
    }
  
    // ❓ FALLBACK (Still NEVER fails)
    else {
      result.merchant = "Scanned Receipt";
      result.items = [
        {
          mainCategory: "Others",
          category: "Miscellaneous",
          emoji: "🧾",
          amount: 500,
          confidence: 0.80,
        },
      ];
    }
  
    return result;
  }
  