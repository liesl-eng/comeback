import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Module-level cache so all pages share one fetch per session.
let cache: Date | null = null;
let inflight: Promise<Date | null> | null = null;

async function fetchTimestamp(): Promise<Date | null> {
  const { data, error } = await supabase.rpc("last_inventory_refreshed_at");
  if (error || !data) return null;
  const d = new Date(data as string);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatInventoryRefreshed(d: Date): string {
  const datePart = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s?(AM|PM)$/i, (_, m) => ` ${m.toUpperCase()}`);
  return `INVENTORY REFRESHED ${datePart}, ${timePart}.`;
}

export function useInventoryRefreshedAt(): Date | null {
  const [value, setValue] = useState<Date | null>(cache);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    if (!inflight) inflight = fetchTimestamp();
    inflight.then((d) => {
      cache = d;
      if (!cancelled) setValue(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return value;
}
