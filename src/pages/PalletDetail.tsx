import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";

const PalletDetail = () => {
  const { palletId } = useParams<{ palletId: string }>();
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Link 
          to="/pallets" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pallets
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Pallet {palletId}</h1>
          <p className="text-muted-foreground">
            View all items in this pallet
          </p>
        </div>

        {/* Placeholder for pallet items - will be populated with real data */}
        <div className="bg-card rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Pallet items for <span className="font-semibold">{palletId}</span> will be displayed here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PalletDetail;
