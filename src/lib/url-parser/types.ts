/**
 * Raw parsed product data from URL - all fields optional
 * since different sites provide different levels of data
 */
export interface ParsedProductData {
  name?: string;
  price?: number;
  rolls?: number;
  sheetsPerRoll?: number;
  sheetWidth?: number;
  sheetHeight?: number;
}

/**
 * Result of URL parsing attempt
 */
export interface ParseResult {
  success: boolean;
  data: ParsedProductData;
  warnings: string[];
  error?: string;
}

/**
 * Supported retailer types for parser selection
 */
export type RetailerType = "amazon" | "walmart" | "generic";
