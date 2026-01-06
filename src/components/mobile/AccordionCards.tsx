import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ProductInputForm } from "@/components/ProductInputForm";
import { calculateMetrics } from "@/lib/calculations";
import type { Product } from "@/types";

interface AccordionCardsProps {
  products: Product[];
  winnerId: string | null;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onRemoveProduct: (id: string) => void;
  onAddProduct: () => void;
  editingProductId?: string | null;
}

export function AccordionCards({
  products,
  winnerId,
  onUpdateProduct,
  onRemoveProduct,
  onAddProduct,
  editingProductId,
}: AccordionCardsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleOpenChange = (id: string, open: boolean) => {
    setExpandedId(open ? id : null);
  };

  useEffect(() => {
    if (editingProductId) {
      const exists = products.some((p) => p.id === editingProductId);
      if (exists) {
        setExpandedId(editingProductId);
      }
    }
  }, [editingProductId, products]);

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const metrics = calculateMetrics(product);
        const isWinner = product.id === winnerId;
        const isExpanded = expandedId === product.id;

        return (
          <Card key={product.id}>
            <Collapsible
              open={isExpanded}
              onOpenChange={(open) => handleOpenChange(product.id, open)}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full px-4 py-3 flex items-center gap-3 text-left">
                  {isExpanded ? (
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {product.name || "Untitled"}
                      </span>
                      {isWinner && (
                        <span className="text-xs font-semibold text-primary-foreground bg-gradient-to-r from-primary to-secondary px-2 py-0.5 rounded-full shrink-0">
                          Best Value
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold text-lg shrink-0">
                    {metrics.pricePer100Sheets !== null
                      ? `$${metrics.pricePer100Sheets.toFixed(2)}`
                      : "-"}
                  </span>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t mx-4" />
                <CardContent className="pt-4">
                  <ProductInputForm
                    product={product}
                    onUpdate={(updates) => onUpdateProduct(product.id, updates)}
                    onDelete={() => onRemoveProduct(product.id)}
                  />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}

      <Button
        variant="outline"
        className="w-full"
        onClick={onAddProduct}
      >
        <Plus className="size-4" />
        Add Product
      </Button>
    </div>
  );
}
