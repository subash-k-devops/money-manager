import { getCategories } from "../storage";

function flatFromCategoryObject(categoryObj) {
  const list = [];
  if (!categoryObj || typeof categoryObj !== "object") return list;
  Object.entries(categoryObj).forEach(([mainName, main]) => {
    if (!main || !main.sub) return;
    Object.entries(main.sub).forEach(([subName, emoji]) => {
      list.push({
        mainCategory: mainName,
        subCategory: subName,
        emoji: emoji || "📌",
        label: `${emoji || "📌"} ${subName}`,
        fullLabel: `${main.emoji || ""} ${mainName} → ${emoji || "📌"} ${subName}`,
      });
    });
  });
  return list;
}

export function getFlatCategories() {
  const { expense } = getCategories();
  return flatFromCategoryObject(expense);
}

export function getFlatIncomeCategories() {
  const { income } = getCategories();
  return flatFromCategoryObject(income);
}

export function getMainCategories(type = "expense") {
  const cats = getCategories()[type];
  if (!cats) return [];
  return Object.entries(cats).map(([name, data]) => ({
    name,
    emoji: data.emoji || "📌",
    subs: Object.entries(data.sub || {}).map(([subName, subEmoji]) => ({
      name: subName,
      emoji: subEmoji || "📌",
    })),
  }));
}
