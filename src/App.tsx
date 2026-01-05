import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createEmptyProduct, findWinner } from "@/lib/calculations";
import type { Product } from "@/types";

function App() {
  const [products, setProducts] = useLocalStorage<Product[]>(
    "wipe-right-products",
    [createEmptyProduct()]
  );

  const winnerId = findWinner(products);

  const addProduct = () => {
    setProducts([...products, createEmptyProduct()]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Wipe Right</h1>
        <p className="text-muted-foreground">
          Find the best toilet paper value
        </p>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWinner={product.id === winnerId}
            onUpdate={(updates) => updateProduct(product.id, updates)}
            onRemove={() => removeProduct(product.id)}
            canRemove={products.length > 1}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button onClick={addProduct}>
          <Plus className="size-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
}

export default App;
