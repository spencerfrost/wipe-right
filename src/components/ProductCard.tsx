import { useState } from "react";
import { X, Link, ChevronDown, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { calculateMetrics } from "@/lib/calculations";
import { parseProductUrl } from "@/lib/url-parser";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  isWinner: boolean;
  onUpdate: (updates: Partial<Product>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ProductCard({
  product,
  isWinner,
  onUpdate,
  onRemove,
  canRemove,
}: ProductCardProps) {
  const metrics = calculateMetrics(product);
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

      onUpdate(updates);
      setParseWarnings(result.warnings);
      setUrlInput("");
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "min-w-[280px] flex-shrink-0",
        isWinner && "ring-2 ring-primary bg-primary/5 dark:bg-primary/10"
      )}
    >
      <CardHeader className="pb-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-muted-foreground hover:text-foreground mb-2"
            >
              <span className="flex items-center gap-2">
                <Link className="size-4" />
                Import from URL
              </span>
              <ChevronDown
                className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pb-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Paste product URL..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && urlInput.trim() && !isLoading) {
                      handleParseUrl();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleParseUrl}
                  disabled={isLoading || !urlInput.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                </Button>
              </div>
              {parseError && (
                <p className="text-sm text-destructive">{parseError}</p>
              )}
              {parseWarnings.length > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-500">
                  {parseWarnings.join(" ")}
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex justify-between items-start gap-2">
          <Input
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="font-semibold"
          />
          {canRemove && (
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <X className="size-4" />
            </Button>
          )}
        </div>
        {isWinner && (
          <span className="text-xs font-semibold text-primary-foreground bg-gradient-to-r from-primary to-secondary px-2 py-1 rounded-full w-fit">
            Best Value
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`price-${product.id}`}>Price ($)</Label>
          <Input
            id={`price-${product.id}`}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={product.price}
            onChange={(e) => onUpdate({ price: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor={`rolls-${product.id}`}>Number of Rolls</Label>
          <Input
            id={`rolls-${product.id}`}
            type="number"
            min="1"
            placeholder="0"
            value={product.rolls}
            onChange={(e) => onUpdate({ rolls: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor={`sheets-${product.id}`}>Sheets per Roll</Label>
          <Input
            id={`sheets-${product.id}`}
            type="number"
            min="1"
            placeholder="0"
            value={product.sheetsPerRoll}
            onChange={(e) => onUpdate({ sheetsPerRoll: e.target.value })}
          />
        </div>

        <div>
          <Label>Sheet Size (inches)</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="Width"
              value={product.sheetWidth}
              onChange={(e) => onUpdate({ sheetWidth: e.target.value })}
            />
            <span className="text-muted-foreground">x</span>
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="Height"
              value={product.sheetHeight}
              onChange={(e) => onUpdate({ sheetHeight: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Sheets</span>
            <span className="font-medium">
              {metrics.totalSheets > 0
                ? metrics.totalSheets.toLocaleString()
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Per 100 Sheets</span>
            <span className="font-semibold text-lg">
              {metrics.pricePer100Sheets !== null
                ? `$${metrics.pricePer100Sheets.toFixed(2)}`
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Per Sq Ft</span>
            <span className="font-medium">
              {metrics.pricePerSqFt !== null
                ? `$${metrics.pricePerSqFt.toFixed(3)}`
                : "-"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
