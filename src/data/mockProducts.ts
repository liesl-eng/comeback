import { Product } from "@/types/product";

// Import CSV files as raw text
import arhausCSV from "./arhaus.csv?raw";
import zuoModernCSV from "./zuo_modern.csv?raw";
import moesHomeCSV from "./moes_home.csv?raw";
import modusFurnitureCSV from "./modus_furniture.csv?raw";
import mercanaCSV from "./mercana.csv?raw";
import inspiredHomeCSV from "./inspired_home.csv?raw";
import nutribulletCSV from "./nutribullet.csv?raw";
import hatchCSV from "./hatch.csv?raw";

// Helper function to parse price strings
const parsePrice = (priceStr: string): number => {
  return parseFloat(priceStr.replace(/[$,]/g, ''));
};

// Helper function to parse quantity strings (remove commas)
const parseQuantity = (quantityStr: string): number => {
  return parseInt(quantityStr.replace(/,/g, '')) || 0;
};

// Parse CSV data into products
const parseCSV = (csvText: string): Product[] => {
  const lines = csvText.trim().split('\n');
  const products: Product[] = [];
  
  // Skip header row (line 0) and any blank lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV with potential quoted fields
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    
    if (parts.length < 6) continue;
    
    const name = parts[0];
    const brand = parts[1];
    const imageUrl = parts[2];
    const priceStr = parts[3];
    const msrpStr = parts[4];
    const quantityStr = parts[5];
    
    // Skip if essential fields are missing or invalid
    if (!name || !brand || !priceStr || !msrpStr || msrpStr === 'N/A') continue;
    
    const price = parsePrice(priceStr);
    const msrp = parsePrice(msrpStr);
    const quantity = parseQuantity(quantityStr);
    
    // Skip if price is 0
    if (price === 0 || msrp === 0) continue;
    
    // Calculate discount percentage
    const discountPercentage = Math.round(((msrp - price) / msrp) * 100);
    
    products.push({
      id: `${brand}-${i}`,
      name,
      description: `Premium ${name.toLowerCase()} from ${brand}`,
      category: brand,
      originalPrice: msrp,
      discountedPrice: price,
      discountPercentage,
      supplier: {
        id: "s1",
        name: brand,
        rating: 4.8,
        verified: true,
      },
      inStock: quantity > 0,
      imageUrl: imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg',
      condition: 'like-new' as const,
      quantity,
      brand,
      sku: `${brand.substring(0, 3).toUpperCase()}-${i.toString().padStart(4, '0')}`,
    });
  }
  
  return products;
};

// Parse all CSV files and combine into one array
export const mockProducts: Product[] = [
  ...parseCSV(arhausCSV),
  ...parseCSV(zuoModernCSV),
  ...parseCSV(moesHomeCSV),
  ...parseCSV(modusFurnitureCSV),
  ...parseCSV(mercanaCSV),
  ...parseCSV(inspiredHomeCSV),
  ...parseCSV(nutribulletCSV),
  ...parseCSV(hatchCSV),
].filter(product => product !== null);
