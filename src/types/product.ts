export interface WholesaleOption {
  type: 'single' | 'case' | 'pallet';
  unitsPerPurchase: number;
  pricePerUnit: number;
  originalPricePerUnit: number;
  moq: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  supplier: Supplier;
  inStock: boolean;
  imageUrl: string;
  condition: 'like-new' | 'minor-defects' | 'cosmetic-damage' | 'refurbished';
  quantity: number;
  brand?: string;
  sku?: string;
  conditionDetails?: string;
  wholesaleOptions?: WholesaleOption[];
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
