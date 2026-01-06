import { cn } from "@/lib/utils";
import { calculateMetrics } from "@/lib/calculations";
import type { Product } from "@/types";
import { Trophy } from "lucide-react";

interface StickyComparisonProps {
  products: Product[];
  winnerId: string | null;
  activeIndex: number;
  onSelectProduct: (index: number) => void;
}

export function StickyComparison({
  products,
  winnerId,
  activeIndex,
  onSelectProduct,
}: StickyComparisonProps) {
  return (
    <div className="sticky top-0 z-10 bg-background">
      <div className="overflow-x-auto">
        <div className="flex gap-2 p-3 min-w-max">
          {products.map((product, index) => {
            const metrics = calculateMetrics(product);
            const isWinner = product.id === winnerId;
            const isActive = index === activeIndex;

            return (
              <button
                key={product.id}
                onClick={() => onSelectProduct(index)}
                className={cn(
                  "flex flex-col items-center px-4 py-2 rounded-lg transition-all min-w-[128px] relative",
                  "hover:bg-accent",
                  isWinner && "bg-primary/5",
                  isActive && "ring-2 ring-primary scale-105",
                  !isWinner && !isActive && "bg-muted/50"
                )}
              >
                {isWinner && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-full p-0.5">
                      <Trophy className="size-3 text-primary-foreground" />
                    </div>
                  </div>
                )}
                <span className="text-sm font-medium truncate max-w-[80px]">
                  {product.name || `Product ${index + 1}`}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    isWinner ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {metrics.pricePer100Sheets !== null
                    ? `$${metrics.pricePer100Sheets.toFixed(2)}/100`
                    : "-"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
