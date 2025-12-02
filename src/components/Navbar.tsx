import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface NavbarProps {
  cartItemCount?: number;
}

const Navbar = ({ cartItemCount = 0 }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Left: Logo + Tagline */}
          <Link to="/" className="flex flex-col flex-shrink-0">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              Comeback Goods
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              Wholesale marketplace for slightly imperfect goods
            </span>
          </Link>

          {/* Center: Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Find Your Goods"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </form>

          {/* Right: Navigation */}
          <div className="flex items-center gap-3 flex-shrink-0">
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
    </nav>
  );
};

export default Navbar;