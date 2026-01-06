import type { ParseResult, ParsedProductData } from "./types";
import { fetchWithCorsProxy } from "./fetcher";
import { getRetailerType, parseHtml, containsAntiBotHtml } from "./parsers";

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate warnings for missing fields
 */
function generateWarnings(
  data: ParsedProductData,
  extractedFields: string[]
): string[] {
  const warnings: string[] = [];
  const allFields: (keyof ParsedProductData)[] = [
    "name",
    "price",
    "rolls",
    "sheetsPerRoll",
    "sheetWidth",
    "sheetHeight",
  ];
  const missingFields = allFields.filter(
    (f) => !extractedFields.includes(f) && data[f] === undefined
  );

  if (missingFields.length > 0) {
    const fieldNames: Record<keyof ParsedProductData, string> = {
      name: "product name",
      price: "price",
      rolls: "roll count",
      sheetsPerRoll: "sheets per roll",
      sheetWidth: "sheet width",
      sheetHeight: "sheet height",
    };
    const missing = missingFields.map((f) => fieldNames[f]).join(", ");
    warnings.push(`Could not find: ${missing}`);
  }

  return warnings;
}

/**
 * Parse a product URL and extract product information
 */
export async function parseProductUrl(url: string): Promise<ParseResult> {
  // Validate URL
  if (!url || !isValidUrl(url)) {
    return {
      success: false,
      data: {},
      warnings: [],
      error: "Please enter a valid URL",
    };
  }

  try {
    // Fetch HTML via CORS proxy
    const html = await fetchWithCorsProxy(url);

    // Determine retailer and detect bot-protection pages
    const retailerType = getRetailerType(url);

    if (containsAntiBotHtml(html)) {
      return {
        success: false,
        data: {},
        warnings: [],
        error:
          "This retailer appears to have blocked automated access (bot protection). Try again later or paste product details manually.",
      };
    }

    const data = parseHtml(html, retailerType);

    // Check if we got any useful data
    const extractedFields = Object.keys(data).filter(
      (k) => data[k as keyof typeof data] !== undefined
    );

    if (extractedFields.length === 0) {
      return {
        success: false,
        data: {},
        warnings: [],
        error: "Could not find product information on this page",
      };
    }

    // Generate warnings for missing fields
    const warnings = generateWarnings(data, extractedFields);

    return {
      success: true,
      data,
      warnings,
    };
  } catch (err) {
    return {
      success: false,
      data: {},
      warnings: [],
      error: err instanceof Error ? err.message : "Failed to fetch URL",
    };
  }
}

export type { ParseResult, ParsedProductData, RetailerType } from "./types";
