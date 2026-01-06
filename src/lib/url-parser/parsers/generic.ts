import type { ParsedProductData } from "../types";

/**
 * Extract JSON-LD structured data from HTML
 */
function extractJsonLd(doc: Document): ParsedProductData {
  const data: ParsedProductData = {};
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');

  for (const script of scripts) {
    try {
      const json = JSON.parse(script.textContent || "");
      const items = Array.isArray(json) ? json : [json];

      for (const item of items) {
        if (item["@type"] === "Product" || item["@type"]?.includes("Product")) {
          if (item.name) data.name = item.name;
          if (item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offers.price) data.price = parseFloat(offers.price);
          }
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  return data;
}

/**
 * Extract Open Graph meta tags
 */
function extractOpenGraph(doc: Document): ParsedProductData {
  const data: ParsedProductData = {};

  const ogTitle = doc.querySelector('meta[property="og:title"]');
  if (ogTitle) data.name = ogTitle.getAttribute("content") || undefined;

  const ogPrice = doc.querySelector('meta[property="product:price:amount"]');
  if (ogPrice) {
    const price = parseFloat(ogPrice.getAttribute("content") || "");
    if (!isNaN(price)) data.price = price;
  }

  return data;
}

/**
 * Extract from common HTML patterns (itemprop, common classes)
 */
function extractHtmlPatterns(doc: Document): ParsedProductData {
  const data: ParsedProductData = {};

  // Product name
  const nameEl =
    doc.querySelector('[itemprop="name"]') ||
    doc.querySelector(".product-title") ||
    doc.querySelector(".product-name") ||
    doc.querySelector("h1");
  if (nameEl) data.name = nameEl.textContent?.trim();

  // Price
  const priceEl =
    doc.querySelector('[itemprop="price"]') ||
    doc.querySelector(".price") ||
    doc.querySelector('[data-price]');
  if (priceEl) {
    const priceText = priceEl.getAttribute("content") || priceEl.textContent || "";
    const priceMatch = priceText.match(/\$?\s*(\d+\.?\d*)/);
    if (priceMatch) data.price = parseFloat(priceMatch[1]);
  }

  return data;
}

/**
 * Extract toilet paper specific info from text using regex
 */
export function extractToiletPaperInfo(text: string): ParsedProductData {
  const data: ParsedProductData = {};

  // Roll count: "12 rolls", "24 mega rolls", "20 Triple Rolls", etc.
  // Allow any word(s) between the number and "roll(s)"
  const rollMatch = text.match(/(\d+)\s+(?:\w+\s+)*rolls?\b/i);
  if (rollMatch) data.rolls = parseInt(rollMatch[1], 10);

  // Sheets per roll: "200 sheets per roll", "300 sheets/roll"
  const sheetsMatch = text.match(/(\d+)\s*sheets?\s*(?:per|\/)\s*roll/i);
  if (sheetsMatch) data.sheetsPerRoll = parseInt(sheetsMatch[1], 10);

  // Sheet dimensions: "4.5 x 4.0 inches", "4" x 4""
  const dimMatch = text.match(/(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*(?:in|inch|inches|"|'')?/i);
  if (dimMatch) {
    data.sheetWidth = parseFloat(dimMatch[1]);
    data.sheetHeight = parseFloat(dimMatch[2]);
  }

  // Price fallback
  const priceMatch = text.match(/\$\s*(\d+\.?\d{0,2})/);
  if (priceMatch && !data.price) {
    data.price = parseFloat(priceMatch[1]);
  }

  return data;
}

/**
 * Merge multiple ParsedProductData objects, preferring earlier sources
 */
function mergeData(...sources: ParsedProductData[]): ParsedProductData {
  const result: ParsedProductData = {};

  for (const source of sources) {
    if (source.name && !result.name) result.name = source.name;
    if (source.price && !result.price) result.price = source.price;
    if (source.rolls && !result.rolls) result.rolls = source.rolls;
    if (source.sheetsPerRoll && !result.sheetsPerRoll) result.sheetsPerRoll = source.sheetsPerRoll;
    if (source.sheetWidth && !result.sheetWidth) result.sheetWidth = source.sheetWidth;
    if (source.sheetHeight && !result.sheetHeight) result.sheetHeight = source.sheetHeight;
  }

  return result;
}

/**
 * Generic parser that tries multiple strategies
 */
export function parseGeneric(html: string): ParsedProductData {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const jsonLdData = extractJsonLd(doc);
  const ogData = extractOpenGraph(doc);
  const htmlData = extractHtmlPatterns(doc);
  const textData = extractToiletPaperInfo(html);

  return mergeData(jsonLdData, ogData, htmlData, textData);
}
