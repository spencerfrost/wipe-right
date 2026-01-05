import { Plus } from "lucide-react";
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-max border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-background border-b border-r p-3 text-left text-sm font-medium text-muted-foreground">
              &nbsp;
            </th>
            {products.map((product) => {
              const isWinner = product.id === winnerId;
              return (
                <th
                  key={product.id}
                  className={cn(
                    "border-b p-3 text-left min-w-[120px]",
                    isWinner && "bg-primary/10"
                  )}
                >
                  <span className="font-semibold text-foreground">
                    {product.name || "Product"}
                  </span>
                  {isWinner && (
                    <span className="ml-2 text-xs font-semibold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-full">
                      Best
                    </span>
                  )}
                </th>
              );
            })}
            <th className="border-b p-3">
              <Button variant="outline" size="sm" onClick={onAddProduct}>
                <Plus className="size-4" />
                Add
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Price Row */}
          <tr>
            <td className="sticky left-0 bg-background border-b border-r p-3 text-sm font-medium text-muted-foreground">
              Price
            </td>
            {products.map((product) => {
              const isWinner = product.id === winnerId;
              const price = parseFloat(product.price);
              return (
                <td
                  key={product.id}
                  className={cn(
                    "border-b p-3",
                    isWinner && "bg-primary/10"
                  )}
                >
                  <span className="font-medium">
                    {!isNaN(price) && price > 0
                      ? `$${price.toFixed(2)}`
                      : "-"}
                  </span>
                </td>
              );
            })}
            <td className="border-b p-3">&nbsp;</td>
          </tr>

          {/* Per 100 Sheets Row - KEY METRIC */}
          <tr>
            <td className="sticky left-0 bg-background border-b border-r p-3 text-sm font-medium text-muted-foreground">
              Per 100 Sheets
            </td>
            {products.map((product) => {
              const isWinner = product.id === winnerId;
              const metrics = calculateMetrics(product);
              return (
                <td
                  key={product.id}
                  className={cn(
                    "border-b p-3",
                    isWinner && "bg-primary/10 ring-2 ring-inset ring-primary"
                  )}
                >
                  <span className={cn(
                    "text-lg font-bold",
                    isWinner && "text-primary"
                  )}>
                    {metrics.pricePer100Sheets !== null
                      ? `$${metrics.pricePer100Sheets.toFixed(2)}`
                      : "-"}
                  </span>
                </td>
              );
            })}
            <td className="border-b p-3">&nbsp;</td>
          </tr>

          {/* Per Sq Ft Row */}
          <tr>
            <td className="sticky left-0 bg-background border-b border-r p-3 text-sm font-medium text-muted-foreground">
              Per Sq Ft
            </td>
            {products.map((product) => {
              const isWinner = product.id === winnerId;
              const metrics = calculateMetrics(product);
              return (
                <td
                  key={product.id}
                  className={cn(
                    "border-b p-3",
                    isWinner && "bg-primary/10"
                  )}
                >
                  <span className="font-medium">
                    {metrics.pricePerSqFt !== null
                      ? `$${metrics.pricePerSqFt.toFixed(3)}`
                      : "-"}
                  </span>
                </td>
              );
            })}
            <td className="border-b p-3">&nbsp;</td>
          </tr>

          {/* Edit Button Row */}
          <tr>
            <td className="sticky left-0 bg-background border-r p-3 text-sm font-medium text-muted-foreground">
              &nbsp;
            </td>
            {products.map((product) => {
              const isWinner = product.id === winnerId;
              return (
                <td
                  key={product.id}
                  className={cn(
                    "p-3",
                    isWinner && "bg-primary/10"
                  )}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditProduct(product.id)}
                  >
                    Edit
                  </Button>
                </td>
              );
            })}
            <td className="p-3">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
