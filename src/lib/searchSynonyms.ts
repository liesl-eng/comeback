// Search synonym groups - when user searches for any term, all related terms are matched
const synonymGroups: string[][] = [
  // FURNITURE SYNONYMS
  ["couch", "sofa", "sectional"],
  ["table", "dining table", "coffee table", "side table", "console table", "accent table"],
  ["chair", "seat", "seating", "dining chair", "accent chair", "bar stool", "counter stool"],
  ["stool", "bar stool", "counter stool", "accent stool"],
  ["storage", "cabinet", "sideboard", "media console", "shelving"],
  ["shelf", "shelving", "bookcase", "bookshelf"],
  ["bench", "ottoman"],
  
  // DECOR SYNONYMS
  ["mirror", "wall mirror", "floor mirror", "framed mirror"],
  ["vase", "planter", "urn", "jar"],
  ["candle holder", "candleholder", "lantern"],
  ["basket", "tray", "bowl", "decorative bowl"],
  ["art", "wall art", "painting", "artwork", "print"],
  ["clock", "wall clock", "table clock", "floor clock"],
  
  // LIGHTING SYNONYMS
  ["light", "lighting", "lamp", "chandelier", "pendant", "table lamp", "floor lamp", "sconce"],
  ["chandelier"],
  ["pendant", "pendant light"],
  ["sconce", "wall sconce"],
  ["bulb"],
  
  // TEXTILES SYNONYMS
  ["pillow", "cushion", "pillow cover", "decorative pillow"],
  ["rug", "carpet", "area rug"],
  ["pouf", "pouffe"],
];

/**
 * Given a search query, returns an array of all terms that should be searched
 * (including the original query and all synonyms from matching groups)
 */
export const getSearchTerms = (query: string): string[] => {
  const normalizedQuery = query.toLowerCase().trim();
  const searchTerms = new Set<string>([normalizedQuery]);
  
  // Find all synonym groups that contain the query
  for (const group of synonymGroups) {
    const matchesGroup = group.some(term => {
      const normalizedTerm = term.toLowerCase();
      // Check if query matches term exactly or is contained in term
      return normalizedTerm === normalizedQuery || 
             normalizedTerm.includes(normalizedQuery) ||
             normalizedQuery.includes(normalizedTerm);
    });
    
    if (matchesGroup) {
      // Add all terms from this group to search terms
      for (const term of group) {
        searchTerms.add(term.toLowerCase());
      }
    }
  }
  
  return Array.from(searchTerms);
};

/**
 * Check if a product name matches the search query (including synonyms and plural forms)
 */
export const matchesSearchQuery = (productName: string, searchQuery: string): boolean => {
  if (!searchQuery) return true;
  
  const name = productName.toLowerCase();
  const searchTerms = getSearchTerms(searchQuery);
  
  // Check if product name matches any of the search terms
  for (const term of searchTerms) {
    // Exact or partial match
    if (name.includes(term)) {
      return true;
    }
    
    // Plural/singular variations
    if (term.endsWith('s') && name.includes(term.slice(0, -1))) {
      return true;
    }
    if (!term.endsWith('s') && name.includes(term + 's')) {
      return true;
    }
  }
  
  return false;
};
