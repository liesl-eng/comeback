import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import meridianBrushedSteel from "@/assets/lighting/meridian-brushed-steel.jpg";
import meridianCashmere from "@/assets/lighting/meridian-cashmere.jpg";
import meridianBlack from "@/assets/lighting/meridian-black.jpg";

const finishes = [
  {
    id: "brass",
    label: "Brass",
    swatch: "hsl(43 65% 52%)",
    image: meridianBrushedSteel, // using brushed steel as brass placeholder
    alt: "Ferm Living Meridian Table Lamp in Brass",
  },
  {
    id: "brushed-steel",
    label: "Brushed Steel",
    swatch: "hsl(210 10% 68%)",
    image: meridianBrushedSteel,
    alt: "Ferm Living Meridian Table Lamp in Brushed Steel",
  },
  {
    id: "cashmere",
    label: "Cashmere",
    swatch: "hsl(30 18% 80%)",
    image: meridianCashmere,
    alt: "Ferm Living Meridian Table Lamp in Cashmere",
  },
  {
    id: "black",
    label: "Black",
    swatch: "hsl(220 15% 14%)",
    image: meridianBlack,
    alt: "Ferm Living Meridian Table Lamp in Black",
  },
];

const MeridianLamp = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Meridian Table Lamp — Ferm Living | Comeback Goods</title>
        <meta name="description" content="Ferm Living Meridian Table Lamp — $50 vs $265 MSRP. New, warehouse direct. Available in Brass, Brushed Steel, Cashmere, and Black." />
      </Helmet>
      <Navbar cartItemCount={totalItems} />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <button
          onClick={() => navigate("/rug-program")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Rug Program
        </button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
          {/* Image */}
          <div className="bg-[hsl(30_20%_93%)] rounded-xl overflow-hidden aspect-square flex items-center justify-center">
            <img
              src={selectedFinish.image}
              alt={selectedFinish.alt}
              className="w-full h-full object-cover transition-opacity duration-200"
              key={selectedFinish.id}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1.5">Ferm Living</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Meridian Table Lamp</h1>
              <p className="text-base text-muted-foreground">{selectedFinish.label} finish</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black">$50</span>
              <span className="text-lg text-muted-foreground line-through">$265</span>
              <Badge variant="accent">81% below MSRP</Badge>
            </div>

            {/* Finish Selector */}
            <div>
              <p className="text-sm font-semibold mb-2.5">Finish</p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {finishes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFinish(f)}
                    title={f.label}
                    className={`relative flex flex-col items-center gap-1.5 group`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full border-2 transition-all block ${
                        selectedFinish.id === f.id
                          ? "border-foreground scale-110 shadow-md"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      style={{ backgroundColor: f.swatch }}
                    />
                    <span
                      className={`text-[10px] font-medium transition-colors ${
                        selectedFinish.id === f.id ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {f.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>
                Premium Ferm Living table lamp at a fraction of retail.
              </p>
              <p>
                <span className="font-semibold text-foreground">Condition:</span> New — Warehouse Direct
              </p>
              <p>
                <span className="font-semibold text-foreground">Availability:</span> Add lighting to your rug program order, or inquire for standalone purchases.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <Button
                size="lg"
                variant="accent"
                className="w-full text-base"
                asChild
              >
                <a href={`mailto:liesl@comebackgoods.com?subject=Meridian%20Lamp%20Inquiry%20(${encodeURIComponent(selectedFinish.label)})&body=Hi%2C%20I'm%20interested%20in%20the%20Meridian%20Table%20Lamp%20in%20${encodeURIComponent(selectedFinish.label)}.%20Please%20send%20me%20more%20details.`}>
                  <Mail className="h-5 w-5 mr-2" />
                  Inquire About This Product
                </a>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Or email{" "}
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
