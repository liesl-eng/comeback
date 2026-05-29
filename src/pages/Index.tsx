import { Package } from "lucide-react";
import logo from "@/assets/comeback-goods-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <img
        src={logo}
        alt="Comeback Goods"
        className="h-8 w-auto mb-6 opacity-90"
      />
      <Package className="h-12 w-12 text-muted-foreground mb-4" strokeWidth={1.5} />
      <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
        Currently in the back of the warehouse.
      </h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs">
        Something good is coming. Check back soon.
      </p>
    </div>
  );
};

export default Index;
