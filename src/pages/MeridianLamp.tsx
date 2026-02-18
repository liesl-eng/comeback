import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import meridianBrushedSteel from "@/assets/lighting/meridian-brushed-steel.jpg";

const MeridianLamp = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Meridian Table Lamp — Ferm Living | Comeback Goods</title>
        <meta name="description" content="Ferm Living Meridian Table Lamp in Brass — $50 vs $265 MSRP. New, warehouse direct. Add to your rug program order." />
      </Helmet>
      <Navbar cartItemCount={totalItems} />

      <main className="container mx-auto px-4 py-10 md:py-16">
        <button
          onClick={() => navigate("/rug-program")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Rug Program
        </button>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto">
          {/* Image */}
          <div className="bg-muted/30 rounded-xl flex items-center justify-center p-8">
            <img
              src={meridianBrushedSteel}
              alt="Ferm Living Meridian Table Lamp in Brass"
              className="max-h-[500px] w-auto object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Ferm Living</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Meridian Table Lamp</h1>
              <p className="text-lg text-muted-foreground">Brass finish</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black">$50</span>
              <span className="text-xl text-muted-foreground line-through">$265</span>
              <Badge variant="accent" className="text-sm">81% below MSRP</Badge>
            </div>

            <div className="space-y-3 text-base text-muted-foreground leading-relaxed">
              <p>
                Premium Ferm Living table lamp at a fraction of retail.
                Available in multiple finishes — Cashmere, Brushed Steel, Brass, and Black.
              </p>
              <p>
                <span className="font-semibold text-foreground">Condition:</span> New — Warehouse Direct
              </p>
              <p>
                <span className="font-semibold text-foreground">Availability:</span> Add lighting to your rug program order, or inquire for standalone purchases.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                size="lg"
                variant="accent"
                className="w-full text-base"
                asChild
              >
                <a href="mailto:liesl@comebackgoods.com?subject=Meridian%20Lamp%20Inquiry&body=Hi%2C%20I'm%20interested%20in%20the%20Meridian%20Table%20Lamp.%20Please%20send%20me%20more%20details.">
                  <Mail className="h-5 w-5 mr-2" />
                  Inquire About This Product
                </a>
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Or email us directly at{" "}
                <a href="mailto:liesl@comebackgoods.com" className="text-accent hover:underline underline-offset-4">
                  liesl@comebackgoods.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeridianLamp;
