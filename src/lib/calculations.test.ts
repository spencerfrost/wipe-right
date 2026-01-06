import { describe, it, expect } from "vitest";
import { calculateMetrics, findWinner, createEmptyProduct } from "./calculations";
import type { Product } from "@/types";

describe("calculateMetrics", () => {
  it("calculates price per 100 sheets correctly", () => {
    const product: Product = {
      id: "1",
      name: "Test",
      price: "10.00",
      rolls: "12",
      sheetsPerRoll: "200",
      sheetWidth: "4",
      sheetHeight: "4",
      sheetUnit: "in",
    };

    const metrics = calculateMetrics(product);

    // Total sheets: 12 * 200 = 2400
    // Price per 100 sheets: (10 / 2400) * 100 = 0.4166...
    expect(metrics.totalSheets).toBe(2400);
    expect(metrics.pricePer100Sheets).toBeCloseTo(0.4167, 3);
  });

  it("calculates price per square foot correctly", () => {
    const product: Product = {
      id: "1",
      name: "Test",
      price: "10.00",
      rolls: "12",
      sheetsPerRoll: "200",
      sheetWidth: "4",
      sheetHeight: "4",
      sheetUnit: "in",
    };

    const metrics = calculateMetrics(product);

    // Sheet size: (4/12) * (4/12) = 0.1111 sq ft per sheet
    // Total sq ft: 2400 * 0.1111 = 266.67 sq ft
    // Price per sq ft: 10 / 266.67 = 0.0375
    expect(metrics.pricePerSqFt).toBeCloseTo(0.0375, 4);
  });

  it("returns null for invalid inputs", () => {
    const product: Product = {
      id: "1",
      name: "Test",
      price: "",
      rolls: "",
      sheetsPerRoll: "",
      sheetWidth: "",
      sheetHeight: "",
      sheetUnit: "in",
    };

    const metrics = calculateMetrics(product);

    expect(metrics.totalSheets).toBe(0);
    expect(metrics.pricePer100Sheets).toBeNull();
    expect(metrics.pricePerSqFt).toBeNull();
  });

  it("handles zero price", () => {
    const product: Product = {
      id: "1",
      name: "Test",
      price: "0",
      rolls: "12",
      sheetsPerRoll: "200",
      sheetWidth: "4",
      sheetHeight: "4",
      sheetUnit: "in",
    };

    const metrics = calculateMetrics(product);

    expect(metrics.pricePer100Sheets).toBeNull();
    expect(metrics.pricePerSqFt).toBeNull();
  });
});

describe("findWinner", () => {
  it("returns the product with lowest price per 100 sheets", () => {
    const products: Product[] = [
      {
        id: "expensive",
        name: "Expensive",
        price: "20.00",
        rolls: "12",
        sheetsPerRoll: "200",
        sheetWidth: "4",
        sheetHeight: "4",
        sheetUnit: "in",
      },
      {
        id: "cheap",
        name: "Cheap",
        price: "10.00",
        rolls: "12",
        sheetsPerRoll: "200",
        sheetWidth: "4",
        sheetHeight: "4",
        sheetUnit: "in",
      },
    ];

    expect(findWinner(products)).toBe("cheap");
  });

  it("returns null when only one valid product", () => {
    const products: Product[] = [
      {
        id: "1",
        name: "Test",
        price: "10.00",
        rolls: "12",
        sheetsPerRoll: "200",
        sheetWidth: "4",
        sheetHeight: "4",
        sheetUnit: "in",
      },
    ];

    expect(findWinner(products)).toBeNull();
  });

  it("returns null when no valid products", () => {
    const products: Product[] = [
      createEmptyProduct(),
      createEmptyProduct(),
    ];

    expect(findWinner(products)).toBeNull();
  });
});

describe("createEmptyProduct", () => {
  it("creates a product with empty strings", () => {
    const product = createEmptyProduct();

    expect(product.name).toBe("");
    expect(product.price).toBe("");
    expect(product.rolls).toBe("");
    expect(product.sheetsPerRoll).toBe("");
    expect(product.sheetWidth).toBe("");
    expect(product.sheetHeight).toBe("");
    expect(product.id).toBeDefined();
  });

  it("creates unique IDs", () => {
    const product1 = createEmptyProduct();
    const product2 = createEmptyProduct();

    expect(product1.id).not.toBe(product2.id);
  });
});
