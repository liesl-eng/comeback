import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Products = () => {
  const { addItem, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(mockProducts.map((p) => p.category)));
  
  const filteredProducts = selectedCategory
    ? mockProducts.filter((p) => p.category === selectedCategory)
    : mockProducts;

  // Group products by brand and sort brands alphabetically
  const productsByBrand = filteredProducts.reduce((acc, product) => {
    const brand = product.brand;
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(product);
    return acc;
  }, {} as Record<string, typeof filteredProducts>);

  const sortedBrands = Object.keys(productsByBrand).sort((a, b) => 
    a.localeCompare(b)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Products</h1>
          <p className="text-muted-foreground">
            Discover discounted inventory from verified suppliers
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            All Brands
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="mb-8 flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredProducts.length} products found
          </Badge>
          <Badge variant="success" className="text-sm">
            Average {Math.round(filteredProducts.reduce((acc, p) => acc + p.discountPercentage, 0) / filteredProducts.length)}% savings
          </Badge>
        </div>

        {/* Brand Sections */}
        <div className="space-y-12">
          {sortedBrands.map((brand) => {
            const brandProducts = productsByBrand[brand];
            return (
              <section key={brand} className="scroll-mt-8">
                <div className="mb-6 border-b pb-3">
                  <h2 className="text-3xl font-bold text-foreground">
                    {brand}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {brandProducts.length} {brandProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {brandProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addItem}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Products;
