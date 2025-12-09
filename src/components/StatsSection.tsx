import { Package, Boxes, PackageCheck } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";

const StatsSection = () => {
  // Calculate total units in stock, rounded to nearest thousand
  const totalUnits = mockProducts.reduce((sum, product) => sum + product.quantity, 0);
  const roundedUnits = Math.round(totalUnits / 1000) * 1000;
  const formattedUnits = `${(roundedUnits / 1000).toLocaleString()}K+`;

  const stats = [
    {
      icon: Package,
      value: "3,260+",
      label: "Products",
    },
    {
      icon: Boxes,
      value: formattedUnits,
      label: "Units",
    },
    {
      icon: PackageCheck,
      value: "Low",
      label: "Order Minimums",
    },
  ];

  return (
    <section className="bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center"
            >
              <div className="mb-2 p-3 md:p-4 rounded-full bg-accent/10">
                <stat.icon className="h-6 w-6 md:h-7 md:w-7 text-accent" />
              </div>
              <span className="text-xl sm:text-2xl md:text-4xl font-black text-foreground">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium mt-0.5">
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
