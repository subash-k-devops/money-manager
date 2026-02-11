import { CATEGORY_MAP } from "./categoryMap";

/**
 * Classify receipt items using keywords
 */
export function classifyReceipt(items = []) {
  return items.map((item) => {
    const name = item.name.toLowerCase();

    for (const cat of CATEGORY_MAP) {
      for (const sub of cat.subs) {
        if (
          sub.keywords.some((k) =>
            name.includes(k)
          )
        ) {
          return {
            mainCategory: cat.main,
            subCategory: item.name,
            emoji: sub.emoji,
            amount: item.amount,
            confidence: 0.95,
          };
        }
      }

      if (
        cat.keywords.some((k) =>
          name.includes(k)
        )
      ) {
        return {
          mainCategory: cat.main,
          subCategory: item.name,
          emoji: cat.emoji,
          amount: item.amount,
          confidence: 0.85,
        };
      }
    }

    // New / unknown item
    return {
      mainCategory: "Other",
      subCategory: item.name,
      emoji: "❓",
      amount: item.amount,
      confidence: 0.6,
    };
  });
}
