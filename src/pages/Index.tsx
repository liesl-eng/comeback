import { Package } from "lucide-react";
import logo from "@/assets/comeback-goods-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <img
        src={logo}
        alt="Comeback Goods"
        className="h-14 sm:h-16 w-auto mb-12 opacity-90"
      />
      <Package className="h-20 w-20 sm:h-24 sm:w-24 text-muted-foreground mb-6" strokeWidth={1} />
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-foreground tracking-tighter leading-none">
        Restocking.
      </h1>
    </div>
  );
};

export default Index;
