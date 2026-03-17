import { useState } from "react";
import { usePallet } from "@/contexts/PalletContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, ChevronUp, ChevronDown, Trash2, ArrowRight, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const MINIMUM_ORDER = 5000;

const PalletTray = () => {
  const { items, totalItems, totalPrice, amountToMinimum, isMinimumMet, removeItem, updateQuantity } = usePallet();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) return null;

  const progressPercent = Math.min(100, (totalPrice / MINIMUM_ORDER) * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-[0_-4px_20px_-4px_hsl(var(--foreground)/0.1)]">
      {/* Expanded item list */}
      {expanded && (
        <div className="max-h-[40vh] overflow-y-auto border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.product.discountedPrice)} each</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-sm font-semibold w-16 text-right">
                    {formatPrice(item.product.discountedPrice * item.quantity)}
                  </span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.product.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tray bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 md:gap-6 py-3">
          {/* Left: icon + label + expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <Package className="h-5 w-5 text-highlight" />
            <span className="font-semibold text-sm hidden sm:inline">Your Pallet</span>
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {/* Item count */}
          <span className="text-sm text-muted-foreground flex-shrink-0">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>

          {/* Running total */}
          <span className="text-sm font-bold flex-shrink-0">
            {formatPrice(totalPrice)}
          </span>

          {/* Progress bar */}
          <div className="flex-1 min-w-0 hidden md:block">
            <Progress
              value={progressPercent}
              className={`h-2.5 ${isMinimumMet ? "[&>div]:bg-success" : "[&>div]:bg-highlight"}`}
            />
            <p className={`text-xs mt-0.5 ${isMinimumMet ? "text-success font-semibold" : "text-muted-foreground"}`}>
              {isMinimumMet
                ? "Ready to quote!"
                : `${formatPrice(amountToMinimum)} to minimum order`}
            </p>
          </div>

          {/* CTA */}
          <Button
            variant={isMinimumMet ? "highlight" : "outline"}
            size="sm"
            disabled={!isMinimumMet}
            className="flex-shrink-0 gap-1.5"
            onClick={() => navigate("/pallet")}
          >
            Request Quote
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile progress bar */}
        <div className="md:hidden pb-2">
          <Progress
            value={progressPercent}
            className={`h-2 ${isMinimumMet ? "[&>div]:bg-success" : "[&>div]:bg-highlight"}`}
          />
          <p className={`text-xs mt-0.5 ${isMinimumMet ? "text-success font-semibold" : "text-muted-foreground"}`}>
            {isMinimumMet
              ? "Ready to quote!"
              : `${formatPrice(amountToMinimum)} to minimum order`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PalletTray;
