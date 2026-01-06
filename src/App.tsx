import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ComparisonTable } from "@/components/mobile/ComparisonTable";
import { ProductSheet } from "@/components/mobile/ProductSheet";
import { AccordionCards } from "@/components/mobile/AccordionCards";
import { SwipeableCards } from "@/components/mobile/SwipeableCards";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMobileLayout } from "@/hooks/useMobileLayout";
import { createEmptyProduct, findWinner } from "@/lib/calculations";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Header } from "./components/Header";

function App() {
  const [products, setProducts] = useLocalStorage<Product[]>(
    "wipe-right-products",
    []
  );
  const [mobileLayout] = useMobileLayout();
  const [editingProductId, setEditingProductId] = useLocalStorage<string | null>(
    "wipe-right-editing-product",
    null
  );
  const [activeCardIndex, setActiveCardIndex] = useLocalStorage<number>(
    "wipe-right-active-card-index",
    0
  );

  const winnerId = findWinner(products);

  const addProduct = () => {
    const newProduct = createEmptyProduct();
    setProducts([...products, newProduct]);
    setEditingProductId(newProduct.id);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removeProduct = (id: string) => {
    const indexToRemove = products.findIndex((p) => p.id === id);
    if (indexToRemove === -1) return;

    const newProducts = products.filter((p) => p.id !== id);
    setProducts(newProducts);

    // If we removed the product that was being edited, close the sheet
    if (editingProductId === id) {
      setEditingProductId(null);
    }

    // If no products remain, reset active index and editing state
    if (newProducts.length === 0) {
      setActiveCardIndex(0);
      return;
    }

    // Adjust active card index if necessary
    if (activeCardIndex >= indexToRemove && activeCardIndex > 0) {
      setActiveCardIndex(Math.max(0, activeCardIndex - 1));
    } else if (activeCardIndex >= newProducts.length) {
      setActiveCardIndex(newProducts.length - 1);
    }
  };

  const editingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId) || null
    : null;

  const handleEditProduct = (id: string) => {
    setEditingProductId(id);
  };

  const handleCloseSheet = () => {
    setEditingProductId(null);
  };

  const handleDeleteFromSheet = () => {
    if (editingProductId) {
      removeProduct(editingProductId);
      setEditingProductId(null);
    }
  };

  // Mobile layout rendering
  const renderMobileLayout = () => {
    switch (mobileLayout) {
      case "table":
        return (
          <>
            <ComparisonTable
              products={products}
              winnerId={winnerId}
              onEditProduct={handleEditProduct}
              onAddProduct={addProduct}
            />
            <ProductSheet
              product={editingProduct}
              isOpen={editingProductId !== null}
              onClose={handleCloseSheet}
              onUpdate={(updates) => {
                if (editingProductId) {
                  updateProduct(editingProductId, updates);
                }
              }}
              onDelete={handleDeleteFromSheet}
            />
          </>
        );

      case "accordion":
        return (
          <AccordionCards
            products={products}
            winnerId={winnerId}
            onUpdateProduct={updateProduct}
            onRemoveProduct={removeProduct}
            onAddProduct={addProduct}
            editingProductId={editingProductId}
          />
        );

      case "swipeable":
        return (
          <SwipeableCards
            products={products}
            winnerId={winnerId}
            activeIndex={activeCardIndex}
            onIndexChange={setActiveCardIndex}
            onUpdateProduct={updateProduct}
            onRemoveProduct={removeProduct}
            onAddProduct={addProduct}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/5 to-background md:p-6">
      <Header />

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {products.length === 0 ? (
          <div className="w-full flex items-center justify-center py-12">
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">No products yet. Click below to add your first product.</p>
              <Button variant="secondary" onClick={addProduct}>Add Product</Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto p-1 -m-1 pb-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWinner={product.id === winnerId}
                onUpdate={(updates) => updateProduct(product.id, updates)}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex-1">
        {renderMobileLayout()}
      </div>

      <Footer />
    </div>
  );
}

export default App;
