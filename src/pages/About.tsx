import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, TrendingDown, BadgeCheck, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Button
          variant="ghost"
          className="mb-6 md:mb-8 gap-2 -ml-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">About <span className="text-accent">Comeback Goods</span></h1>
          
          <p className="text-lg md:text-xl text-foreground mb-6 md:mb-8">
            <span className="font-bold">Comeback Goods</span> works directly with brands for high quality, slightly imperfect goods.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Why buy from us?</h2>
          
          <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
            <div className="border-l-4 border-primary pl-4 md:pl-6">
              <p className="text-base md:text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">We work directly with brands.</span> No weird third-party middlemen here.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4 md:pl-6">
              <p className="text-base md:text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">Our quality checks? Legit.</span> The same people who inspect the brand's products inspect ours.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4 md:pl-6">
              <p className="text-base md:text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">You're saving a perfectly good products from limbo.</span> And getting an awesome deal.
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card className="border-none shadow-card">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="mx-auto mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-accent/10">
                  <BadgeCheck className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">Curated, Top-Notch Home Goods</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Verified and ready-to-ship direct from brand warehouses
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-card">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="mx-auto mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-success/10">
                  <TrendingDown className="h-5 w-5 md:h-6 md:w-6 text-success" />
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">Less-Than-Wholesale Pricing</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Save up to 90% off retail
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-card sm:col-span-2 md:col-span-1">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="mx-auto mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
                  <Leaf className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">Sustainable Sourcing</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Furnish responsibly while lowering costs
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="accent" size="lg" onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Comeback Goods. Tiny imperfections, huge savings.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
