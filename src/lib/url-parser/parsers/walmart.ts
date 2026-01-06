import type { ParsedProductData } from "../types";
import { extractToiletPaperInfo, parseGeneric } from "./generic";

/**
 * Navigate nested object safely
 */
function getNestedValue(obj: unknown, path: string[]): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Parse Walmart product page HTML
 * Walmart uses Next.js which embeds product data in __NEXT_DATA__ script
 */
export function parseWalmart(html: string): ParsedProductData {
  const data: ParsedProductData = {};

  // Try to extract __NEXT_DATA__ JSON
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);

  if (nextDataMatch) {
    try {
      const nextData = JSON.parse(nextDataMatch[1]);

      // Navigate to product data - Walmart's structure varies
      const productPaths = [
        ["props", "pageProps", "initialData", "data", "product"],
        ["props", "pageProps", "initialState", "product"],
        ["props", "pageProps", "product"],
      ];

      let product: Record<string, unknown> | undefined;
      for (const path of productPaths) {
        const found = getNestedValue(nextData, path);
        if (found && typeof found === "object") {
          product = found as Record<string, unknown>;
          break;
        }
      }

      if (product) {
        // Product name
        if (typeof product.name === "string") {
          data.name = product.name;
        }

        // Price - check various locations
        const priceInfo = product.priceInfo as Record<string, unknown> | undefined;
        if (priceInfo) {
          const currentPrice = priceInfo.currentPrice as Record<string, unknown> | undefined;
          if (currentPrice && typeof currentPrice.price === "number") {
            data.price = currentPrice.price;
          } else if (typeof priceInfo.price === "number") {
            data.price = priceInfo.price;
          }
        }

        // Try to get price from offers
        if (!data.price && product.offers) {
          const offers = product.offers as Record<string, unknown>;
          if (typeof offers.price === "number") {
            data.price = offers.price;
          }
        }

        // Look for toilet paper info in product description/details
        const descriptionFields = ["shortDescription", "description", "longDescription"];
        let descText = data.name || "";

        for (const field of descriptionFields) {
          if (typeof product[field] === "string") {
            descText += " " + product[field];
          }
        }

        // Check product attributes/specifications
        const specs = product.specifications as Array<{ name: string; value: string }> | undefined;
        if (Array.isArray(specs)) {
          for (const spec of specs) {
            descText += ` ${spec.name}: ${spec.value}`;
          }
        }

        // Extract toilet paper specific info
        const tpInfo = extractToiletPaperInfo(descText);
        if (tpInfo.rolls) data.rolls = tpInfo.rolls;
        if (tpInfo.sheetsPerRoll) data.sheetsPerRoll = tpInfo.sheetsPerRoll;
        if (tpInfo.sheetWidth) data.sheetWidth = tpInfo.sheetWidth;
        if (tpInfo.sheetHeight) data.sheetHeight = tpInfo.sheetHeight;
      }
    } catch {
      // JSON parse failed, fall through to generic
    }
  }

  // If we didn't get useful data from __NEXT_DATA__, try generic parsing
  if (!data.name && !data.price) {
    return parseGeneric(html);
  }

  return data;
}
