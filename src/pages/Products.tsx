import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mockProducts";
import { usePallet } from "@/contexts/PalletContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { matchesSearchQuery } from "@/lib/searchSynonyms";
import { Lock, Filter, X } from "lucide-react";
import CategoryFilters from "@/components/CategoryFilters";
import { useState } from "react";

const Products = () => {
  const { totalItems } = usePallet();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, string | null>>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  
  const selectedBrand = searchParams.get("brand") || null;
  const selectedCategory = searchParams.get("category") || null;
  const searchQuery = searchParams.get("search") || "";

  const categories = ['Decor', 'Furniture', 'Lighting', 'Mirrors', 'Outdoor', 'Pillows & Rugs'];
  const brands = Array.from(new Set(mockProducts.map((p) => p.brand))).filter(b => b && b !== 'Brand').sort((a, b) => a.localeCompare(b));

  const maxPrice = Math.max(...mockProducts.map(p => p.discountedPrice), 5000);

  const filteredProducts = mockProducts.filter((p) => {
    const matchesBrand = !selectedBrand || p.brand === selectedBrand;
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesPrice = p.discountedPrice >= priceRange[0] && p.discountedPrice <= priceRange[1];
    const matchesSearch = matchesSearchQuery(p.name, searchQuery);
    
    return matchesBrand && matchesCategory && matchesPrice && matchesSearch;
  }).sort((a, b) => {
    const hasValidImage = (imageUrl: string) => {
      if (!imageUrl || imageUrl === 'N/A') return false;
      const lowerUrl = imageUrl.toLowerCase();
      return !lowerUrl.includes('wikipedia.org/wiki') && 
             !lowerUrl.includes('arhaus_logo') &&
             !lowerUrl.includes('placeholder') &&
             !lowerUrl.includes('logo');
    };
    
    const aHasImage = hasValidImage(a.imageUrl);
    const bHasImage = hasValidImage(b.imageUrl);
    
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    return 0;
  });

  const handleBrandSelect = (brand: string | null) => {
    const newParams = new URLSearchParams();
    if (brand) newParams.set("brand", brand);
    if (selectedCategory) newParams.set("category", selectedCategory);
    setSearchParams(newParams);
  };

  const handleCategorySelect = (category: string | null) => {
    const newParams = new URLSearchParams();
    if (selectedBrand) newParams.set("brand", selectedBrand);
    if (category) newParams.set("category", category);
    setSearchParams(newParams);
    // Reset category-specific filters when changing category
    setCategoryFilters({});
  };

  const handleCategoryFilterChange = (key: string, value: string | null) => {
    setCategoryFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Build Your Pallet</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Browse products, add to your pallet, and request a quote. $10,000 order minimum.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            <Button variant="highlight" asChild className="w-fit">
              <Link to="/pallets">
                <Lock className="mr-2 h-4 w-4" />
                Shop Pallets
              </Link>
            </Button>
          </div>
        </div>

        {/* Brand Filters */}
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Brand</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
            <Button
              variant={selectedBrand === null ? "default" : "outline"}
              onClick={() => handleBrandSelect(null)}
              size="sm"
              className="flex-shrink-0"
            >
              All Brands
            </Button>
            {brands.map((brand) => (
              <Button
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                onClick={() => handleBrandSelect(brand)}
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
              onClick={() => handleCategorySelect(null)}
              size="sm"
              className="flex-shrink-0"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => handleCategorySelect(category)}
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
            {searchQuery 
              ? `Search results for "${searchQuery}"` 
              : `${selectedBrand || 'All Brands'}${selectedCategory ? ` - ${selectedCategory}` : ''}`
            }
          </h2>
          <Badge variant="secondary" className="text-sm">
            {filteredProducts.length} products found
          </Badge>
        </div>

        {/* Main content with optional sidebar */}
        <div className="flex gap-6">
          {/* Filter Sidebar - desktop always, mobile toggle */}
          <aside className={`${showFilters ? 'fixed inset-0 z-40 bg-background p-4 overflow-y-auto md:relative md:inset-auto md:z-auto md:p-0' : 'hidden'} md:block w-full md:w-56 flex-shrink-0`}>
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <CategoryFilters
              selectedCategory={selectedCategory}
              categoryFilters={categoryFilters}
              onCategoryFilterChange={handleCategoryFilterChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPrice={maxPrice}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
