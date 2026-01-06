import { cn } from "@/lib/utils";
import type { CalculatedMetrics } from "@/types";

interface MetricsDisplayProps {
  metrics: CalculatedMetrics | null;
  isWinner?: boolean;
  compact?: boolean;
}

export function MetricsDisplay({
  metrics,
  isWinner = false,
  compact = false,
}: MetricsDisplayProps) {
  if (!metrics) return null;

  const containerClass = compact ? "space-y-1" : "pt-4 border-t space-y-2";
  const labelClass = compact ? "text-xs" : "text-sm";
  const valueClass = compact ? "text-sm" : "";

  return (
    <div className={containerClass}>
      <div className="flex justify-between">
        <span className={cn(labelClass, "text-muted-foreground")}>Total Sheets</span>
        <span className={cn("font-medium", valueClass)}>
          {metrics.totalSheets > 0
            ? metrics.totalSheets.toLocaleString()
            : "-"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className={cn(labelClass, "text-muted-foreground")}>Per 100 Sheets</span>
        <span className={cn(
          "font-semibold",
          compact ? "text-base" : "text-lg",
          isWinner && "text-primary"
        )}>
          {metrics.pricePer100Sheets !== null
            ? `$${metrics.pricePer100Sheets.toFixed(2)}`
            : "-"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className={cn(labelClass, "text-muted-foreground")}>Per Sq Ft</span>
        <span className={cn("font-medium", valueClass)}>
          {metrics.pricePerSqFt !== null
            ? `$${metrics.pricePerSqFt.toFixed(3)}`
            : "-"}
        </span>
      </div>
    </div>
  );
}