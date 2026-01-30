import { Heart, ArrowRight, ShoppingCart, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface PalletSummary {
  pallet_id: string;
  item_count: number;
  total_msrp: number;
  total_cost: number | null;
  brand: string | null;
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

// Apply 85% discount cap - if discount exceeds 85%, raise the cost to cap at 85%
const applyCappedPricing = (totalCost: number, totalMsrp: number) => {
  const discount = ((totalMsrp - totalCost) / totalMsrp) * 100;
  if (discount > 85) {
    // Cap at 85% off: new cost = 15% of MSRP
    const cappedCost = totalMsrp * 0.15;
    return { cappedCost, cappedDiscount: 85 };
  }
  return { cappedCost: totalCost, cappedDiscount: Math.round(discount) };
};

const formatBrandName = (brand: string): string => {
  // Replace underscores with spaces and capitalize each word
  return brand
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const PalletCard = ({ pallet, isInCart, onAddToCart }: { 
  pallet: PalletSummary; 
  isInCart: boolean;
  onAddToCart: () => void;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pallets/${pallet.pallet_id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
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
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement?.classList.add('bg-gradient-to-br', 'from-primary/20', 'to-primary/5');
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
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
          className="absolute bottom-3 right-3 px-4 py-2 rounded-md text-white text-base font-bold uppercase tracking-wide"
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
          <span className="px-4 py-2 text-sm font-semibold rounded bg-primary/10 text-primary">
            Pallet
          </span>
          {pallet.brand && (
            <span className="px-4 py-2 text-sm font-semibold rounded bg-highlight text-highlight-foreground">
              {formatBrandName(pallet.brand)}
            </span>
          )}
        </div>
        
        {/* Pallet ID as Title */}
        <h3 className="text-lg font-bold text-foreground mb-3">
          {pallet.pallet_id}
        </h3>
        
        {/* Pricing Section */}
        <div className="border-t border-border pt-3 space-y-2">
          {/* Pallet Cost */}
          {pallet.total_cost && (() => {
            const { cappedCost, cappedDiscount } = applyCappedPricing(pallet.total_cost, pallet.total_msrp);
            return (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-muted-foreground">
                    Pallet Cost
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(cappedCost)}
                  </p>
                </div>
                
                {/* Total MSRP Value with strikethrough */}
                <div className="flex justify-between items-center">
                  <p className="text-lg text-muted-foreground">
                    Total MSRP Value
                  </p>
                  <p className="text-lg text-muted-foreground line-through">
                    {formatCurrency(pallet.total_msrp)}
                  </p>
                </div>
                
                {/* % Off Badge */}
                {pallet.total_msrp > 0 && (
                  <div className="flex justify-end">
                    <span 
                      className="px-4 py-2 rounded-md text-white text-base font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #d4af37 0%, #c5a028 100%)',
                      }}
                    >
                      {cappedDiscount}% OFF
                    </span>
                  </div>
                )}
              </>
            );
          })()}
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-6">
            <Button 
              variant="accent"
              className="w-full"
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {isInCart ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Added to Request
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Request
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              className="w-full"
            >
              View Items
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
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
  const { totalItems, palletItems, addPallet } = useCart();

  const isPalletInCart = (palletId: string) => {
    return palletItems.some((p) => p.palletId === palletId);
  };

  const handleAddPallet = (pallet: PalletSummary) => {
    if (pallet.total_cost) {
      const { cappedCost } = applyCappedPricing(pallet.total_cost, pallet.total_msrp);
      addPallet({
        palletId: pallet.pallet_id,
        brand: pallet.brand,
        totalCost: cappedCost,
        totalMsrp: pallet.total_msrp,
      });
    }
  };

  const { data: pallets, isLoading } = useQuery({
    queryKey: ['pallets-summary'],
    queryFn: async () => {
      // Use the pallet_summary view for efficient aggregation
      const { data, error } = await supabase
        .from('pallet_summary')
        .select('*');
      
      if (error) throw error;

      return data.map((row) => ({
        pallet_id: row.pallet_id,
        item_count: row.item_count,
        total_msrp: Number(row.total_msrp),
        total_cost: row.total_cost ? Number(row.total_cost) : null,
        brand: row.brand,
        sample_image: row.sample_image,
        sample_category: row.sample_category,
      }));
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Pallet Program</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Curated pallets of home goods, up to 90% off MSRP
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
              <PalletCard 
                key={pallet.pallet_id} 
                pallet={pallet} 
                isInCart={isPalletInCart(pallet.pallet_id)}
                onAddToCart={() => handleAddPallet(pallet)}
              />
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
