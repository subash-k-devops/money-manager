/**
 * Parse OCR text into structured receipt data
 */
export function parseReceiptText(text = "") {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  
    let merchant = lines[0] || "Unknown Merchant";
    const items = [];
    let total = null;
  
    for (const line of lines) {
      // Match item lines like: ItemName 120
      const itemMatch = line.match(/^(.+?)\s+(\d{1,6}(\.\d{1,2})?)$/);
      if (itemMatch) {
        const name = itemMatch[1];
        const amount = Number(itemMatch[2]);
  
        if (!name.toLowerCase().includes("total")) {
          items.push({ name, amount });
        }
      }
  
      // Detect total line
      if (line.toLowerCase().includes("total")) {
        const nums = line.match(/(\d{1,6}(\.\d{1,2})?)/g);
        if (nums && nums.length) {
          total = Number(nums[nums.length - 1]);
        }
      }
    }
  
    return {
      merchant,
      items,
      total,
    };
  }
  