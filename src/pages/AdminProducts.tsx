import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldAlert, Download, Upload, Eye, CheckCircle, XCircle } from "lucide-react";
import { BRAND_TABS, BrandTab, SheetRow, fetchSheetTab } from "@/lib/productSheet";
import { categorizeProduct } from "@/lib/productCategory";
import { findDuplicates, normalizeProductName, productKey } from "@/lib/duplicateDetection";
import { parseMasterCsv, MasterRow } from "@/lib/masterCsv";

interface BrandState {
  loading: boolean;
  rows: SheetRow[] | null;
  error: string | null;
  // Mercana image upload state
  uploadedFiles: Map<string, string>; // lowercase filename -> public url
  uploading: boolean;
  uploadProgress: { done: number; total: number };
  // Import
  importing: boolean;
  importProgress: { done: number; total: number };
  importReport: { ok: number; skipped: { name: string; reason: string }[] } | null;
  preview: boolean;
}

const emptyState: BrandState = {
  loading: false,
  rows: null,
  error: null,
  uploadedFiles: new Map(),
  uploading: false,
  uploadProgress: { done: 0, total: 0 },
  importing: false,
  importProgress: { done: 0, total: 0 },
  importReport: null,
  preview: false,
};

interface DupRow {
  id: string;
  name: string;
  brand: string;
  units_available: number;
  price: number | null;
  msrp: number | null;
  image_url: string | null;
}

