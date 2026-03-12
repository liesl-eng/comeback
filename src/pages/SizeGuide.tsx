import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import RugProgramNavbar from "@/components/RugProgramNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Small", sizes: ['2\'3"×3\'11"', '3\'11"×5\'3"', '3\'3"×4\'7"', '3\'3"×5\'', '2×3', '2\'6"×3\'9"', '2\'7"×3\'11"'] },
  { name: "Runner", sizes: ['2\'7"×9\'10"', '2\'3"×7\'3"', '2\'7"×9\'6"', '2\'×7\'3"', '2\'7"×9\'3"', '20"×5\'', '1\'8"×5\'', '2\'6"×9\'10"', '2\'1"×7\'3"'] },
  { name: "Medium", sizes: ['5\'3"×7\'3"', '5\'2"×7\'', '5\'×7\''] },
  { name: "Large", sizes: ['7\'10"×9\'10"', '7\'3"×9\'3"', '6\'7"×9\'3"', '6\'7"×9\'6"', '7\'10"×10\'6"', '7\'7"×9\'6"'] },
  { name: "XL", sizes: ['9\'3"×12\'6"'] },
  { name: "Small Round", sizes: ['4\' Round', '3\'11" Round', '2\'11" Round'] },
  { name: "Med Round", sizes: ['6\' Round', '6\'7" Round'] },
  { name: "Large Round", sizes: ['8\' Round'] },
];

const SizeGuide = () => {
  const scrollToContact = () => {
    // Navigate to rug program contact
    window.location.href = "/rug-program#get-a-quote";
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Rug Size Guide — Comeback Goods</title>
        <meta name="description" content="Our closeout rug inventory organized by size category. Small, runners, medium, large, XL, and round sizes available." />
      </Helmet>
      <RugProgramNavbar onGetQuoteClick={scrollToContact} />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Rug Size Guide</h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Our closeout inventory organized by size category. Pricing available upon request.
          </p>
        </div>

        <div className="grid gap-4 md:gap-5">
          {categories.map((cat) => (
            <Card key={cat.name} className="border border-border/60">
              <CardContent className="p-5 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-3">{cat.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.sizes.map((size) => (
                    <Badge key={size} variant="secondary" className="text-sm font-medium px-3 py-1">
                      {size}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">Pricing TBD</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10 max-w-xl mx-auto">
          Pricing varies by volume.{" "}
          <Link to="/rug-program#get-a-quote" className="text-accent hover:underline underline-offset-4 font-medium">
            Request a quote
          </Link>{" "}
          for current rates.
        </p>
      </main>
    </div>
  );
};

export default SizeGuide;
