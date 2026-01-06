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
 * Detect common anti-bot / captcha pages from retailer HTML
 */
export function containsAntiBotHtml(html: string): boolean {
  if (!html) return false;
  const lower = html.toLowerCase();
  return /we like real shoppers|not robots|captcha|verify you are a human|please verify|enter the characters|are you human|are you a human/i.test(lower);
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
