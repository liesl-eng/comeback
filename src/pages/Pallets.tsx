import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";

interface PalletData {
  id: string;
  brand: string;
  category: string;
  title: string;
  palletId: string;
  itemCount: number;
  totalMsrp: number;
  imageUrl?: string;
}

const palletData: PalletData[] = [
  { id: "1", brand: "Arhaus", category: "Furniture", title: "Premium Living Room Collection", palletId: "PLT-ARH-001", itemCount: 217, totalMsrp: 45600 },
  { id: "2", brand: "Zuo Modern", category: "Furniture", title: "Contemporary Seating Assortment", palletId: "PLT-ZUO-002", itemCount: 184, totalMsrp: 38200 },
  { id: "3", brand: "Modus Furniture", category: "Furniture", title: "Bedroom Essentials Bundle", palletId: "PLT-MOD-003", itemCount: 156, totalMsrp: 32400 },
  { id: "4", brand: "Mercana", category: "Decor", title: "Artisan Decor Collection", palletId: "PLT-MER-004", itemCount: 243, totalMsrp: 28900 },
  { id: "5", brand: "Inspired Home", category: "Furniture", title: "Velvet Accent Chairs", palletId: "PLT-INS-005", itemCount: 128, totalMsrp: 24600 },
  { id: "6", brand: "NutriBullet", category: "Home & Wellness Tech", title: "Kitchen Appliance Lot", palletId: "PLT-NUT-006", itemCount: 312, totalMsrp: 18400 },
  { id: "7", brand: "Hatch Sleep", category: "Home & Wellness Tech", title: "Sleep Technology Bundle", palletId: "PLT-HAT-007", itemCount: 89, totalMsrp: 15200 },
  { id: "8", brand: "Arhaus", category: "Lighting", title: "Designer Lighting Collection", palletId: "PLT-ARH-008", itemCount: 176, totalMsrp: 52300 },
  { id: "9", brand: "Zuo Modern", category: "Outdoor", title: "Outdoor Furniture Set", palletId: "PLT-ZUO-009", itemCount: 94, totalMsrp: 41800 },
  { id: "10", brand: "Mercana", category: "Mirrors", title: "Statement Mirrors Assortment", palletId: "PLT-MER-010", itemCount: 67, totalMsrp: 19600 },
  { id: "11", brand: "Modus Furniture", category: "Furniture", title: "Dining Room Collection", palletId: "PLT-MOD-011", itemCount: 142, totalMsrp: 36800 },
  { id: "12", brand: "Inspired Home", category: "Pillows & Rugs", title: "Textile Accessories Bundle", palletId: "PLT-INS-012", itemCount: 289, totalMsrp: 14200 },
  { id: "13", brand: "Arhaus", category: "Decor", title: "Artisan Home Accents", palletId: "PLT-ARH-013", itemCount: 198, totalMsrp: 27400 },
  { id: "14", brand: "Zuo Modern", category: "Lighting", title: "Modern Pendant Collection", palletId: "PLT-ZUO-014", itemCount: 221, totalMsrp: 33600 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const PalletCard = ({ pallet }: { pallet: PalletData }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pallets/${pallet.palletId}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{ 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image Container - Square 1:1 ratio */}
      <div className="relative aspect-square bg-gray-200 rounded-t-xl overflow-hidden">
        {/* Placeholder gray background */}
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        
        {/* Heart icon - top left */}
        <button className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <Heart className="w-5 h-5 text-gray-400" />
        </button>
        
        {/* Item count badge - bottom right */}
        <div 
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md text-white text-xs font-bold uppercase tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #c5a028 100%)',
          }}
        >
          {pallet.itemCount} ITEMS
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex gap-2 mb-3">
          <span 
            className="px-3 py-1.5 text-xs font-medium rounded"
            style={{ backgroundColor: '#e8f4f8', color: '#0066cc' }}
          >
            {pallet.brand}
          </span>
          <span className="px-3 py-1.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
            {pallet.category}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {pallet.title}
        </h3>
        
        {/* Pallet ID */}
        <p className="text-sm text-gray-500 mb-3">
          {pallet.palletId}
        </p>
        
        {/* Divider */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Total MSRP
          </p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(pallet.totalMsrp)}
          </p>
        </div>
      </div>
    </div>
  );
};

const Pallets = () => {
  const { totalItems } = useCart();

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
          {palletData.map((pallet) => (
            <PalletCard key={pallet.id} pallet={pallet} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pallets;
