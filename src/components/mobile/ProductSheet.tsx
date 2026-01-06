import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProductInputForm } from "@/components/ProductInputForm";
import type { Product } from "@/types";

interface ProductSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Product>) => void;
  onDelete: () => void;
}

export function ProductSheet({
  product,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: ProductSheetProps) {
  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="gap-0 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="p-3">
          <SheetTitle>
            Editing: {product.name || "Unnamed Product"}
          </SheetTitle>
        </SheetHeader>

        <div className="p-3">
          <ProductInputForm
            product={product}
            onUpdate={onUpdate}
          />
        </div>

        <SheetFooter className="flex-row gap-2 px-3">
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="flex-1"
            >
              Delete
            </Button>
          <Button onClick={onClose} className="flex-1">
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
