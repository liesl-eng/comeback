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

  const categories = ['Furniture', 'Lighting', 'Outdoor', 'Decor', 'Textiles', 'Tabletop', 'Home & Wellness Tech'];
  const brands = Array.from(new Set(mockProducts.map((p) => p.brand))).filter(b => b && b !== 'Brand').sort((a, b) => a.localeCompare(b));
  
  const filteredProducts = mockProducts.filter((p) => {
    const matchesBrand = !selectedBrand || p.brand === selectedBrand;
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesBrand && matchesCategory;
  });

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

        {/* Results Title */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-2">
            {selectedBrand || 'All Brands'}{selectedCategory ? ` - ${selectedCategory}` : ''}
          </h2>
          <Badge variant="secondary" className="text-sm">
            {filteredProducts.length} products found
          </Badge>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addItem}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;
