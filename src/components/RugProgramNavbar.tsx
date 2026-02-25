import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import comebackLogo from "@/assets/comeback-goods-logo.png";

interface RugProgramNavbarProps {
  onGetQuoteClick: () => void;
}

const RugProgramNavbar = ({ onGetQuoteClick }: RugProgramNavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Left: Logo + Rug Program sub-brand */}
          <Link to="/rug-program" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
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
                Rug Program
              </span>
            </div>
          </Link>

          {/* Right: Get a Quote + Marketplace link */}
          <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
            <Button
              variant="accent"
              size="sm"
              onClick={onGetQuoteClick}
              className="md:text-base md:px-5 md:h-10"
            >
              Get a Quote
            </Button>
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Visit B2B Marketplace
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RugProgramNavbar;
