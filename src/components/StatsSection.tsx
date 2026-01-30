import { Package, Boxes, PackageCheck } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Package,
      value: "9,000+",
      label: "Products",
    },
    {
      icon: Boxes,
      value: "150K+",
      label: "Items in Stock",
    },
    {
      icon: PackageCheck,
      value: "Low",
      label: "Order Minimums",
    },
  ];

  return (
    <section className="bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center gap-2 md:gap-4"
            >
              <div className="p-2 md:p-3 rounded-full bg-accent/10 shrink-0">
                <stat.icon className="h-6 w-6 md:h-10 md:w-10 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground leading-none">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
