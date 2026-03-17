import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CategoryFiltersProps {
  selectedCategory: string | null;
  // Category-specific filter state
  categoryFilters: Record<string, string | null>;
  onCategoryFilterChange: (key: string, value: string | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
}

const CATEGORY_SPECIFIC_FILTERS: Record<string, { key: string; label: string; options: string[] }[]> = {
  Furniture: [
    { key: "roomType", label: "Room Type", options: ["Living Room", "Bedroom", "Dining", "Office", "Outdoor"] },
    { key: "itemType", label: "Item Type", options: ["Sofa", "Chair", "Table", "Bed Frame", "Dresser", "Cabinet", "Shelf"] },
    { key: "material", label: "Material", options: ["Wood", "Metal", "Upholstered", "Glass", "Marble"] },
  ],
  "Pillows & Rugs": [
    { key: "size", label: "Size", options: ["2x3", "5x7", "8x10", "9x12", "Runner", "Other"] },
    { key: "style", label: "Style", options: ["Abstract", "Geometric", "Solid", "Traditional", "Bohemian"] },
    { key: "material", label: "Material", options: ["Wool", "Polypropylene", "Jute", "Polyester"] },
    { key: "colorFamily", label: "Color Family", options: ["Neutral", "Blue", "Red", "Green", "Gray", "Multi"] },
  ],
  Lighting: [
    { key: "lightType", label: "Type", options: ["Floor Lamp", "Table Lamp", "Pendant", "Sconce", "Ceiling"] },
    { key: "finish", label: "Finish", options: ["Black", "Brass", "Nickel", "White", "Natural"] },
  ],
  Decor: [
    { key: "sizeRange", label: "Size Range", options: ["Small", "Medium", "Large", "Oversized"] },
  ],
  Mirrors: [
    { key: "shape", label: "Shape", options: ["Round", "Rectangle", "Arch", "Irregular"] },
    { key: "sizeRange", label: "Size Range", options: ["Small", "Medium", "Large", "Oversized"] },
  ],
  Outdoor: [
    { key: "itemType", label: "Item Type", options: ["Seating", "Dining", "Accent", "Planters"] },
    { key: "material", label: "Material", options: ["Wicker", "Aluminum", "Teak", "Concrete"] },
  ],
};

const FilterGroup = ({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-wrap gap-1.5 pb-3">
          <Button
            variant={selected === null ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => onSelect(null)}
          >
            All
          </Button>
          {options.map((opt) => (
            <Button
              key={opt}
              variant={selected === opt ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => onSelect(opt === selected ? null : opt)}
            >
              {opt}
            </Button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const CategoryFilters = ({
  selectedCategory,
  categoryFilters,
  onCategoryFilterChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
}: CategoryFiltersProps) => {
  const filters = selectedCategory ? CATEGORY_SPECIFIC_FILTERS[selectedCategory] || [] : [];

  return (
    <div className="space-y-1">
      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
          Price Range
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pb-3 space-y-3">
            <Slider
              min={0}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueChange={(v) => onPriceRangeChange(v as [number, number])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Condition */}
      <FilterGroup
        label="Condition"
        options={["New – Warehouse Direct", "Inspected – Like New", "Minor Cosmetic Flaw"]}
        selected={categoryFilters.condition || null}
        onSelect={(v) => onCategoryFilterChange("condition", v)}
      />

      {/* Category-specific filters */}
      {filters.map((filter) => (
        <FilterGroup
          key={filter.key}
          label={filter.label}
          options={filter.options}
          selected={categoryFilters[filter.key] || null}
          onSelect={(v) => onCategoryFilterChange(filter.key, v)}
        />
      ))}
    </div>
  );
};

export default CategoryFilters;
