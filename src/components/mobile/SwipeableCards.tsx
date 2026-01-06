import { useRef } from "react";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StickyComparison } from "@/components/mobile/StickyComparison";
import { cn } from "@/lib/utils";
import { calculateMetrics } from "@/lib/calculations";
import { ProductFormFields } from "@/components/ProductFormFields";
import { MetricsDisplay } from "@/components/MetricsDisplay";
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
  activeIndex,
  onIndexChange,
  onUpdateProduct,
  onRemoveProduct,
  onAddProduct,
  canRemove,
}: SwipeableCardsProps) {
  const swiperRef = useRef<any>(null);

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    onIndexChange(newIndex);
  };

  const handleSelectProduct = (index: number) => {
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
                  <ProductFormFields
                    product={product}
                    onUpdate={(updates) => onUpdateProduct(product.id, updates)}
                    compact={true}
                    showSheetSize={true}
                    collapsibleSheetSize={false}
                    showUnitToggles={false}
                  />

                  <MetricsDisplay metrics={metrics} isWinner={isWinner} compact={true} />
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
