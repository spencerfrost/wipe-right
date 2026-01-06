import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UrlImportSection } from "@/components/UrlImportSection";
import { ProductFormFields } from "@/components/ProductFormFields";
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
      <UrlImportSection
        onProductDataParsed={onUpdate}
        placeholder="Paste Amazon, Walmart, or product URL..."
      />

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

      <ProductFormFields
        product={product}
        onUpdate={onUpdate}
        showSheetSize={true}
        collapsibleSheetSize={true}
        showUnitToggles={true}
      />
    </div>
  );
}
