import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import type { Product } from "@/types";

interface ProductFormFieldsProps {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
  compact?: boolean;
  showSheetSize?: boolean;
  collapsibleSheetSize?: boolean;
  showUnitToggles?: boolean;
}

export function ProductFormFields({
  product,
  onUpdate,
  compact = false,
  showSheetSize = true,
  collapsibleSheetSize = false,
  showUnitToggles = false,
}: ProductFormFieldsProps) {
  const [isSheetSizeOpen, setIsSheetSizeOpen] = useState(false);

  const inputClassName = compact ? "h-8 text-sm" : "";
  const labelClassName = compact ? "text-sm" : "";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`price-${product.id}`} className={labelClassName}>
          Price ($)
        </Label>
        <Input
          id={`price-${product.id}`}
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={product.price}
          onChange={(e) => onUpdate({ price: e.target.value })}
          className={inputClassName}
        />
      </div>

      <div>
        <Label htmlFor={`rolls-${product.id}`} className={labelClassName}>
          Number of Rolls
        </Label>
        <Input
          id={`rolls-${product.id}`}
          type="number"
          min="1"
          placeholder={compact ? "0" : "eg. 8"}
          value={product.rolls}
          onChange={(e) => onUpdate({ rolls: e.target.value })}
          className={inputClassName}
        />
      </div>

      <div>
        <Label htmlFor={`sheets-${product.id}`} className={labelClassName}>
          Sheets per Roll
        </Label>
        <Input
          id={`sheets-${product.id}`}
          type="number"
          min="1"
          placeholder={compact ? "0" : "eg. 220"}
          value={product.sheetsPerRoll}
          onChange={(e) => onUpdate({ sheetsPerRoll: e.target.value })}
          className={inputClassName}
        />
      </div>

      {showSheetSize && (
        <>
          {collapsibleSheetSize ? (
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
                  {showUnitToggles && (
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
                  )}
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Width"
                      value={product.sheetWidth}
                      onChange={(e) => onUpdate({ sheetWidth: e.target.value })}
                      className={inputClassName}
                    />
                    <span className="text-muted-foreground">x</span>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Height"
                      value={product.sheetHeight}
                      onChange={(e) => onUpdate({ sheetHeight: e.target.value })}
                      className={inputClassName}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div>
              <Label className={labelClassName}>
                Sheet Size ({product.sheetUnit === "cm" ? "cm" : "inches"})
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Width"
                  value={product.sheetWidth}
                  onChange={(e) => onUpdate({ sheetWidth: e.target.value })}
                  className={inputClassName}
                />
                <span className="text-muted-foreground">x</span>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Height"
                  value={product.sheetHeight}
                  onChange={(e) => onUpdate({ sheetHeight: e.target.value })}
                  className={inputClassName}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}