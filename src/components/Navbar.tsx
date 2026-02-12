import { ShoppingCart, Search, Menu, X, Heart, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import comebackLogo from "@/assets/comeback-goods-logo.png";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  cartItemCount?: number;
}

const Navbar = ({ cartItemCount = 0 }: NavbarProps) => {
  const navigate = useNavigate();
  const { totalFavorites } = useFavorites();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between gap-2 md:gap-4">
          {/* Left: Logo + Tagline */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <img 
              src={comebackLogo} 
              alt="Comeback Goods" 
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold text-foreground tracking-tight">
                Comeback Goods
              </span>
              <span className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                B2B Marketplace
              </span>
            </div>
          </Link>

          {/* Center: Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2 md:mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Find Your Goods"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full text-sm"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link to="/products">
              <Button variant="accent" size="sm">
                Browse Products
              </Button>
            </Link>
            <Link to="/rug-program">
              <Button variant="outline" size="sm">
                Rug Program
              </Button>
            </Link>
            <Link to="/favorites">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
              >
                <Heart className={`h-5 w-5 ${totalFavorites > 0 ? "fill-accent text-accent" : ""}`} />
                {totalFavorites > 0 && (
                  <Badge
                    variant="accent"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {totalFavorites}
                  </Badge>
                )}
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
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: Favorites + Cart + Menu */}
          <div className="flex md:hidden items-center gap-1">
            <Link to="/favorites">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
              >
                <Heart className={`h-5 w-5 ${totalFavorites > 0 ? "fill-accent text-accent" : ""}`} />
                {totalFavorites > 0 && (
                  <Badge
                    variant="accent"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {totalFavorites}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="accent"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <div className="flex flex-col gap-2">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="accent" className="w-full">
                  Browse Products
                </Button>
              </Link>
              <Link to="/rug-program" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Rug Program
                </Button>
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  About
                </Button>
              </Link>
              {user ? (
                <Button variant="outline" className="w-full gap-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
