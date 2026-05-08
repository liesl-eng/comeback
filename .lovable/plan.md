# Product Import System — Plan

Before I write code, here's the proposed architecture. Confirm or adjust and I'll implement step by step.

---

## Step 1 — Wipe existing products

The current "products" in your DB live in the `pallet_items` table (used by the Pallet flow). The Rug Program data lives in a Google Sheet (no DB rows). Catalog brand data (Arhaus, Hatch, etc.) is in static CSV files under `src/data/`.

**Before deleting anything**, I will:
1. Run a `SELECT COUNT(*), pallet_id` summary on `pallet_items` and show you the breakdown.
2. Wait for your explicit "yes, delete" before running `DELETE FROM pallet_items` (and optionally `pallets`).

Question: do you also want me to remove the static brand CSV files in `src/data/` (arhaus.csv, mercana.csv, modus_furniture.csv, etc.) and the components that read them? Those drive the current public catalog.

---

## Step 2 — New database schema

A clean `products` table (separate from `pallet_items`, which is a different B2B flow):

```
products
  id              uuid pk
  name            text
  brand           text          -- "Mercana" | "Modus Furniture" | "Arteriors Home" | "Ferm Living"
  image_url       text          -- public URL (Supabase Storage for Mercana, source URL for others)
  image_filename  text          -- Mercana only, e.g. "0001_Product_Name.jpg"
  price           numeric       -- cleaned from "$ XX.XX each"
  msrp            numeric       -- cleaned from "$X,XXX"
  units_available integer
  source_last_updated timestamptz   -- from sheet
  created_at      timestamptz default now()
  updated_at      timestamptz default now()

  unique (brand, name)          -- so re-imports upsert instead of duplicating
```

Indexes on `brand` and `units_available > 0`. RLS:
- Public `SELECT` (catalog is public).
- `INSERT/UPDATE/DELETE` restricted to `admin` role (reuses your existing `has_role` function).

Plus a Supabase Storage bucket `product-images` (public read, admin write) to host the 756 Mercana images.

---

## Step 3 — Two image approaches

| Brand | Source | How it lands in `image_url` |
|---|---|---|
| Mercana | Local files matched by `Image Filename` column | Admin uploads files → stored in `product-images/mercana/<filename>` → public URL written to `products.image_url` |
| Modus, Arteriors, Ferm Living | `Image URL` column from sheet | Copied as-is into `products.image_url` |

Mercana matching: filename in the sheet must exactly equal the uploaded file name (case-insensitive). Unmatched rows = skipped with a warning in the import report.

---

## Step 4 — Admin interface (`/admin/products`)

Gated behind the existing `admin` role check (same pattern as `/admin/import`). Layout:

```
[Tab selector: Mercana | Modus Furniture | Arteriors Home | Ferm Living]

Per tab:
  ┌─────────────────────────────────────────────┐
  │ 1. Fetch from Google Sheet  [Load Sheet]    │
  │    → shows row count, last-updated info     │
  ├─────────────────────────────────────────────┤
  │ 2. (Mercana only) Upload images             │
  │    [Drag-and-drop 756 files here]           │
  │    → progress bar, X/756 uploaded           │
  │    → match report: 740 matched, 16 missing  │
  ├─────────────────────────────────────────────┤
  │ 3. Preview first 5 products  [Preview]      │
  │    → table with cleaned values + image      │
  ├─────────────────────────────────────────────┤
  │ 4. Import all  [Import 756 products]        │
  │    → progress: "Importing 234/756..."       │
  │    → final report: 740 ok, 16 skipped (csv) │
  └─────────────────────────────────────────────┘
```

**Google Sheet access**: the sheet must be shared as "Anyone with the link → Viewer" so we can fetch each tab as CSV via `gviz/tq?tqx=out:csv&sheet=<TabName>`. No OAuth needed. If you'd rather keep the sheet private, we'd use the Google Sheets connector instead — let me know.

**Data cleaning** (all client-side before insert):
- `price`: regex strip `$`, commas, `each`, spaces → `parseFloat`
- `msrp`: same
- `units_available`: `parseInt`, default `0`
- `"N/A"` / empty → `null` (or `0` for units)
- Rows missing name or price → skipped, listed in error report

**Import call**: chunked upserts of 100 rows via `supabase.from('products').upsert(..., { onConflict: 'brand,name' })`.

---

## Step 5 — Public product display

A new `/catalog` (or replace `/products`) page:
- Grid of cards: image, name, brand, price, MSRP (strikethrough) + savings %, units badge ("In Stock" / "Low Stock <10" / "Out of Stock").
- Brand filter chips at top (All / Mercana / Modus / Arteriors / Ferm Living).
- Sorted: in-stock first, then by brand.

Question: should this **replace** the current `/products` catalog (which reads the static CSVs), or live alongside it at a new route?

---

## Open questions before I build

1. **Delete scope** — wipe `pallet_items` only, or also remove the static brand CSVs + their UI?
2. **Sheet sharing** — is the sheet public (anyone-with-link viewer)? If not, do you want me to set up the Google Sheets connector?
3. **Catalog replacement** — does the new `/catalog` replace the existing `/products` page, or sit alongside it?

Once you answer these (and approve the plan), I'll execute in this order: migration → storage bucket → admin import page → public catalog page → wire-up & QA.
