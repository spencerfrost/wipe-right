import { X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calculateMetrics } from "@/lib/calculations";
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

  return (
    <Card
      className={cn(
        "min-w-[280px] flex-shrink-0",
        isWinner && "ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20"
      )}
    >
      <CardHeader className="pb-4">
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
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full w-fit">
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
