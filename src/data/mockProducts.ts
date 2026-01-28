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

// Helper function to round prices to wholesale-friendly numbers
const roundToWholesalePrice = (price: number): number => {
  if (price < 100) {
    // Round to nearest $5
    return Math.round(price / 5) * 5;
  } else if (price <= 500) {
    // Round to nearest $10
    return Math.round(price / 10) * 10;
  } else {
    // Round to nearest $25
    return Math.round(price / 25) * 25;
  }
};

// Helper function to parse quantity strings (remove commas)
const parseQuantity = (quantityStr: string): number => {
  return parseInt(quantityStr.replace(/,/g, '')) || 0;
};

// Parse CSV data into products
const parseCSV = (csvText: string): Product[] => {
  const lines = csvText.trim().split('\n');
  const products: Product[] = [];
  
  // Check header to determine format (with or without Category column)
  // Header might have "category" label OR have 7 columns (even with empty label)
  const headerLine = lines[0]?.toLowerCase() || '';
  const headerColumns = headerLine.split(',').length;
  const hasCategory = headerLine.includes('category') || headerColumns >= 7;
  
  // Start from line 1 (skip header) or line 2 if there's an empty row
  const startIndex = lines[1]?.trim() === '' || lines[1]?.startsWith(',,,') ? 2 : 1;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line === ',,,,,') continue;
    
    // Handle CSV with potential quoted fields - improved parser
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
    
    // Parse based on format
    let name: string, brand: string, category: string, imageUrl: string, priceStr: string, msrpStr: string, quantityStr: string;
    
    if (hasCategory && parts.length >= 7) {
      // New format: Name, Brand, Category, Image URL, Price, MSRP, Units Available
      name = parts[0];
      brand = parts[1];
      category = parts[2] === 'Textiles' ? 'Pillows & Rugs' : parts[2];
      imageUrl = parts[3];
      priceStr = parts[4];
      msrpStr = parts[5];
      quantityStr = parts[6];
    } else if (parts.length >= 6) {
      // Old format: Name, Brand, Image URL, Price, MSRP, Units Available
      name = parts[0];
      brand = parts[1];
      category = brand; // fallback to brand as category
      imageUrl = parts[2];
      priceStr = parts[3];
      msrpStr = parts[4];
      quantityStr = parts[5];
    } else {
      continue;
    }
    
    // Skip if essential fields are missing
    if (!name || !brand) continue;
    
    // Skip if price or MSRP are missing or invalid
    if (!priceStr || !msrpStr || msrpStr === 'N/A' || priceStr === '$0.00') continue;
    
    const price = parsePrice(priceStr);
    const msrp = parsePrice(msrpStr);
    const quantity = parseQuantity(quantityStr);
    
    // Skip if parsed price is 0
    if (price === 0 || msrp === 0) continue;
    
    // Calculate discount percentage
    let discountPercentage = Math.round(((msrp - price) / msrp) * 100);
    
    // Apply 70% discount cap - if discount exceeds 70%, raise price to cap at 70% off
    let finalPrice = price;
    if (discountPercentage > 70) {
      finalPrice = msrp * 0.30; // New price = 30% of MSRP (70% off)
      discountPercentage = 70;
    }
    
    // Round to wholesale-friendly price
    finalPrice = roundToWholesalePrice(finalPrice);
    
    // Recalculate discount percentage based on rounded price
    discountPercentage = Math.round(((msrp - finalPrice) / msrp) * 100);
    
    products.push({
      id: `${brand}-${i}`,
      name,
      description: `Premium ${name.toLowerCase()} from ${brand}`,
      category: category || brand,
      originalPrice: msrp,
      discountedPrice: finalPrice,
      discountPercentage,
      supplier: {
        id: "s1",
        name: brand,
        rating: 4.8,
        verified: true,
      },
      inStock: quantity > 0,
      imageUrl: imageUrl && imageUrl !== 'N/A' ? imageUrl : 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Arhaus_logo.jpg',
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
  // ...parseCSV(mercanaCSV), // Temporarily hidden - image issues
  ...parseCSV(inspiredHomeCSV),
  ...parseCSV(nutribulletCSV),
  ...parseCSV(hatchCSV),
].filter(product => product !== null);
