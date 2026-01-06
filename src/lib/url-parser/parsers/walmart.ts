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
function isAntiBotName(name: string): boolean {
  const lower = name.toLowerCase();
  // Detect common anti-bot / captcha placeholder messages
  return /real shoppers|not robots|captcha|\b(bot|robot)\b/i.test(lower);
}

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
          const pname = product.name.trim();
          if (!isAntiBotName(pname)) {
            data.name = pname;
          } else {
            // Detected an anti-bot placeholder name (e.g., "We like real shoppers, not robots!").
            // Skip using it so the app doesn't display confusing messages to users.
          }
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

  // If we didn't get a usable name from __NEXT_DATA__ (or it was rejected as anti-bot),
  // try generic parsing to fill in missing fields (name, price, and toilet paper info).
  if (!data.name) {
    const generic = parseGeneric(html);
    if (generic.name && !isAntiBotName(generic.name)) data.name = generic.name;
    if (!data.price && generic.price) data.price = generic.price;
    if (!data.rolls && generic.rolls) data.rolls = generic.rolls;
    if (!data.sheetsPerRoll && generic.sheetsPerRoll) data.sheetsPerRoll = generic.sheetsPerRoll;
    if (!data.sheetWidth && generic.sheetWidth) data.sheetWidth = generic.sheetWidth;
    if (!data.sheetHeight && generic.sheetHeight) data.sheetHeight = generic.sheetHeight;
  }

  // If we still don't have any useful data, try generic parsing but be careful
  // not to expose anti-bot placeholder names directly. If generic parsing only
  // yields an anti-bot name, treat it as no data.
  if (!data.name && !data.price) {
    const generic = parseGeneric(html);
    if (generic.name && isAntiBotName(generic.name)) {
      // don't expose the anti-bot name
      generic.name = undefined;
    }
    const hasFields = Object.keys(generic).some(
      (k) => generic[k as keyof typeof generic] !== undefined
    );
    if (hasFields) return generic;

    return {};
  }

  return data;
}
