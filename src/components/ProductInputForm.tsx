import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="space-y-4">
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
    </div>
  );
}
