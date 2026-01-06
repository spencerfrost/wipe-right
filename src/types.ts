export type SheetUnit = "in" | "cm";

export interface Product {
  id: string;
  name: string;
  price: string;
  rolls: string;
  sheetsPerRoll: string;
  sheetWidth: string;
  sheetHeight: string;
  sheetUnit: SheetUnit;
}

export interface CalculatedMetrics {
  totalSheets: number;
  pricePer100Sheets: number | null;
  pricePerSqFt: number | null;
}
