import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import meridianBrass from "@/assets/lighting/meridian-brass.jpg";
import meridianBrassShelf from "@/assets/lighting/meridian-brass-shelf.webp";
import meridianBrushedSteel from "@/assets/lighting/meridian-brushed-steel.webp";
import meridianBrushedSteelAlt from "@/assets/lighting/meridian-brushed-steel.jpg";
import meridianCashmere from "@/assets/lighting/meridian-cashmere.jpg";
import meridianBlack from "@/assets/lighting/meridian-black.jpg";

const finishes = [
  {
    id: "brass",
    label: "Brass",
    swatch: "hsl(43 65% 52%)",
    image: meridianBrass,
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

const allImages = [
  { src: meridianBrass, alt: "Meridian Table Lamp in Brass" },
  { src: meridianBrassShelf, alt: "Meridian Lamps styled on a shelf" },
  { src: meridianBrushedSteel, alt: "Meridian Table Lamp in Brushed Steel" },
  { src: meridianBrushedSteelAlt, alt: "Meridian Table Lamp in Brushed Steel, alternate view" },
  { src: meridianCashmere, alt: "Meridian Table Lamp in Cashmere" },
  { src: meridianBlack, alt: "Meridian Table Lamp in Black" },
];

const MeridianLamp = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);
  const [selectedImage, setSelectedImage] = useState(allImages[0]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Rechargeable Table Lamps — Meridian by Ferm Living | Comeback Goods</title>
        <meta name="description" content="Premium Rechargeable Table Lamps — The Meridian by Ferm Living. $50 vs $265 MSRP. New, warehouse direct. Available in Brass, Brushed Steel, Cashmere, and Black." />
      </Helmet>
      <Navbar cartItemCount={totalItems} />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
          {/* Image + Thumbnails */}
          <div className="flex flex-col gap-3">
            <div className="bg-[hsl(30_20%_93%)] rounded-xl overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full object-cover object-center transition-opacity duration-200"
                key={selectedImage.src}
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage.src === img.src
                      ? "border-foreground shadow-md"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1.5">Ferm Living</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Meridian Table Lamp</h1>
              <p className="text-base text-muted-foreground">{selectedFinish.label} finish</p>
            </div>

            <div className="flex items-baseline gap-3">
              <Badge variant="accent">Warehouse Direct</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Warehouse Direct — New</p>

            {/* Finish Selector */}
            <div>
              <p className="text-sm font-semibold mb-2.5">Finish</p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {finishes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFinish(f);
                      setSelectedImage({ src: f.image, alt: f.alt });
                    }}
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

            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Designed by Regular Company for Ferm Living, the Meridian is a portable, dimmable LED table lamp built around three simple geometric forms — cone, arc, and cylinder. Cordless and rechargeable via USB-C, it delivers up to 12 hours of warm white light per charge. Compact enough for nightstands, shelves, and side tables — ideal for staging, rentals, and hospitality.
              </p>
              <p>
                <span className="font-semibold text-foreground">Available in 4 finishes:</span> Cashmere, Brass, Brushed Steel, and Black.
              </p>
              <div>
                <p className="font-semibold text-foreground mb-1.5">Specs</p>
                <ul className="space-y-1 list-none">
                  {[
                    "Dimmable warm white LED (2700K)",
                    "Up to 12 hours per charge",
                    "USB-C charging (cable included)",
                    "30,000-hour LED lifespan",
                    `Dimensions: 8.2"W × 10.2"H × 6.7"D`,
                    "UL approved (US version)",
                  ].map((spec) => (
                    <li key={spec} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
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
