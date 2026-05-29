import { Package } from "lucide-react";
import logo from "@/assets/comeback-goods-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <img
        src={logo}
        alt="Comeback Goods"
        className="h-10 sm:h-12 w-auto mb-10 opacity-90"
      />
      <Package className="h-20 w-20 sm:h-24 sm:w-24 text-muted-foreground mb-6" strokeWidth={1} />
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-foreground tracking-tighter leading-none">
        Restocking.
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mt-4 font-medium">
        Something good is coming. Check back soon.
      </p>
    </div>
  );
};

export default Index;
