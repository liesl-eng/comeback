import { Helmet } from "react-helmet-async";
import { Package } from "lucide-react";
import comebackLogo from "@/assets/comeback-goods-logo.png";

const Restocking = () => {
  return (
    <>
      <Helmet>
        <title>Restocking — Comeback Goods</title>
        <meta name="description" content="Comeback Goods is restocking. We'll be back shortly." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <img
          src={comebackLogo}
          alt="Comeback Goods"
          className="h-20 md:h-24 w-auto mb-10"
        />

        <div className="mb-8 p-6 rounded-full bg-accent/10 border border-accent/30">
          <Package className="h-16 w-16 md:h-20 md:w-20 text-accent" strokeWidth={1.5} />
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-foreground">
          Restocking
        </h1>

        <p className="mt-12 text-sm text-muted-foreground">
          Questions? <a href="mailto:hello@comebackgoods.com" className="text-accent hover:underline">hello@comebackgoods.com</a>
        </p>
      </main>
    </>
  );
};

export default Restocking;
