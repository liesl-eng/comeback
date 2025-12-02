import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-8 gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Comeback Goods</h1>
          
          <p className="text-xl text-foreground mb-8">
            Comeback Goods works directly with brands for high quality, slightly imperfect goods.
          </p>

          <h2 className="text-2xl font-semibold mb-6">Why buy from us?</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-6">
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">We work directly with brands.</span> No weird third-party middlemen here.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-6">
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">Our quality checks? Legit.</span> The same people who inspect the brand's products inspect ours.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-6">
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">You're saving a perfectly good product from limbo.</span> And getting an awesome deal.
              </p>
            </div>
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
