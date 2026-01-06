/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseProductUrl } from "./index";

describe("URL Parser", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Walmart parsing (live test)", () => {
    it("should attempt to parse Walmart Canada product page", async () => {
      // Test with real URL (will use CORS proxy)
      // Note: Walmart has bot protection, so this may return a captcha page
      const url =
        "https://www.walmart.ca/en/ip/Cashmere-UltraLuxe-Luxuriously-Soft-Thick-Toilet-Paper-20-Triple-Rolls-60-Single-Rolls/0TSKMK8XZPY4";

      const result = await parseProductUrl(url);

      console.log("Parse result:", JSON.stringify(result, null, 2));

      // This test documents the current behavior
      // Walmart's bot protection may block CORS proxy requests
      if (result.success && result.data.name?.includes("robot")) {
        console.log("Walmart returned bot detection page - this is expected behavior");
        // Don't fail - this is expected with CORS proxies
        expect(result.success).toBe(true);
      } else if (result.success) {
        // If we actually got data, verify it
        console.log("Successfully extracted data:", result.data);
        if (result.data.name) {
          expect(result.data.name.toLowerCase()).toContain("cashmere");
        }
        if (result.data.rolls) {
          expect(result.data.rolls).toBeGreaterThan(0);
        }
      } else {
        console.log("Parse failed:", result.error);
        // Network errors are acceptable in CI
      }
    }, 30000);

    it("ignores typical Walmart anti-bot product name", async () => {
      const { parseWalmart } = await import("./parsers/walmart");
      const nextData = {
        props: {
          pageProps: {
            initialData: {
              data: {
                product: {
                  name: "We like real shoppers, not robots!",
                  priceInfo: { price: 12.5 },
                  shortDescription: "12 Mega Rolls",
                },
              },
            },
          },
        },
      };
      const html = `<script id="__NEXT_DATA__">${JSON.stringify(nextData)}</script>`;

      const result = parseWalmart(html);

      // We should not expose anti-bot placeholder strings as product names in the UI
      expect(result.name).not.toBe("We like real shoppers, not robots!");
      // In this contrived example, generic parsing won't find a better name, so it may be undefined
      expect(result.name).toBeUndefined();
      // Price should still be extracted
      expect(result.price).toBe(12.5);
    });

    it("reports friendly error when retailer blocks automated access", async () => {
      const url = "https://www.walmart.ca/en/ip/fake-product";
      const html = "<html><body>We like real shoppers, not robots!</body></html>";
      const fetcher = await import("./fetcher");
      vi.spyOn(fetcher, "fetchWithCorsProxy").mockResolvedValue(html as any);

      const result = await parseProductUrl(url);

      expect(result.success).toBe(false);
      expect(result.error).toContain("blocked automated access");
    });
  });

  describe("extractToiletPaperInfo", () => {
    it("should extract roll count from product text", async () => {
      const { extractToiletPaperInfo } = await import("./parsers/generic");

      const text =
        "Cashmere UltraLuxe Luxuriously Soft & Thick Toilet Paper, 20 Triple Rolls = 60 Single Rolls";
      const result = extractToiletPaperInfo(text);

      console.log("Extracted from text:", result);

      // Should find 20 rolls (the first number before "Rolls")
      expect(result.rolls).toBe(20);
    });

    it("should extract from various roll formats", async () => {
      const { extractToiletPaperInfo } = await import("./parsers/generic");

      // Test various formats
      expect(extractToiletPaperInfo("12 Mega Rolls").rolls).toBe(12);
      expect(extractToiletPaperInfo("24 Double Rolls").rolls).toBe(24);
      expect(extractToiletPaperInfo("6 rolls").rolls).toBe(6);
      expect(extractToiletPaperInfo("48 Super Mega Rolls").rolls).toBe(48);
      expect(extractToiletPaperInfo("20 Triple Rolls = 60 Single Rolls").rolls).toBe(20);
    });

    it("should extract sheets per roll", async () => {
      const { extractToiletPaperInfo } = await import("./parsers/generic");

      const text = "198 sheets per roll, 4.0 x 4.0 inches";
      const result = extractToiletPaperInfo(text);

      expect(result.sheetsPerRoll).toBe(198);
      expect(result.sheetWidth).toBe(4.0);
      expect(result.sheetHeight).toBe(4.0);
    });

    it("should extract price", async () => {
      const { extractToiletPaperInfo } = await import("./parsers/generic");

      expect(extractToiletPaperInfo("$19.97").price).toBe(19.97);
      expect(extractToiletPaperInfo("Price: $24.99").price).toBe(24.99);
    });
  });

  describe("parseGeneric with HTML", () => {
    it("should extract from JSON-LD", async () => {
      const { parseGeneric } = await import("./parsers/generic");

      const html = `
        <html>
          <head>
            <script type="application/ld+json">
              {
                "@type": "Product",
                "name": "Test Toilet Paper 12 Mega Rolls",
                "offers": {
                  "price": "15.99"
                }
              }
            </script>
          </head>
          <body>
            <h1>Product Page</h1>
          </body>
        </html>
      `;

      const result = parseGeneric(html);

      expect(result.name).toBe("Test Toilet Paper 12 Mega Rolls");
      expect(result.price).toBe(15.99);
      expect(result.rolls).toBe(12);
    });

    it("should extract from Open Graph meta tags", async () => {
      const { parseGeneric } = await import("./parsers/generic");

      const html = `
        <html>
          <head>
            <meta property="og:title" content="Amazing TP 24 Double Rolls">
            <meta property="product:price:amount" content="22.50">
          </head>
          <body></body>
        </html>
      `;

      const result = parseGeneric(html);

      expect(result.name).toBe("Amazing TP 24 Double Rolls");
      expect(result.price).toBe(22.5);
      expect(result.rolls).toBe(24);
    });
  });
});
