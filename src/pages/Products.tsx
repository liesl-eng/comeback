import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Products = () => {
  const { addItem, totalItems } = useCart();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["Furniture", "Decor", "Textiles", "Lighting", "Tabletop", "Outdoor"];
  const brands = Array.from(new Set(mockProducts.map((p) => p.brand))).sort((a, b) => a.localeCompare(b));
  
  const filteredProducts = mockProducts.filter((p) => {
    const matchesBrand = !selectedBrand || p.brand === selectedBrand;
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesBrand && matchesCategory;
  });

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

        {/* Brand Filters */}
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Brand</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedBrand === null ? "default" : "outline"}
              onClick={() => setSelectedBrand(null)}
              size="sm"
            >
              All Brands
            </Button>
            {brands.map((brand) => (
              <Button
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                onClick={() => setSelectedBrand(brand)}
                size="sm"
              >
                {brand}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Categories
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
        </div>

        <div className="mb-8">
          <Badge variant="secondary" className="text-sm">
            {filteredProducts.length} products found
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
