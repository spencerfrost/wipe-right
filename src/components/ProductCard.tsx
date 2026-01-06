import { Trash, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calculateMetrics } from "@/lib/calculations";
import { UrlImportSection } from "@/components/UrlImportSection";
import { ProductFormFields } from "@/components/ProductFormFields";
import { MetricsDisplay } from "@/components/MetricsDisplay";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  isWinner: boolean;
  onUpdate: (updates: Partial<Product>) => void;
  onRemove: () => void;
}

export function ProductCard({
  product,
  isWinner,
  onUpdate,
  onRemove,
}: ProductCardProps) {
  return (
    <Card
      className={cn(
        "min-w-[280px] flex-shrink-0",
        isWinner && "ring-2 ring-primary bg-primary/5 dark:bg-primary/10"
      )}
    >
      <CardHeader className="pb-4">
        <UrlImportSection onProductDataParsed={onUpdate} />

        <div className="flex justify-between items-start gap-2">
          <Input
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="font-semibold"
          />
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <X className="size-4" />
          </Button>
        </div>
        {isWinner && (
          <span className="text-xs font-semibold text-primary-foreground bg-gradient-to-r from-primary to-secondary px-2 py-1 rounded-full w-fit">
            Best Value
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <ProductFormFields
          product={product}
          onUpdate={onUpdate}
          showSheetSize={true}
          collapsibleSheetSize={false}
          showUnitToggles={false}
        />

        <MetricsDisplay metrics={calculateMetrics(product)} isWinner={isWinner} />
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="destructive" size="sm" onClick={onRemove}>
          <Trash className="size-4 mr-2" />
          Remove Product
        </Button>
      </CardFooter>
    </Card>
  );
}
