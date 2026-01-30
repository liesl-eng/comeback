import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const formatCurrency = (amount: number) => {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
};

const PalletDetail = () => {
  const { palletId } = useParams<{ palletId: string }>();
  const { totalItems, addPallet } = useCart();

  const { data: items, isLoading } = useQuery({
    queryKey: ['pallet-items', palletId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pallet_items')
        .select('*')
        .eq('pallet_id', palletId)
        .order('product_name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!palletId,
  });

  const { data: palletSummary } = useQuery({
    queryKey: ['pallet-summary', palletId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pallet_summary')
        .select('*')
        .eq('pallet_id', palletId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!palletId,
  });

  const totalMsrp = items?.reduce((sum, item) => sum + Number(item.original_price), 0) ?? 0;

  const handleAddToRequest = () => {
    if (!palletSummary || !palletId) return;
    
    addPallet({
      palletId: palletId,
      brand: palletSummary.brand,
      totalCost: Number(palletSummary.total_cost),
      totalMsrp: totalMsrp,
    });
  };

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
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <h1 className="text-2xl md:text-4xl font-bold">Pallet {palletId}</h1>
            <Button 
              variant="highlight" 
              size="sm" 
              className="gap-2"
              onClick={handleAddToRequest}
              disabled={!palletSummary}
            >
              <Plus className="h-4 w-4" />
              Add to Request
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <span>{items?.length ?? 0} items</span>
            <span>•</span>
            <span className="font-bold text-foreground">Pallet Cost: {formatCurrency(Number(palletSummary?.total_cost ?? 0))}</span>
            <span>•</span>
            <span>Total MSRP Value: {formatCurrency(totalMsrp)}</span>
          </div>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border p-4">
                <Skeleton className="aspect-square rounded-md mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4"
              >
                {/* Image */}
                <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
                  {item.primary_image ? (
                    <img 
                      src={item.primary_image} 
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                </div>

                {/* Category badge */}
                {item.category_name && (
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground mb-2">
                    {item.category_name}
                  </span>
                )}

                {/* Product name */}
                <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                  {item.product_name}
                </h3>

                {/* SKU */}
                <p className="text-xs text-muted-foreground mb-2">
                  SKU: {item.product_sku}
                </p>

                {/* Price */}
                <p className="text-lg font-bold text-foreground">
                  Item MSRP: {formatCurrency(Number(item.original_price))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">
              No items found for pallet <span className="font-semibold">{palletId}</span>.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PalletDetail;
