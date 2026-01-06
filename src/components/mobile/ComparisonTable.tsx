import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateMetrics } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ComparisonTableProps {
  products: Product[];
  winnerId: string | null;
  onEditProduct: (id: string) => void;
  onAddProduct: () => void;
}

export function ComparisonTable({
  products,
  winnerId,
  onEditProduct,
  onAddProduct,
}: ComparisonTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-background border-b border-r p-2 text-left text-sm font-medium text-muted-foreground">
                Product
              </th>
              <th className="border-b p-2 text-left min-w-[120px] text-sm font-medium text-muted-foreground">
                Per 100 Sheets
              </th>
              <th className="border-b p-2 text-left min-w-[120px] text-sm font-medium text-muted-foreground">
                Price
              </th>
              <th className="border-b p-2 text-left min-w-[120px] text-sm font-medium text-muted-foreground">
                Per Sq Ft
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isWinner = product.id === winnerId;
              const metrics = calculateMetrics(product);
              const price = parseFloat(product.price);
              return (
                <tr key={product.id}>
                  <td className={cn(
                    "sticky left-0 bg-background border-b border-r p-2 text-left text-md",
                    isWinner && "bg-primary/10"
                  )}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-foreground">
                        {((product.name || "-").length > 20 ? (product.name || "-").slice(0,16) + "..." : (product.name || "-"))}
                      </span>
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditProduct(product.id)}
                        >
                        <Pencil className="size-4" />
                        </Button>
                    </div>
                  </td>
                  <td className={cn(
                    "border-b p-2",
                    isWinner && "bg-primary/10 ring-2 ring-inset ring-primary"
                  )}>
                    <span className={cn(
                      "text-lg font-bold",
                      isWinner && "text-primary"
                    )}>
                      {metrics.pricePer100Sheets !== null
                        ? `$${metrics.pricePer100Sheets.toFixed(2)}`
                        : "-"}
                    </span>
                  </td>
                  <td className={cn(
                    "border-b p-2",
                    isWinner && "bg-primary/10"
                  )}>
                    <span className="font-medium">
                      {!isNaN(price) && price > 0
                        ? `$${price.toFixed(2)}`
                        : "-"}
                    </span>
                  </td>
                  <td className={cn(
                    "border-b p-2",
                    isWinner && "bg-primary/10"
                  )}>
                    <span className="font-medium">
                      {metrics.pricePerSqFt !== null
                        ? `$${metrics.pricePerSqFt.toFixed(3)}`
                        : "-"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddProduct}
          className="text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
}
