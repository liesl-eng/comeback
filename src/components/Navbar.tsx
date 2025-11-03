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
  return <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold text-foreground">Comeback Goods B2B</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant={location.pathname === "/" ? "default" : "ghost"} size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/products">
              <Button variant={location.pathname === "/products" ? "default" : "ghost"} size="sm">
                Browse Products
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart
                {cartItemCount > 0 && <Badge variant="accent" className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;