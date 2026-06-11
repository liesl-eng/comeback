import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Minus, Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useBuildOrder, OrderItem } from "@/contexts/BuildOrderContext";
import { cn } from "@/lib/utils";

interface Props {
  item: Omit<OrderItem, "quantity">;
}

interface SpaceOptionRowProps {
  id: string;
  name: string;
  count: number;
  active: boolean;
  onSelect: () => void;
  showPencil?: boolean;
}


function SpaceOptionRow({ id, name, count, active, onSelect, showPencil }: SpaceOptionRowProps) {
  const { renameSpace } = useBuildOrder();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!editing) setDraft(name); }, [name, editing]);
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => { renameSpace(id, draft); setEditing(false); };
  const cancel = () => { setDraft(name); setEditing(false); };

  if (editing) {
    return (
      <div
        className="w-full flex items-center gap-1 px-2 py-1.5 rounded border border-accent bg-accent/10"
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commit(); }
            if (e.key === "Escape") { e.preventDefault(); cancel(); }
          }}
          onClick={(e) => e.stopPropagation()}
          className="h-7 text-sm flex-1"
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onMouseDown={(e) => e.preventDefault()}
          onClick={commit}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full flex items-center gap-1 rounded border",
        active ? "border-accent bg-accent/10" : "border-transparent hover:bg-muted",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 min-w-0 text-left text-sm px-2 py-1.5 flex items-center justify-between"
      >
        <span className="truncate">{name}</span>
        <span className="text-xs text-muted-foreground ml-2">{count}</span>
      </button>
      {showPencil && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7 mr-1 text-muted-foreground hover:text-foreground"
          title="Rename space"
          onClick={(e) => { e.stopPropagation(); setEditing(true); }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

export default function AddToOrderButton({ item }: Props) {
  const { state, addItem, addSpaceWithItem } = useBuildOrder();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [qtyInput, setQtyInput] = useState("1");
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const max = Math.max(1, item.unitsAvailable || 1);
  const clampQty = (n: number) => Math.max(1, Math.min(max, n));

  const setQtyBoth = (n: number) => {
    const c = clampQty(n);
    setQty(c);
    setQtyInput(String(c));
  };

  const commitQty = () => {
    const parsed = parseInt(qtyInput, 10);
    if (isNaN(parsed) || parsed < 1) {
      setQtyBoth(1);
      setShowMaxWarning(false);
      return 1;
    }
    if (parsed > max) {
      setQtyBoth(max);
      setShowMaxWarning(true);
      return max;
    }
    setQtyBoth(parsed);
    setShowMaxWarning(false);
    return parsed;
  };

  const resetAndClose = () => {
    setOpen(false);
    setCreating(false);
    setNewName("");
    setQty(1);
    setQtyInput("1");
    setShowMaxWarning(false);
    setSelectedSpaceId(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setQty(1);
      setQtyInput("1");
      setShowMaxWarning(false);
      setSelectedSpaceId(state.spaces.length === 1 ? state.spaces[0].id : null);
    }
    setOpen(next);
  };

  const confirmAdd = (spaceId: string, spaceName: string, finalQty: number) => {
    addItem(spaceId, item, finalQty);
    toast.success(`${finalQty} × ${item.productName} added to ${spaceName}`);
    resetAndClose();
  };

  const handleConfirm = () => {
    const finalQty = commitQty();
    if (creating) {
      handleCreateSpace(finalQty);
      return;
    }
    if (!selectedSpaceId) return;
    const sp = state.spaces.find((s) => s.id === selectedSpaceId);
    if (!sp) return;
    confirmAdd(sp.id, sp.name, finalQty);
  };

  const handleCreateSpace = (overrideQty?: number) => {
    const q = overrideQty ?? commitQty();
    const { id, name } = addSpaceWithItem(newName, item, q);
    toast.success(`${q} × ${item.productName} added to ${name}`);
    resetAndClose();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button className="mt-auto w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Plus className="h-4 w-4 mr-1.5" /> Add to Order
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="end">
        {/* Quantity stepper */}
        <p className="text-sm font-semibold mb-2">Quantity</p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setQtyBoth(qty - 1)}
            disabled={qty <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min={1}
            max={max}
            value={qtyInput}
            onChange={(e) => {
              const v = e.target.value;
              setQtyInput(v);
              const parsed = parseInt(v, 10);
              if (!isNaN(parsed) && parsed >= 1 && parsed <= max) {
                setQty(parsed);
                setShowMaxWarning(false);
              }
            }}
            onBlur={() => commitQty()}
            className="h-9 w-16 text-center"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setQtyBoth(qty + 1)}
            disabled={qty >= max}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {showMaxWarning ? (
          <p className="text-xs text-destructive text-center mb-3">
            Max available: {max}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground text-center mb-3">
            {max} available
          </p>
        )}

        {/* Space picker */}
        <p className="text-sm font-semibold mb-2">Add to Space</p>
        <div className="space-y-1 max-h-44 overflow-y-auto mb-2">
          {state.spaces.map((s) => (
            <SpaceOptionRow
              key={s.id}
              id={s.id}
              name={s.name}
              count={s.items.length}
              active={s.id === selectedSpaceId}
              onSelect={() => setSelectedSpaceId(s.id)}
              showPencil={state.spaces.length === 1 && s.name === "Space 1"}
            />
          ))}
        </div>

        <div className="border-t pt-2 mb-3">
          {creating ? (
            <div className="flex items-center gap-1">
              <Input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Space name"
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleCreateSpace(); }
                  if (e.key === "Escape") { setCreating(false); setNewName(""); }
                }}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleCreateSpace}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted text-accent font-semibold flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> New Space
            </button>
          )}
        </div>

        <Button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedSpaceId}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
        >
          Add to Order
        </Button>
      </PopoverContent>
    </Popover>
  );
}
