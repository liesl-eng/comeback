import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { matchesSearchQuery } from "@/lib/searchSynonyms";
import { Lock } from "lucide-react";

const Products = () => {
  const { addItem, totalItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read filters from URL params
  const selectedBrand = searchParams.get("brand") || null;
  const selectedCategory = searchParams.get("category") || null;
  const selectedPriceTier = searchParams.get("priceTier") || null;
  const searchQuery = searchParams.get("search") || "";

  const priceTiers = [
    { label: "All Price Tiers", value: null },
    { label: "Under $50", value: "under_50" },
    { label: "$50-$150", value: "50_150" },
    { label: "$150-$400", value: "150_400" },
    { label: "$400+", value: "400_plus" },
  ];

  const categories = ['Decor', 'Furniture', 'Lighting', 'Mirrors', 'Outdoor', 'Pillows & Rugs'];
  const brands = Array.from(new Set(mockProducts.map((p) => p.brand))).filter(b => b && b !== 'Brand').sort((a, b) => a.localeCompare(b));
  
  // Custom brand sort order for specific categories
  const brandSortOrder: Record<string, string[]> = {};

  const filteredProducts = mockProducts.filter((p) => {
    const matchesBrand = !selectedBrand || p.brand === selectedBrand;
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    
    // Price tier filtering
    let matchesPriceTier = true;
    if (selectedPriceTier) {
      const price = p.discountedPrice;
      switch (selectedPriceTier) {
        case "under_50":
          matchesPriceTier = price < 50;
          break;
        case "50_150":
          matchesPriceTier = price >= 50 && price <= 150;
          break;
        case "150_400":
          matchesPriceTier = price > 150 && price <= 400;
          break;
        case "400_plus":
          matchesPriceTier = price > 400;
          break;
      }
    }
    
    // Handle search matching with synonyms and plural/singular forms
    const matchesSearch = matchesSearchQuery(p.name, searchQuery);
    
    return matchesBrand && matchesCategory && matchesPriceTier && matchesSearch;
  }).sort((a, b) => {
    // Helper to check if product has a valid, displayable image
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
    
    // Products with valid images ALWAYS come first
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    
    // Apply custom brand sorting if viewing a category with defined order
    if (selectedCategory && brandSortOrder[selectedCategory]) {
      const order = brandSortOrder[selectedCategory];
      const aIndex = order.indexOf(a.brand || '');
      const bIndex = order.indexOf(b.brand || '');
      
      // If both brands are in the order list, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only one is in the list, prioritize the one in the list
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
    }
    return 0;
  });

  // Update URL params for brand filter
  const handleBrandSelect = (brand: string | null) => {
    const newParams = new URLSearchParams();
    if (brand) newParams.set("brand", brand);
    if (selectedCategory) newParams.set("category", selectedCategory);
    if (selectedPriceTier) newParams.set("priceTier", selectedPriceTier);
    setSearchParams(newParams);
  };

  // Update URL params for category filter
  const handleCategorySelect = (category: string | null) => {
    const newParams = new URLSearchParams();
    if (selectedBrand) newParams.set("brand", selectedBrand);
    if (category) newParams.set("category", category);
    if (selectedPriceTier) newParams.set("priceTier", selectedPriceTier);
    setSearchParams(newParams);
  };

  // Update URL params for price tier filter
  const handlePriceTierSelect = (priceTier: string | null) => {
    const newParams = new URLSearchParams();
    if (selectedBrand) newParams.set("brand", selectedBrand);
    if (selectedCategory) newParams.set("category", selectedCategory);
    if (priceTier) newParams.set("priceTier", priceTier);
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Shop The Catalog</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              High-quality pieces. Big savings. Zero compromise.
            </p>
          </div>
          <Button variant="highlight" asChild className="w-fit">
            <Link to="/pallets">
              <Lock className="mr-2 h-4 w-4" />
              Shop Pallets
            </Link>
          </Button>
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
        <div className="mb-4">
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

        {/* Price Tier Filters */}
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Price Tier</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
            {priceTiers.map((tier) => (
              <Button
                key={tier.label}
                variant={selectedPriceTier === tier.value ? "default" : "outline"}
                onClick={() => handlePriceTierSelect(tier.value)}
                size="sm"
                className="flex-shrink-0"
              >
                {tier.label}
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
