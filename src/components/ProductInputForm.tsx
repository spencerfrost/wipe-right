import { useState } from "react";
import { X, Link, ChevronDown, Loader2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { parseProductUrl } from "@/lib/url-parser";
import { Toggle } from "@/components/ui/toggle";
import type { Product } from "@/types";

interface ProductInputFormProps {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
  onDelete?: () => void;
  canDelete: boolean;
}

export function ProductInputForm({
  product,
  onUpdate,
  onDelete,
  canDelete,
}: ProductInputFormProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [isUrlOpen, setIsUrlOpen] = useState(false);
  const [isSheetSizeOpen, setIsSheetSizeOpen] = useState(false);

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

      // Convert parsed data to Partial<Product> with string values
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
    <div className="space-y-4">
      <Collapsible open={isUrlOpen} onOpenChange={setIsUrlOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <Link className="size-4" />
              Import from URL
            </span>
            <ChevronDown
              className={`size-4 transition-transform ${isUrlOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-2 pb-4 space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Paste Amazon, Walmart, or product URL..."
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
        {canDelete && onDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <X className="size-4" />
          </Button>
        )}
      </div>

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
          placeholder="eg. 8"
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
          placeholder="eg. 220"
          value={product.sheetsPerRoll}
          onChange={(e) => onUpdate({ sheetsPerRoll: e.target.value })}
        />
      </div>

      <Collapsible open={isSheetSizeOpen} onOpenChange={setIsSheetSizeOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
          >
            <span>Sheet Size</span>
            <ChevronDown
              className={`size-4 transition-transform ${isSheetSizeOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-2 space-y-2">
            <div className="flex gap-1">
              <Toggle
                size="sm"
                pressed={product.sheetUnit === "in"}
                onPressedChange={() => onUpdate({ sheetUnit: "in" })}
              >
                in
              </Toggle>
              <Toggle
                size="sm"
                pressed={product.sheetUnit === "cm"}
                onPressedChange={() => onUpdate({ sheetUnit: "cm" })}
              >
                cm
              </Toggle>
            </div>
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