export default function AdminProducts() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<BrandTab>("Mercana");
  const [state, setState] = useState<Record<BrandTab, BrandState>>(() => {
    const init: Record<string, BrandState> = {};
    BRAND_TABS.forEach((b) => (init[b] = { ...emptyState, uploadedFiles: new Map() }));
    return init as Record<BrandTab, BrandState>;
  });

  // Duplicate scanner state
  const [dupScanning, setDupScanning] = useState(false);
  const [dupGroups, setDupGroups] = useState<{ key: string; items: DupRow[] }[] | null>(null);
  const [dupBusy, setDupBusy] = useState<string | null>(null);

  // Wipe catalog
  const [wiping, setWiping] = useState(false);
  const [wipeConfirm, setWipeConfirm] = useState("");

  async function wipeCatalog() {
    if (wipeConfirm !== "WIPE") {
      toast({ title: "Type WIPE to confirm", variant: "destructive" });
      return;
    }
    setWiping(true);
    const { error, count } = await supabase
      .from("products")
      .delete({ count: "exact" })
      .not("id", "is", null);
    setWiping(false);
    if (error) {
      toast({ title: "Wipe failed", description: error.message, variant: "destructive" });
      return;
    }
    setWipeConfirm("");
    toast({ title: `Deleted ${count ?? 0} products`, description: "Catalog is now empty." });
  }


  // Master CSV import state
  const [masterRows, setMasterRows] = useState<MasterRow[] | null>(null);
  const [masterCsvName, setMasterCsvName] = useState<string>("");
  const [masterErrors, setMasterErrors] = useState<string[]>([]);
  const [masterImporting, setMasterImporting] = useState(false);
  const [masterProgress, setMasterProgress] = useState({ done: 0, total: 0 });
  const [masterReport, setMasterReport] = useState<{ ok: number; skipped: { name: string; reason: string }[] } | null>(null);
  const [mercanaIndex, setMercanaIndex] = useState<Map<string, string> | null>(null);
  const [mercanaIndexLoading, setMercanaIndexLoading] = useState(false);

  async function loadMercanaIndex(): Promise<Map<string, string>> {
    setMercanaIndexLoading(true);
    const map = new Map<string, string>();
    let offset = 0;
    const limit = 1000;
    while (true) {
      const { data, error } = await supabase.storage
        .from("product-images")
        .list("mercana", { limit, offset, sortBy: { column: "name", order: "asc" } });
      if (error) {
        toast({ title: "Could not list Mercana images", description: error.message, variant: "destructive" });
        break;
      }
      if (!data || data.length === 0) break;
      for (const obj of data) {
        if (!obj.name) continue;
        const { data: pub } = supabase.storage.from("product-images").getPublicUrl(`mercana/${obj.name}`);
        map.set(obj.name.toLowerCase(), pub.publicUrl);
      }
      if (data.length < limit) break;
      offset += limit;
    }
    setMercanaIndex(map);
    setMercanaIndexLoading(false);
    toast({ title: `Indexed ${map.size} Mercana images` });
    return map;
  }

  async function handleMasterCsvFile(file: File) {
    setMasterReport(null);
    setMasterErrors([]);
    setMasterCsvName(file.name);
    const text = await file.text();
    const { rows, errors } = parseMasterCsv(text);
    setMasterRows(rows);
    setMasterErrors(errors);
    if (errors.length) {
      toast({ title: "CSV parse issues", description: errors.join("; "), variant: "destructive" });
    } else {
      toast({ title: `Parsed ${rows.length} rows` });
    }
  }

  async function importMaster() {
    if (!masterRows) return;
    setMasterImporting(true);
    setMasterReport(null);
    const skipped: { name: string; reason: string }[] = [];
    const records: any[] = [];

    let mercanaMap = mercanaIndex;
    const hasMercana = masterRows.some((r) => r.brand.trim().toLowerCase() === "mercana");
    if (hasMercana && !mercanaMap) {
      mercanaMap = await loadMercanaIndex();
    }

    const warnings: { name: string; reason: string }[] = [];
    for (const r of masterRows) {
      const isMercana = r.brand.trim().toLowerCase() === "mercana";
      let imageUrl: string | null = null;
      let imageFilename: string | null = null;
      if (r.imageUrl) {
        if (isMercana && !/^https?:\/\//i.test(r.imageUrl)) {
          imageFilename = r.imageUrl;
          imageUrl = mercanaMap?.get(r.imageUrl.toLowerCase()) ?? null;
          if (!imageUrl) warnings.push({ name: r.name, reason: `Mercana image not found in storage: ${r.imageUrl}` });
        } else if (/^https?:\/\//i.test(r.imageUrl)) {
          imageUrl = r.imageUrl;
        } else {
          warnings.push({ name: r.name, reason: `Image is not a URL: ${r.imageUrl}` });
        }
      }
      if (r.comebackPrice == null) {
        warnings.push({ name: r.name, reason: "missing Comeback Price (imported with no price)" });
      }
      records.push({
        name: r.name,
        brand: r.brand,
        category: r.category,
        image_url: imageUrl,
        image_filename: imageFilename,
        price: r.comebackPrice,
        msrp: r.msrp,
        cost: r.cost,
        pricing_rule: r.pricingRule,
        units_available: r.unitsAvailable,
      });
    }
    skipped.push(...warnings);

    setMasterProgress({ done: 0, total: records.length });
    const chunkSize = 200;
    let inserted = 0;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const { error } = await supabase
        .from("products")
        .upsert(chunk, { onConflict: "brand,name" });
      if (error) chunk.forEach((c) => skipped.push({ name: c.name, reason: error.message }));
      else inserted += chunk.length;
      setMasterProgress({ done: i + chunk.length, total: records.length });
    }
    setMasterImporting(false);
    setMasterReport({ ok: inserted, skipped });
    toast({ title: `Imported ${inserted} products`, description: `${skipped.length} skipped` });
  }

  async function scanDuplicates() {
    setDupScanning(true);
    setDupGroups(null);
    const all: DupRow[] = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,brand,units_available,price,msrp,image_url")
        .range(from, from + pageSize - 1);
      if (error) {
        toast({ title: "Scan failed", description: error.message, variant: "destructive" });
        setDupScanning(false);
        return;
      }
      if (!data || data.length === 0) break;
      all.push(...(data as DupRow[]));
      if (data.length < pageSize) break;
      from += pageSize;
    }
    const groups = findDuplicates(all);
    setDupGroups(groups);
    setDupScanning(false);
    toast({
      title: `Scanned ${all.length} products`,
      description: `${groups.length} duplicate group(s) found`,
    });
  }

  async function mergeGroup(group: { key: string; items: DupRow[] }) {
    setDupBusy(group.key);
    // Pick keeper: prefer one with image, then highest units, then lowest id
    const sorted = [...group.items].sort((a, b) => {
      if (!!b.image_url !== !!a.image_url) return b.image_url ? 1 : -1;
      return b.units_available - a.units_available;
    });
    const keeper = sorted[0];
    const others = sorted.slice(1);
    const totalUnits = group.items.reduce((s, r) => s + (r.units_available ?? 0), 0);
    const bestImage = group.items.find((r) => r.image_url)?.image_url ?? null;
    const minPrice = group.items
      .map((r) => r.price)
      .filter((p): p is number => p != null)
      .reduce<number | null>((m, p) => (m == null || p < m ? p : m), null);
    const maxMsrp = group.items
      .map((r) => r.msrp)
      .filter((p): p is number => p != null)
      .reduce<number | null>((m, p) => (m == null || p > m ? p : m), null);

    const { error: updErr } = await supabase
      .from("products")
      .update({
        units_available: totalUnits,
        image_url: keeper.image_url ?? bestImage,
        price: minPrice ?? keeper.price,
        msrp: maxMsrp ?? keeper.msrp,
      })
      .eq("id", keeper.id);
    if (updErr) {
      toast({ title: "Merge failed", description: updErr.message, variant: "destructive" });
      setDupBusy(null);
      return;
    }
    const { error: delErr } = await supabase
      .from("products")
      .delete()
      .in("id", others.map((o) => o.id));
    if (delErr) {
      toast({ title: "Cleanup failed", description: delErr.message, variant: "destructive" });
      setDupBusy(null);
      return;
    }
    setDupGroups((prev) => (prev ? prev.filter((g) => g.key !== group.key) : prev));
    setDupBusy(null);
    toast({ title: `Merged ${others.length + 1} → 1`, description: keeper.name });
  }

  async function deleteDuplicate(group: { key: string; items: DupRow[] }, id: string) {
    setDupBusy(group.key + id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setDupBusy(null);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setDupGroups((prev) =>
      prev
        ? prev
            .map((g) =>
              g.key === group.key ? { ...g, items: g.items.filter((i) => i.id !== id) } : g,
            )
            .filter((g) => g.items.length > 1)
        : prev,
    );
  }

  function patch(brand: BrandTab, p: Partial<BrandState>) {
    setState((prev) => ({ ...prev, [brand]: { ...prev[brand], ...p } }));
  }

  async function handleFetch(brand: BrandTab) {
    patch(brand, { loading: true, error: null, importReport: null });
    try {
      const rows = await fetchSheetTab(brand);
      patch(brand, { loading: false, rows });
      toast({ title: `Loaded ${rows.length} rows from "${brand}"` });
    } catch (e: any) {
      patch(brand, { loading: false, error: e.message });
    }
  }

  async function handleUpload(brand: BrandTab, files: FileList) {
    const arr = Array.from(files);
    patch(brand, {
      uploading: true,
      uploadProgress: { done: 0, total: arr.length },
    });
    const uploaded = new Map(state[brand].uploadedFiles);
    let done = 0;
    for (const file of arr) {
      const path = `${brand.toLowerCase().replace(/\s+/g, "-")}/${file.name}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        uploaded.set(file.name.toLowerCase(), data.publicUrl);
      }
      done++;
      patch(brand, { uploadProgress: { done, total: arr.length }, uploadedFiles: new Map(uploaded) });
    }
    patch(brand, { uploading: false });
    toast({ title: `Uploaded ${uploaded.size} images for ${brand}` });
  }

  async function handleImport(brand: BrandTab) {
    const s = state[brand];
    if (!s.rows) return;
    const isMercana = brand === "Mercana";
    const records: any[] = [];
    const skipped: { name: string; reason: string }[] = [];

    for (const r of s.rows) {
      if (r.price == null) {
        skipped.push({ name: r.name, reason: "missing price" });
        continue;
      }
      let imageUrl: string | null = null;
      if (isMercana) {
        if (r.imageFilename) {
          imageUrl = s.uploadedFiles.get(r.imageFilename.toLowerCase()) ?? null;
        }
      } else {
        imageUrl = r.imageUrl;
      }

      records.push({
        name: r.name,
        brand,
        category: categorizeProduct(r.name),
        image_url: imageUrl,
        image_filename: r.imageFilename,
        price: r.price,
        msrp: r.msrp,
        units_available: r.unitsAvailable,
        source_last_updated: r.sourceLastUpdated
          ? new Date(r.sourceLastUpdated.replace(" ", "T")).toISOString()
          : null,
      });
    }

    // Merge in-batch duplicates by normalized (brand, name): sum units, prefer
    // a row with an image, keep the lower price and the higher MSRP.
    const merged = new Map<string, any>();
    for (const rec of records) {
      const key = productKey(rec.brand, rec.name);
      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, rec);
        continue;
      }
      existing.units_available = (existing.units_available ?? 0) + (rec.units_available ?? 0);
      if (!existing.image_url && rec.image_url) {
        existing.image_url = rec.image_url;
        existing.image_filename = rec.image_filename;
      }
      if (rec.price != null && (existing.price == null || rec.price < existing.price)) {
        existing.price = rec.price;
      }
      if (rec.msrp != null && (existing.msrp == null || rec.msrp > existing.msrp)) {
        existing.msrp = rec.msrp;
      }
      skipped.push({ name: rec.name, reason: "merged into existing duplicate in import batch" });
    }
    const deduped = Array.from(merged.values());

    patch(brand, {
      importing: true,
      importProgress: { done: 0, total: deduped.length },
      importReport: null,
    });

    const chunkSize = 100;
    let inserted = 0;
    for (let i = 0; i < deduped.length; i += chunkSize) {
      const chunk = deduped.slice(i, i + chunkSize);
      const { error } = await supabase
        .from("products")
        .upsert(chunk, { onConflict: "brand,name" });
      if (error) {
        chunk.forEach((c) => skipped.push({ name: c.name, reason: error.message }));
      } else {
        inserted += chunk.length;
      }
      patch(brand, { importProgress: { done: i + chunk.length, total: deduped.length } });
    }

    patch(brand, {
      importing: false,
      importReport: { ok: inserted, skipped },
    });
    toast({ title: `Imported ${inserted} ${brand} products`, description: `${skipped.length} skipped` });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Product Import</h1>
            <p className="text-muted-foreground">
              Import products from the Google Sheet. Mercana requires uploading images first.
            </p>
          </div>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Wipe Catalog</CardTitle>
              <CardDescription>
                Permanently deletes <strong>all</strong> products from the catalog. Pallets are
                not affected. Type <code className="font-mono">WIPE</code> to confirm.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Input
                placeholder="Type WIPE to confirm"
                value={wipeConfirm}
                onChange={(e) => setWipeConfirm(e.target.value)}
                className="max-w-xs"
                disabled={wiping}
              />
              <Button
                variant="destructive"
                onClick={wipeCatalog}
                disabled={wiping || wipeConfirm !== "WIPE"}
              >
                {wiping ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Delete all products
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle>Master CSV Import</CardTitle>
              <CardDescription>
                Single-file import with columns: Name, Brand, Image URL, Units Available,
                Our Cost, MSRP, Comeback Price, Pricing Rule, Our Margin $, Our Margin %.
                Categories are auto-derived from the product name. Comeback Price is the
                only price displayed to buyers. For <strong>Mercana</strong>, the Image
                column should be a filename — it's matched against the 777 images already
                in storage. For other brands, Image must be a direct URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="text-sm font-medium">1. Upload Master CSV</div>
                <Input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => e.target.files?.[0] && handleMasterCsvFile(e.target.files[0])}
                />
                {masterCsvName && (
                  <div className="text-xs text-muted-foreground">
                    {masterCsvName} — {masterRows?.length ?? 0} rows parsed
                  </div>
                )}
                {masterErrors.length > 0 && (
                  <ul className="text-sm text-destructive list-disc pl-5">
                    {masterErrors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                )}
              </div>

              {masterRows && masterRows.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">2. Import</div>
                  {(() => {
                    const byBrand = masterRows.reduce<Record<string, number>>((acc, r) => {
                      acc[r.brand] = (acc[r.brand] ?? 0) + 1;
                      return acc;
                    }, {});
                    const byCat = masterRows.reduce<Record<string, number>>((acc, r) => {
                      acc[r.category] = (acc[r.category] ?? 0) + 1;
                      return acc;
                    }, {});
                    const noPrice = masterRows.filter((r) => r.comebackPrice == null).length;
                    const nonMercanaBadUrl = masterRows.filter(
                      (r) =>
                        r.brand.trim().toLowerCase() !== "mercana" &&
                        r.imageUrl &&
                        !/^https?:\/\//i.test(r.imageUrl),
                    ).length;
                    const mercanaRows = masterRows.filter(
                      (r) => r.brand.trim().toLowerCase() === "mercana" && r.imageUrl,
                    );
                    const mercanaUnmatched = mercanaIndex
                      ? mercanaRows.filter((r) => !mercanaIndex.get(r.imageUrl!.toLowerCase())).length
                      : null;
                    return (
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div>By brand: {Object.entries(byBrand).map(([b, n]) => `${b} (${n})`).join(", ")}</div>
                        <div>By category: {Object.entries(byCat).map(([c, n]) => `${c} (${n})`).join(", ")}</div>
                        {mercanaRows.length > 0 && (
                          <div>
                            Mercana storage index: {mercanaIndex
                              ? `${mercanaIndex.size} files indexed`
                              : "not loaded yet (will load automatically on import)"}
                            {mercanaUnmatched != null && mercanaUnmatched > 0 && (
                              <span className="text-destructive"> — {mercanaUnmatched} row(s) reference a filename not in storage.</span>
                            )}
                          </div>
                        )}
                        {noPrice > 0 && <div className="text-amber-600">{noPrice} row(s) missing Comeback Price — will import with no price.</div>}
                        {nonMercanaBadUrl > 0 && <div className="text-destructive">{nonMercanaBadUrl} non-Mercana row(s) have an Image value that isn't a URL.</div>}
                      </div>
                    );
                  })()}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadMercanaIndex()}
                      disabled={mercanaIndexLoading}
                    >
                      {mercanaIndexLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      {mercanaIndex ? "Reload Mercana index" : "Load Mercana image index"}
                    </Button>
                  </div>
                  <Button onClick={importMaster} disabled={masterImporting}>
                    {masterImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Import {masterRows.length} products
                  </Button>
                  {masterImporting && (
                    <Progress value={(masterProgress.done / Math.max(1, masterProgress.total)) * 100} />
                  )}
                  {masterReport && (
                    <div className="text-sm">
                      <div className="text-primary">
                        <CheckCircle className="inline h-4 w-4 mr-1" />
                        Inserted/updated {masterReport.ok}
                      </div>
                      {masterReport.skipped.length > 0 && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-muted-foreground">
                            {masterReport.skipped.length} skipped
                          </summary>
                          <ul className="mt-2 max-h-48 overflow-y-auto text-xs">
                            {masterReport.skipped.map((s, i) => (
                              <li key={i}>{s.name} — {s.reason}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>

            <CardHeader>
              <CardTitle>Duplicate Scanner</CardTitle>
              <CardDescription>
                Finds products with the same brand + normalized name (ignores case, punctuation,
                and "(#N)" suffixes). Merge combines units, keeps the best image, lowest price,
                highest MSRP.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={scanDuplicates} disabled={dupScanning}>
                {dupScanning ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ShieldAlert className="h-4 w-4 mr-2" />
                )}
                Scan for duplicates
              </Button>
              {dupGroups && dupGroups.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  <CheckCircle className="inline h-4 w-4 text-primary mr-1" />
                  No duplicates found.
                </p>
              )}
              {dupGroups && dupGroups.length > 0 && (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {dupGroups.map((g) => (
                    <div key={g.key} className="border rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          {g.items[0].brand} — {normalizeProductName(g.items[0].name)}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => mergeGroup(g)}
                          disabled={dupBusy === g.key}
                        >
                          {dupBusy === g.key ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : null}
                          Merge ({g.items.length})
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {g.items.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center justify-between gap-2 text-xs border-t pt-1"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{it.name}</div>
                              <div className="text-muted-foreground">
                                {it.units_available} units · ${it.price ?? "—"} ·{" "}
                                {it.image_url ? "image ✓" : "no image"}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteDuplicate(g, it.id)}
                              disabled={dupBusy === g.key + it.id}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BrandTab)}>
            <TabsList className="grid grid-cols-4 w-full">
              {BRAND_TABS.map((b) => (
                <TabsTrigger key={b} value={b}>
                  {b}
                </TabsTrigger>
              ))}
            </TabsList>

            {BRAND_TABS.map((brand) => {
              const s = state[brand];
              const isMercana = brand === "Mercana";
              const matched = isMercana && s.rows
                ? s.rows.filter((r) => r.imageFilename && s.uploadedFiles.has(r.imageFilename.toLowerCase())).length
                : 0;
              return (
                <TabsContent key={brand} value={brand} className="space-y-4 mt-6">
                  {/* Step 1: Fetch */}
                  <Card>
                    <CardHeader>
                      <CardTitle>1. Load from Google Sheet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button onClick={() => handleFetch(brand)} disabled={s.loading}>
                        {s.loading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Fetch "{brand}" tab
                      </Button>
                      {s.error && <p className="text-destructive text-sm">{s.error}</p>}
                      {s.rows && (
                        <p className="text-sm text-muted-foreground">
                          Loaded <strong>{s.rows.length}</strong> rows.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Step 2: Mercana image upload */}
                  {isMercana && (
                    <Card>
                      <CardHeader>
                        <CardTitle>2. Upload Mercana images</CardTitle>
                        <CardDescription>
                          Filenames must match the "Image Filename" column (e.g. 0001_Product_Name.jpg).
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={s.uploading}
                          onChange={(e) => e.target.files && handleUpload(brand, e.target.files)}
                        />
                        {s.uploading && (
                          <div>
                            <Progress
                              value={(s.uploadProgress.done / Math.max(1, s.uploadProgress.total)) * 100}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Uploading {s.uploadProgress.done}/{s.uploadProgress.total}…
                            </p>
                          </div>
                        )}
                        {s.uploadedFiles.size > 0 && (
                          <p className="text-sm">
                            <CheckCircle className="inline h-4 w-4 text-primary mr-1" />
                            {s.uploadedFiles.size} files uploaded
                            {s.rows && (
                              <>
                                {" "}
                                — <strong>{matched}</strong> of <strong>{s.rows.length}</strong> sheet rows
                                matched
                              </>
                            )}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 3: Preview */}
                  {s.rows && (
                    <Card>
                      <CardHeader>
                        <CardTitle>{isMercana ? "3" : "2"}. Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" onClick={() => patch(brand, { preview: !s.preview })}>
                          <Eye className="h-4 w-4 mr-2" />
                          {s.preview ? "Hide" : "Show"} first 5
                        </Button>
                        {s.preview && (
                          <div className="mt-3 space-y-2 text-sm">
                            {s.rows.slice(0, 5).map((r, i) => (
                              <div key={i} className="border rounded p-2">
                                <div className="font-medium">{r.name}</div>
                                <div className="text-muted-foreground">
                                  Price ${r.price ?? "—"} · MSRP ${r.msrp ?? "—"} · Units {r.unitsAvailable}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {isMercana ? r.imageFilename : r.imageUrl}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 4: Import */}
                  {s.rows && (
                    <Card>
                      <CardHeader>
                        <CardTitle>{isMercana ? "4" : "3"}. Import</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          onClick={() => handleImport(brand)}
                          disabled={s.importing || (isMercana && s.uploadedFiles.size === 0)}
                        >
                          {s.importing ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Import all {s.rows.length} {brand} products
                        </Button>
                        {s.importing && (
                          <div>
                            <Progress
                              value={(s.importProgress.done / Math.max(1, s.importProgress.total)) * 100}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Importing {s.importProgress.done}/{s.importProgress.total}…
                            </p>
                          </div>
                        )}
                        {s.importReport && (
                          <div className="text-sm space-y-2">
                            <p>
                              <CheckCircle className="inline h-4 w-4 text-primary mr-1" />
                              <strong>{s.importReport.ok}</strong> imported successfully
                            </p>
                            {s.importReport.skipped.length > 0 && (
                              <details className="border rounded p-2">
                                <summary className="cursor-pointer">
                                  <XCircle className="inline h-4 w-4 text-destructive mr-1" />
                                  {s.importReport.skipped.length} skipped
                                </summary>
                                <div className="mt-2 max-h-64 overflow-y-auto space-y-1">
                                  {s.importReport.skipped.map((sk, i) => (
                                    <div key={i} className="text-xs">
                                      <span className="font-medium">{sk.name}</span> — {sk.reason}
                                    </div>
                                  ))}
                                </div>
                              </details>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
