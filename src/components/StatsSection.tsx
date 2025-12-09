import { Package, Boxes, Award, TrendingDown, Sparkles } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";

const StatsSection = () => {
  // Calculate total units in stock
  const totalUnits = mockProducts.reduce((sum, product) => sum + product.quantity, 0);
  const formattedUnits = totalUnits >= 1000 
    ? `${Math.floor(totalUnits / 1000).toLocaleString()}K+` 
    : totalUnits.toLocaleString();

  const stats = [
    {
      icon: Package,
      value: "3,260+",
      label: "Products",
    },
    {
      icon: Boxes,
      value: formattedUnits,
      label: "Units in Stock",
    },
    {
      icon: Award,
      value: "8",
      label: "Premium Brands",
    },
    {
      icon: TrendingDown,
      value: "78%",
      label: "Off Retail",
    },
    {
      icon: Sparkles,
      value: "New",
      label: "Items Weekly",
    },
  ];

  return (
    <section className="bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center"
            >
              <div className="mb-2 p-3 rounded-full bg-accent/10">
                <stat.icon className="h-6 w-6 text-accent" />
              </div>
              <span className="text-2xl md:text-3xl font-black text-foreground">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
