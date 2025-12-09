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
      label: "Units in Stock",
    },
    {
      icon: PackageCheck,
      value: "Low",
      label: "Order Minimums",
    },
  ];

  return (
    <section className="bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-3 gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 p-4 md:p-5 rounded-full bg-accent/10">
                <stat.icon className="h-8 w-8 md:h-10 md:w-10 text-accent" />
              </div>
              <span className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground">
                {stat.value}
              </span>
              <span className="text-sm sm:text-base md:text-xl text-muted-foreground font-medium mt-1">
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
