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

export default function AdminProducts() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<BrandTab>("Mercana");
  const [state, setState] = useState<Record<BrandTab, BrandState>>(() => {
    const init: Record<string, BrandState> = {};
    BRAND_TABS.forEach((b) => (init[b] = { ...emptyState, uploadedFiles: new Map() }));
    return init as Record<BrandTab, BrandState>;
  });

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
