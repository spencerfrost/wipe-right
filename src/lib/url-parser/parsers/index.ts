import type { ParsedProductData, RetailerType } from "../types";
import { parseAmazon } from "./amazon";
import { parseWalmart } from "./walmart";
import { parseGeneric } from "./generic";

/**
 * Determine retailer type from URL hostname
 */
export function getRetailerType(url: string): RetailerType {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("amazon")) return "amazon";
    if (hostname.includes("walmart")) return "walmart";
    return "generic";
  } catch {
    return "generic";
  }
}

/**
 * Parse HTML using the appropriate retailer-specific parser
 */
export function parseHtml(html: string, retailerType: RetailerType): ParsedProductData {
  switch (retailerType) {
    case "amazon":
      return parseAmazon(html);
    case "walmart":
      return parseWalmart(html);
    default:
      return parseGeneric(html);
  }
}
