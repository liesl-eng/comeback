import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { useBuildOrder, OrderItem } from "@/contexts/BuildOrderContext";

interface Props {
  item: Omit<OrderItem, "quantity">;
}

export default function AddToOrderButton({ item }: Props) {
  const { state, addItem, addSpace } = useBuildOrder();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const doAdd = (spaceId: string, spaceName: string) => {
    addItem(spaceId, item, 1);
    toast.success(`${item.productName} added to ${spaceName}`);
    setOpen(false);
    setCreating(false);
    setNewName("");
  };

  const handleClick = () => {
    if (state.spaces.length === 1 && !creating) {
      const s = state.spaces[0];
      addItem(s.id, item, 1);
      toast.success(`Added to ${s.name} — tap "View Order" to review`);
      return;
    }
    setOpen(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={handleClick}
          className="mt-auto w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add to Order
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <p className="text-sm font-semibold mb-2">Add to which space?</p>
        <div className="space-y-1 max-h-56 overflow-y-auto">
          {state.spaces.map((s) => (
            <button
              key={s.id}
              onClick={() => doAdd(s.id, s.name)}
              className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted flex items-center justify-between"
            >
              <span className="truncate">{s.name}</span>
              <span className="text-xs text-muted-foreground">{s.items.length}</span>
            </button>
          ))}
        </div>
        <div className="border-t mt-2 pt-2">
          {creating ? (
            <div className="flex items-center gap-1">
              <Input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Space name"
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const id = addSpace(newName.trim() || undefined);
                    doAdd(id, newName.trim() || `Space ${state.spaces.length + 1}`);
                  }
                  if (e.key === "Escape") { setCreating(false); setNewName(""); }
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  const id = addSpace(newName.trim() || undefined);
                  doAdd(id, newName.trim() || `Space ${state.spaces.length + 1}`);
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted text-accent font-semibold flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> New Space
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
