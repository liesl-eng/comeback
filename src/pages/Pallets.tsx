import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface PalletSummary {
  pallet_id: string;
  item_count: number;
  total_msrp: number;
  sample_image: string | null;
  sample_category: string | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const PalletCard = ({ pallet }: { pallet: PalletSummary }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pallets/${pallet.pallet_id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-card rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border shadow-sm hover:shadow-lg"
    >
      {/* Image Container - Square 1:1 ratio */}
      <div className="relative aspect-square bg-muted rounded-t-xl overflow-hidden">
        {pallet.sample_image ? (
          <img 
            src={pallet.sample_image} 
            alt={`Pallet ${pallet.pallet_id}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
        )}
        
        {/* Heart icon - top left */}
        <button 
          className="absolute top-3 left-3 w-9 h-9 bg-card rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="w-5 h-5 text-muted-foreground" />
        </button>
        
        {/* Item count badge - bottom right */}
        <div 
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md text-white text-xs font-bold uppercase tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #c5a028 100%)',
          }}
        >
          {pallet.item_count} ITEMS
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex gap-2 mb-3">
          <span className="px-3 py-1.5 text-xs font-medium rounded bg-primary/10 text-primary">
            Pallet
          </span>
          {pallet.sample_category && (
            <span className="px-3 py-1.5 text-xs font-medium rounded bg-muted text-muted-foreground">
              {pallet.sample_category}
            </span>
          )}
        </div>
        
        {/* Pallet ID as Title */}
        <h3 className="text-lg font-bold text-foreground mb-3">
          {pallet.pallet_id}
        </h3>
        
        {/* Divider */}
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Total MSRP
          </p>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(pallet.total_msrp)}
          </p>
        </div>
      </div>
    </div>
  );
};

const PalletCardSkeleton = () => (
  <div className="bg-card rounded-xl border shadow-sm">
    <Skeleton className="aspect-square rounded-t-xl" />
    <div className="p-4">
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-20" />
      </div>
      <Skeleton className="h-6 w-32 mb-3" />
      <div className="border-t border-border pt-3">
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-7 w-24" />
      </div>
    </div>
  </div>
);

const Pallets = () => {
  const { totalItems } = useCart();

  const { data: pallets, isLoading } = useQuery({
    queryKey: ['pallets-summary'],
    queryFn: async () => {
      // Get aggregated data for each pallet
      const { data, error } = await supabase
        .from('pallet_items')
        .select('pallet_id, original_price, primary_image, category_name');
      
      if (error) throw error;

      // Aggregate by pallet_id
      const palletMap = new Map<string, PalletSummary>();
      
      data.forEach((item) => {
        const existing = palletMap.get(item.pallet_id);
        if (existing) {
          existing.item_count += 1;
          existing.total_msrp += Number(item.original_price);
          // Keep first non-null image
          if (!existing.sample_image && item.primary_image) {
            existing.sample_image = item.primary_image;
          }
        } else {
          palletMap.set(item.pallet_id, {
            pallet_id: item.pallet_id,
            item_count: 1,
            total_msrp: Number(item.original_price),
            sample_image: item.primary_image,
            sample_category: item.category_name,
          });
        }
      });

      return Array.from(palletMap.values()).sort((a, b) => 
        a.pallet_id.localeCompare(b.pallet_id)
      );
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Pallets By Brand</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Bulk purchasing opportunities with significant savings
          </p>
        </div>

        {/* Pallet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <PalletCardSkeleton key={i} />
            ))
          ) : pallets && pallets.length > 0 ? (
            pallets.map((pallet) => (
              <PalletCard key={pallet.pallet_id} pallet={pallet} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No pallets found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Pallets;
