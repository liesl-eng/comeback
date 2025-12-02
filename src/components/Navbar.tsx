import { ShoppingCart, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
interface NavbarProps {
  cartItemCount?: number;
}
const Navbar = ({
  cartItemCount = 0
}: NavbarProps) => {
  const location = useLocation();
  return <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              Comeback Goods
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              Wholesale marketplace for slightly imperfect goods
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/products">
              <Button 
                variant={location.pathname === "/products" ? "default" : "ghost"} 
                size="sm"
              >
                Browse Products
              </Button>
            </Link>
            <Link to="/cart">
              <Button 
                variant="outline" 
                size="sm" 
                className="relative gap-2 hover:border-accent/50 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
                {cartItemCount > 0 && (
                  <Badge 
                    variant="accent" 
                    className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;