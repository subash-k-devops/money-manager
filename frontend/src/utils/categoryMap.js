// 🧠 CATEGORY INTELLIGENCE MAP
// Single source of truth for:
// - Main Category
// - Sub Category
// - Emojis
// - Keywords (AI matching)

export const CATEGORY_MAP = [
    {
      main: "Food",
      emoji: "🍽️",
      keywords: ["food", "restaurant", "hotel", "zomato", "swiggy"],
      subs: [
        { name: "Biriyani", emoji: "🍛", keywords: ["biriyani", "biryani"] },
        { name: "Tea", emoji: "☕", keywords: ["tea", "chai"] },
        { name: "Coffee", emoji: "☕", keywords: ["coffee"] },
        { name: "Juice", emoji: "🥤", keywords: ["juice"] },
        { name: "Snacks", emoji: "🥨", keywords: ["snack", "chips"] },
        { name: "Breakfast", emoji: "🥞", keywords: ["breakfast"] },
        { name: "Lunch", emoji: "🍽️", keywords: ["lunch"] },
        { name: "Dinner", emoji: "🍛", keywords: ["dinner"] },
      ],
    },
  
    {
      main: "Grocery & Veggies",
      emoji: "🥦",
      keywords: ["grocery", "vegetable", "veggies", "mart", "supermarket"],
      subs: [
        { name: "Vegetables", emoji: "🥕", keywords: ["tomato", "onion", "potato"] },
        { name: "Fruits", emoji: "🍎", keywords: ["apple", "banana", "orange"] },
        { name: "Dairy", emoji: "🥛", keywords: ["milk", "curd", "cheese", "paneer"] },
        { name: "Rice & Grains", emoji: "🌾", keywords: ["rice", "wheat"] },
      ],
    },
  
    {
      main: "Bills",
      emoji: "💡",
      keywords: ["bill", "electricity", "eb", "current", "water"],
      subs: [
        { name: "EB Bill", emoji: "💡", keywords: ["eb", "electricity"] },
        { name: "Water Bill", emoji: "🚰", keywords: ["water"] },
        { name: "Gas Bill", emoji: "🔥", keywords: ["gas"] },
        { name: "Internet Bill", emoji: "📶", keywords: ["wifi", "internet"] },
      ],
    },
  
    {
      main: "Health",
      emoji: "🧘",
      keywords: ["hospital", "medical", "doctor", "pharmacy"],
      subs: [
        { name: "Medicine", emoji: "💊", keywords: ["tablet", "medicine"] },
        { name: "Doctor", emoji: "👨‍⚕️", keywords: ["doctor", "clinic"] },
        { name: "Lab Test", emoji: "🧪", keywords: ["lab", "test"] },
        { name: "Gym", emoji: "💪", keywords: ["gym", "fitness"] },
      ],
    },
  
    {
      main: "Travel",
      emoji: "🚕",
      keywords: ["travel", "trip", "journey"],
      subs: [
        { name: "Taxi", emoji: "🚕", keywords: ["uber", "ola", "taxi"] },
        { name: "Bus", emoji: "🚌", keywords: ["bus"] },
        { name: "Train", emoji: "🚆", keywords: ["train"] },
        { name: "Flight", emoji: "✈️", keywords: ["flight", "air"] },
      ],
    },
  
    {
      main: "Entertainment",
      emoji: "🎬",
      keywords: ["movie", "ott", "netflix", "prime"],
      subs: [
        { name: "Movie", emoji: "🎥", keywords: ["movie", "cinema"] },
        { name: "Netflix", emoji: "📺", keywords: ["netflix"] },
        { name: "Prime", emoji: "🎬", keywords: ["prime"] },
      ],
    },
  ];
  