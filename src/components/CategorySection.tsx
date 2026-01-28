import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import wellnessTechImage from "@/assets/category-wellness-tech.jpg";


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
    name: "Mirrors",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop",
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
    image: wellnessTechImage,
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="pt-2 pb-10 md:pt-4 md:pb-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
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
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-base md:text-lg font-semibold text-accent group-hover:gap-2 transition-all">
                  Browse <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
