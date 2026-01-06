import { useState } from "react";
import { parseProductUrl } from "@/lib/url-parser";
import type { Product } from "@/types";

export function useUrlParser(onProductDataParsed: (updates: Partial<Product>) => void) {
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);

  const handleParseUrl = async () => {
    setIsLoading(true);
    setParseError(null);
    setParseWarnings([]);

    try {
      const result = await parseProductUrl(urlInput);

      if (!result.success) {
        setParseError(result.error || "Failed to parse URL");
        return;
      }

      const updates: Partial<Product> = {};
      if (result.data.name) updates.name = result.data.name;
      if (result.data.price) updates.price = result.data.price.toString();
      if (result.data.rolls) updates.rolls = result.data.rolls.toString();
      if (result.data.sheetsPerRoll)
        updates.sheetsPerRoll = result.data.sheetsPerRoll.toString();
      if (result.data.sheetWidth)
        updates.sheetWidth = result.data.sheetWidth.toString();
      if (result.data.sheetHeight)
        updates.sheetHeight = result.data.sheetHeight.toString();

      onProductDataParsed(updates);
      setParseWarnings(result.warnings);
      setUrlInput("");
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setParseError(null);
    setParseWarnings([]);
  };

  return {
    urlInput,
    setUrlInput,
    isLoading,
    parseError,
    parseWarnings,
    handleParseUrl,
    clearError,
  };
}