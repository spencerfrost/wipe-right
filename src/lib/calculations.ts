import type { Product, CalculatedMetrics } from "@/types";

const CM_TO_INCHES = 0.393701;

export function calculateMetrics(product: Product): CalculatedMetrics {
  const price = parseFloat(product.price);
  const rolls = parseFloat(product.rolls);
  const sheetsPerRoll = parseFloat(product.sheetsPerRoll);
  let width = parseFloat(product.sheetWidth);
  let height = parseFloat(product.sheetHeight);

  // Convert cm to inches if needed
  if (product.sheetUnit === "cm") {
    width *= CM_TO_INCHES;
    height *= CM_TO_INCHES;
  }

  const totalSheets = rolls * sheetsPerRoll;

  // Price per 100 sheets
  const pricePer100Sheets =
    price > 0 && totalSheets > 0 ? (price / totalSheets) * 100 : null;

  // Square footage calculation (width/height are now in inches)
  const sqFtPerSheet =
    width > 0 && height > 0 ? (width / 12) * (height / 12) : null;

  const pricePerSqFt =
    price > 0 && totalSheets > 0 && sqFtPerSheet
      ? price / (totalSheets * sqFtPerSheet)
      : null;

  return { totalSheets: totalSheets || 0, pricePer100Sheets, pricePerSqFt };
}

export function findWinner(products: Product[]): string | null {
  let winnerId: string | null = null;
  let lowestPrice = Infinity;
  let validCount = 0;

  for (const product of products) {
    const metrics = calculateMetrics(product);
    if (metrics.pricePer100Sheets !== null) {
      validCount++;
      if (metrics.pricePer100Sheets < lowestPrice) {
        lowestPrice = metrics.pricePer100Sheets;
        winnerId = product.id;
      }
    }
  }

  return validCount >= 2 ? winnerId : null;
}

export function createEmptyProduct(): Product {
  return {
    id: crypto.randomUUID(),
    name: "",
    price: "",
    rolls: "",
    sheetsPerRoll: "",
    sheetWidth: "",
    sheetHeight: "",
    sheetUnit: "in",
  };
}
