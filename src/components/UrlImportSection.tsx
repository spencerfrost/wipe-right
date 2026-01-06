import { useState } from "react";
import { Link, ChevronDown, Loader2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useUrlParser } from "@/hooks/useUrlParser";
import type { Product } from "@/types";

interface UrlImportSectionProps {
  onProductDataParsed: (updates: Partial<Product>) => void;
  placeholder?: string;
}

export function UrlImportSection({
  onProductDataParsed,
  placeholder = "Paste product URL...",
}: UrlImportSectionProps) {
  const {
    urlInput,
    setUrlInput,
    isLoading,
    parseError,
    parseWarnings,
    handleParseUrl,
  } = useUrlParser(onProductDataParsed);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-muted-foreground hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <Link className="size-4" />
            Import from URL
          </span>
          <ChevronDown
            className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pt-2 pb-4 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder={placeholder}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && urlInput.trim() && !isLoading) {
                  handleParseUrl();
                }
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleParseUrl}
              disabled={isLoading || !urlInput.trim()}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
            </Button>
          </div>
          {parseError && (
            <p className="text-sm text-destructive">{parseError}</p>
          )}
          {parseWarnings.length > 0 && (
            <p className="text-sm text-amber-600 dark:text-amber-500">
              {parseWarnings.join(" ")}
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}