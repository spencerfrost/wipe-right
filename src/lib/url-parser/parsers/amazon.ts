import type { ParsedProductData } from "../types";
import { extractToiletPaperInfo, parseGeneric } from "./generic";

/**
 * Parse Amazon product page HTML
 */
export function parseAmazon(html: string): ParsedProductData {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const data: ParsedProductData = {};

  // Product title
  const titleEl = doc.querySelector("#productTitle");
  if (titleEl) {
    data.name = titleEl.textContent?.trim();
  }

  // Price - Amazon has multiple possible locations
  const priceSelectors = [
    "#corePrice_feature_div .a-offscreen",
    "#priceblock_ourprice",
    "#priceblock_dealprice",
    ".a-price .a-offscreen",
    "#apex_offerDisplay_desktop .a-offscreen",
    '[data-a-color="price"] .a-offscreen',
  ];

  for (const selector of priceSelectors) {
    const priceEl = doc.querySelector(selector);
    if (priceEl) {
      const priceText = priceEl.textContent || "";
      const priceMatch = priceText.match(/\$?\s*(\d+\.?\d*)/);
      if (priceMatch) {
        data.price = parseFloat(priceMatch[1]);
        break;
      }
    }
  }

  // Product details - look in various detail sections
  const detailSelectors = [
    "#productDetails_techSpec_section_1",
    "#detailBullets_feature_div",
    "#feature-bullets",
    "#productDescription",
    "#aplus",
  ];

  let detailText = "";
  for (const selector of detailSelectors) {
    const el = doc.querySelector(selector);
    if (el) {
      detailText += " " + (el.textContent || "");
    }
  }

  // Also check the title for toilet paper info
  if (data.name) {
    detailText = data.name + " " + detailText;
  }

  // Extract toilet paper specific info from all collected text
  const tpInfo = extractToiletPaperInfo(detailText);
  if (tpInfo.rolls && !data.rolls) data.rolls = tpInfo.rolls;
  if (tpInfo.sheetsPerRoll && !data.sheetsPerRoll) data.sheetsPerRoll = tpInfo.sheetsPerRoll;
  if (tpInfo.sheetWidth && !data.sheetWidth) data.sheetWidth = tpInfo.sheetWidth;
  if (tpInfo.sheetHeight && !data.sheetHeight) data.sheetHeight = tpInfo.sheetHeight;

  // If we didn't get much, fall back to generic parser
  if (!data.name && !data.price) {
    return parseGeneric(html);
  }

  return data;
}
