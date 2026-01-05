import { useEffect, useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StickyComparison } from "@/components/mobile/StickyComparison";
import { cn } from "@/lib/utils";
import { calculateMetrics } from "@/lib/calculations";
import type { Product } from "@/types";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper.css';

interface SwipeableCardsProps {
  products: Product[];
  winnerId: string | null;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onRemoveProduct: (id: string) => void;
  onAddProduct: () => void;
  canRemove: boolean;
}

export function SwipeableCards({
  products,
  winnerId,
  activeIndex: initialActiveIndex,
  onIndexChange,
  onUpdateProduct,
  onRemoveProduct,
  onAddProduct,
  canRemove,
}: SwipeableCardsProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const swiperRef = useRef<any>(null);

  // Update local activeIndex when prop changes
  useEffect(() => {
    setActiveIndex(initialActiveIndex);
    if (swiperRef.current) {
      swiperRef.current.slideTo(initialActiveIndex);
    }
  }, [initialActiveIndex]);

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
    onIndexChange(newIndex);
  };

  const handleSelectProduct = (index: number) => {
    setActiveIndex(index);
    onIndexChange(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div className="">
      <StickyComparison
        products={products}
        winnerId={winnerId}
        activeIndex={activeIndex}
        onSelectProduct={handleSelectProduct}
      />

      {/* Swiper carousel */}
      <Swiper
        modules={[Pagination]}
        spaceBetween={4}
        slidesPerView={1.2}
        centeredSlides={true}
        initialSlide={activeIndex}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="!pt-4 border-t-0"
      >
        {products.map((product, index) => {
          const metrics = calculateMetrics(product);
          const isWinner = product.id === winnerId;

          return (
            <SwiperSlide key={product.id} className="h-full">
                {isWinner && (
                  <div className="absolute -top-4 right-3 z-10">
                    <span className="text-xs font-semibold text-primary-foreground bg-gradient-to-r from-primary to-secondary px-2 py-1 rounded-full w-fit">
                      Best Value
                    </span>
                  </div>
                )}
              <Card
                className={cn(
                  "h-full mb-1",
                  isWinner && "ring-2 ring-primary bg-primary/5 dark:bg-primary/10"
                )}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <Input
                      placeholder={`Product ${index + 1}`}
                      value={product.name}
                      onChange={(e) =>
                        onUpdateProduct(product.id, { name: e.target.value })
                      }
                      className="font-semibold"
                    />
                    {canRemove && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveProduct(product.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`price-${product.id}`}>Price ($)</Label>
                    <Input
                      id={`price-${product.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={product.price}
                      onChange={(e) =>
                        onUpdateProduct(product.id, { price: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor={`rolls-${product.id}`}>Number of Rolls</Label>
                    <Input
                      id={`rolls-${product.id}`}
                      type="number"
                      min="1"
                      placeholder="0"
                      value={product.rolls}
                      onChange={(e) =>
                        onUpdateProduct(product.id, { rolls: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor={`sheets-${product.id}`}>Sheets per Roll</Label>
                    <Input
                      id={`sheets-${product.id}`}
                      type="number"
                      min="1"
                      placeholder="0"
                      value={product.sheetsPerRoll}
                      onChange={(e) =>
                        onUpdateProduct(product.id, { sheetsPerRoll: e.target.value })
                      }
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
                        onChange={(e) =>
                          onUpdateProduct(product.id, { sheetWidth: e.target.value })
                        }
                      />
                      <span className="text-muted-foreground">x</span>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Height"
                        value={product.sheetHeight}
                        onChange={(e) =>
                          onUpdateProduct(product.id, { sheetHeight: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Sheets</span>
                      <span className="font-medium">
                        {metrics.totalSheets > 0
                          ? metrics.totalSheets.toLocaleString()
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Per 100 Sheets</span>
                      <span className="font-semibold text-lg">
                        {metrics.pricePer100Sheets !== null
                          ? `$${metrics.pricePer100Sheets.toFixed(2)}`
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Per Sq Ft</span>
                      <span className="font-medium">
                        {metrics.pricePerSqFt !== null
                          ? `$${metrics.pricePerSqFt.toFixed(3)}`
                          : "-"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Floating Add button */}
      <Button
        onClick={onAddProduct}
        size="icon"
        className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg"
      >
        <Plus className="size-6" />
      </Button>
    </div>
  );
}
