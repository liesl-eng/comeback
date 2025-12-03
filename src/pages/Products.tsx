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

  const categories = ['Furniture', 'Lighting', 'Outdoor', 'Decor', 'Textiles', 'Tabletop', 'Smart Home & Wellness'];
  const brands = Array.from(new Set(mockProducts.map((p) => p.brand))).filter(b => b && b !== 'Brand').sort((a, b) => a.localeCompare(b));
  
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
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Browse Products</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover discounted inventory from verified suppliers
          </p>
        </div>

        {/* Brand Filters */}
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Brand</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
            <Button
              variant={selectedBrand === null ? "default" : "outline"}
              onClick={() => setSelectedBrand(null)}
              size="sm"
              className="flex-shrink-0"
            >
              All Brands
            </Button>
            {brands.map((brand) => (
              <Button
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                onClick={() => setSelectedBrand(brand)}
                size="sm"
                className="flex-shrink-0"
              >
                {brand}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
              className="flex-shrink-0"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <Badge variant="secondary" className="text-sm">
            {filteredProducts.length} products found
          </Badge>
        </div>

        {/* Brand Sections */}
        <div className="space-y-8 md:space-y-12">
          {sortedBrands.map((brand) => {
            const brandProducts = productsByBrand[brand];
            return (
              <section key={brand} className="scroll-mt-8">
                <div className="mb-4 md:mb-6 border-b pb-3">
                  <h2 className="text-xl md:text-3xl font-bold text-foreground">
                    {brand}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground mt-1">
                    {brandProducts.length} {brandProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
