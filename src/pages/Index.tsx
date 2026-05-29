import { Package } from "lucide-react";
import logo from "@/assets/comeback-goods-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex items-center gap-5 mb-10">
        <img
          src={logo}
          alt="Comeback Goods"
          className="h-20 sm:h-24 w-auto opacity-90"
        />
        <Package className="h-20 w-20 sm:h-24 sm:w-24 text-muted-foreground" strokeWidth={1} />
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-foreground tracking-tighter leading-none">
        Restocking.
      </h1>
    </div>
  );
};

export default Index;
