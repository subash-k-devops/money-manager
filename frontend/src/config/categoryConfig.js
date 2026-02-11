// src/config/categoryConfig.js
// PHASE 02 – FULL CATEGORY CONFIG (AI / RECEIPT ONLY)

export const CATEGORY_CONFIG = {
    GROCERY_VEGGIES: {
      label: "Grocery and Veggies",
      splitAllowed: true,
      receiptType: "item-based",
      subCategories: {
        SHOP_GROCERY: {
          label: "Shop Grocery",
          keywords: ["rice", "wheat", "atta", "dal", "oil", "salt", "sugar"]
        },
        ONLINE_GROCERY: {
          label: "Online Grocery",
          merchants: ["bigbasket", "zepto", "blinkit", "instamart"]
        },
        SHOP_VEGGIES: {
          label: "Shop Veggies",
          keywords: ["tomato", "onion", "potato", "carrot", "brinjal"]
        },
        ONLINE_VEGGIES: {
          label: "Online Veggies",
          merchants: ["bigbasket", "zepto"]
        },
        DAIRY: {
          label: "Dairy",
          keywords: ["milk", "curd", "cheese", "paneer", "butter", "ghee"]
        },
        SHOP_FRUITS: {
          label: "Shop Fruits",
          keywords: ["apple", "banana", "orange", "grapes"]
        },
        ONLINE_FRUITS: {
          label: "Online Fruits",
          merchants: ["bigbasket", "zepto"]
        },
        WATERMELON: {
          label: "Watermelon",
          keywords: ["watermelon"]
        }
      }
    },
  
    FOOD: {
      label: "Food",
      splitAllowed: false,
      receiptType: "merchant-based",
      subCategories: {
        BREAKFAST: { label: "Breakfast" },
        LUNCH: { label: "Lunch" },
        DINNER: { label: "Dinner" },
        RESTAURANTS: {
          label: "Restaurants",
          merchants: ["hotel", "restaurant", "dhaba"]
        },
        TEA_COFFEE: {
          label: "Tea / Coffee",
          keywords: ["tea", "coffee"]
        },
        JUICE: {
          label: "Juice",
          keywords: ["juice", "shake"]
        },
        HEALTHY_SNACKS: {
          label: "Healthy Snacks",
          keywords: ["nuts", "sprouts", "fruits"]
        },
        JUNK_SNACKS: {
          label: "Junk Snacks",
          keywords: ["chips", "burger", "pizza"]
        },
        ONLINE_ORDERS: {
          label: "Online Orders",
          merchants: ["zomato", "swiggy"]
        }
      }
    },
  
    MEAT: {
      label: "Meat",
      splitAllowed: false,
      receiptType: "item-based",
      subCategories: {
        SEAFOOD: { label: "SeaFood", keywords: ["fish", "prawn"] },
        CHICKEN: { label: "Chicken", keywords: ["chicken"] },
        MUTTON: { label: "Mutton", keywords: ["mutton"] },
        EGGS: { label: "Eggs", keywords: ["egg"] }
      }
    },
  
    HEALTH: {
      label: "Health",
      splitAllowed: false,
      receiptType: "merchant-based",
      subCategories: {
        SUPPLEMENTS: { label: "Supplements" },
        GYM: { label: "Gym", merchants: ["gym", "fitness"] },
        HOSPITAL: { label: "Hospital", merchants: ["hospital"] },
        MEDICINE: { label: "Medicine", merchants: ["pharmacy", "medical"] },
        LAB_TESTS: { label: "Lab and Tests", merchants: ["lab", "diagnostic"] },
        PARENTS: { label: "Parents" }
      }
    },
  
    HOUSEHOLD: {
      label: "Household",
      splitAllowed: false,
      receiptType: "merchant-based",
      subCategories: {
        APPLIANCES: { label: "Appliances" },
        FURNITURE: { label: "Furniture" },
        KITCHEN: { label: "Kitchen" },
        DECORATIVES: { label: "Decoratives" },
        HOUSE_RENT: { label: "House Rent", keywords: ["rent"] },
        REPAIR_UTILITIES: {
          label: "Repair and Utilities",
          keywords: ["electrician", "plumber"]
        },
        COMMUNITY_MAINTENANCE: { label: "Community Maintenance" }
      }
    },
  
    ENTERTAINMENT: {
      label: "Entertainment",
      splitAllowed: false,
      receiptType: "subscription",
      subCategories: {
        THEATER: { label: "Theater" },
        PRIME: { label: "Prime", merchants: ["amazon"] },
        NETFLIX: { label: "Netflix" },
        HOTSTAR: { label: "Hotstar" },
        FUN_GAMES: { label: "Fun Games" },
        DTH: { label: "DTH" },
        OTHER_OTT: { label: "Other OTT" }
      }
    },
  
    APPAREL: {
      label: "Apparel",
      splitAllowed: false,
      receiptType: "merchant-based",
      subCategories: {
        CLOTHING: { label: "Clothing" },
        ACCESSORIES: { label: "Accessories" }
      }
    },
  
    BEAUTY: {
      label: "Beauty",
      splitAllowed: false,
      receiptType: "merchant-based",
      subCategories: {
        COSMETICS: { label: "Cosmetics" },
        PARLOUR: { label: "Parlour" },
        ACCESSORIES: { label: "Accessories" }
      }
    },
  
    VEHICLE: {
      label: "Vehicle - Fuel and Service",
      splitAllowed: false,
      receiptType: "merchant-based",
      subCategories: {
        ACCESS_PETROL: { label: "Access Petrol" },
        CAR_PETROL: { label: "Car Petrol" },
        CAR_SERVICE: { label: "Car Service" },
        BIKE_SERVICE: { label: "Bike Service" },
        OTHER: { label: "Other" }
      }
    },
  
    TRAVEL: {
      label: "Travel",
      splitAllowed: false,
      receiptType: "ticket",
      subCategories: {
        TAXI: { label: "Taxi" },
        TRAIN: { label: "Train" },
        BUS: { label: "Bus" },
        CAR: { label: "Car" },
        FLIGHT: { label: "Flight" }
      }
    },
  
    VACATION_OUTING: {
      label: "Vacation & Outing",
      splitAllowed: false,
      receiptType: "ticket",
      subCategories: {
        HOTELS: { label: "Hotels" },
        PARKING: { label: "Parking" },
        FOOD: { label: "Food" },
        ENTRANCE: { label: "Entrance" },
        FUEL: { label: "Fuel" },
        TOLL: { label: "Toll" },
        CAB: { label: "Cab" },
        GIFTS: { label: "Gifts" }
      }
    },
  
    BUSINESS_EXPENSE: {
      label: "Business Expense",
      splitAllowed: false,
      receiptType: "subscription",
      subCategories: {
        CLICKOPS_DOC: { label: "ClickOps Documentation" },
        CLICKOPS_WEBSITE: { label: "ClickOps Website" },
        CLICKOPS_WORKSPACE: { label: "ClickOps Workspace" },
        CLICKOPS_MARKETING: { label: "ClickOps Marketing" },
        W2S_WORKSPACE: { label: "W2S Workspace" },
        W2S_MARKETING: { label: "W2S Marketing" },
        W2S_WEBSITE: { label: "W2S Website" },
        KODEKOV: { label: "kodekov.in" }
      }
    },
  
    INVESTMENTS: {
      label: "Investments",
      splitAllowed: false,
      receiptType: "manual-only",
      subCategories: {
        MUTUAL_FUNDS: { label: "Mutual Funds" },
        GOLD_JEWEL: { label: "Gold Jewel" },
        NPS: { label: "NPS" },
        POSTAL: { label: "Postal / Small Savings" },
        GOLD_ETF: { label: "Gold & Silver ETF" },
        KNOWLEDGE: { label: "Knowledge / Learning" },
        LIC: { label: "LIC" },
        STOCKS: { label: "Stocks" },
        REAL_ESTATE: { label: "Real Estate" },
        GPAY_GOLD: { label: "GPay Digital Gold" },
        HEALTH_INSURANCE: { label: "Health Insurance" }
      }
    },
  
    GIFT: {
      label: "Gift",
      splitAllowed: false,
      receiptType: "manual",
      subCategories: {
        FAMILY: { label: "Family" },
        PUBLIC: { label: "Public" },
        FRIENDS: { label: "Friends" },
        MOM_DAD: { label: "Mom Dad" }
      }
    },
  
    SOCIAL_LIFE: {
      label: "Social Life",
      splitAllowed: false,
      receiptType: "manual",
      subCategories: {
        OFFICE_TEAM_OUTING: { label: "Office Team Outing" },
        OFFICE_BDAY: { label: "Office Birthday" }
      }
    },
  
    RECHARGES: {
      label: "Recharges",
      splitAllowed: false,
      receiptType: "subscription",
      subCategories: {
        PACKS: { label: "Packs" },
        DATA_TOPUP: { label: "Data TopUp" },
        WIFI_BILL: { label: "WiFi Bill" }
      }
    },
  
    DEBTS: {
      label: "Debts",
      splitAllowed: false,
      receiptType: "manual",
      subCategories: {
        GJG_EMI: { label: "GJG Agam EMI" },
        FAIRLAND_EMI: { label: "Fairland EMI" },
        GOLD_LOAN: { label: "Gold Loan" },
        FRIENDS: { label: "Friends" },
        FAMILY: { label: "Family" },
        ROYAL_GATEWAY_EMI: { label: "Royal Gateway EMI" }
      }
    }
  };
  