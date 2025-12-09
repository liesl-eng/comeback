import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockProducts } from "@/data/mockProducts";

const categories = [
  {
    name: "Furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  },
  {
    name: "Decor",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=300&fit=crop",
  },
  {
    name: "Lighting",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
  },
  {
    name: "Pillows & Rugs",
    image: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=400&h=300&fit=crop",
  },
  {
    name: "Outdoor",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop",
  },
  {
    name: "Home & Wellness Tech",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  // Calculate product count for each category
  const getCategoryCount = (categoryName: string) => {
    return mockProducts.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="mb-3 md:mb-4 text-3xl md:text-5xl font-black">
            Shop by Category
          </h2>
          <p className="text-base md:text-xl text-muted-foreground">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => {
            const count = getCategoryCount(category.name);
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative overflow-hidden rounded-xl aspect-[4/3] text-left transition-transform hover:scale-[1.02]"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/80 mb-2">
                    {count.toLocaleString()} products
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                    Browse <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
