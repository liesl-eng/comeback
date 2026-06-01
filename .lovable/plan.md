## Goal

Daily sync no longer touches the live `products` table directly. Instead it writes each brand's fetched rows into a **staging area**, computes a **diff vs. live**, and waits for you to approve or reject per brand in the admin. Approved brands get a `replace=true` apply (delete + insert) into `products`. The homepage "Restocking" section keeps reading from `products` and stays live the entire time.

## Flow

```text
Google Sheet  →  edge fn (staging mode)  →  product_import_runs + product_import_staging
                                                      │
                                       Admin /admin/imports reviews diff
                                                      │
                                  approve brand → apply edge fn → products (live)
                                  reject brand  → run discarded, products untouched
```

## Database (one migration)

- `product_import_runs` — one row per cron invocation per brand. Fields: `id`, `brand`, `started_at`, `finished_at`, `status` (`pending_review` | `approved` | `rejected` | `applied` | `failed`), `fetched_count`, `new_count`, `changed_count`, `removed_count`, `unchanged_count`, `error_message`.
- `product_import_staging` — one row per fetched product within a run. Fields mirror `products` (`name`, `brand`, `category`, `image_url`, `image_filename`, `price`, `msrp`, `units_available`, `source_last_updated`) plus `run_id` and `diff_type` (`new` | `changed` | `removed` | `unchanged`).
- RLS: read + write restricted to `has_role(auth.uid(), 'admin')`. Grants for `authenticated` + `service_role`. No `anon`.

## Edge functions

**`sync-products-from-sheet` (modify):**
- Drop the direct upsert to `products`.
- For each brand: fetch sheet → create a `product_import_runs` row (`pending_review`) → insert staging rows → compute diff against current live `products` for that brand (match by normalized name) and stamp `diff_type` + counts. `removed` = live rows whose names aren't in the new sheet.
- Returns a summary with run IDs.

**`apply-product-import` (new):**
- Input: `{ run_id }`. Admin-auth required (validate JWT + `has_role` admin).
- Verifies run is `pending_review` or `approved`. Wipes `products` for that brand, inserts staging rows except those marked `removed`, sets run to `applied`. On error → `failed`, products untouched.

**Cron:** keep `0 18 * * *` but call the sync function **without** `?replace=true` (since it now only stages). The replace-true behavior moves into the apply step.

## Admin UI

New route `/admin/imports` (admin-gated):
- List of recent runs grouped by date, with per-brand status pills and counts (`+12 new / 4 changed / 2 removed`).
- Click a run → diff table: rows grouped by `diff_type`, showing name, price, units, image thumbnail; for `changed` show old vs. new side-by-side.
- Per-run actions: **Approve & apply**, **Reject**. Bulk "Approve all pending" at top.
- Add a small "Imports pending review: N" badge to the existing admin landing page so you notice runs.

## Files

- `supabase/migrations/<ts>_product_import_staging.sql` — tables, RLS, grants, indexes on `(brand, status)` and `(run_id)`.
- `supabase/functions/sync-products-from-sheet/index.ts` — rewrite write path to staging + diff.
- `supabase/functions/apply-product-import/index.ts` — new.
- Cron update via insert tool: drop `?replace=true` from the URL.
- `src/pages/AdminImports.tsx` — new review UI.
- `src/App.tsx` — register `/admin/imports` route (ProtectedRoute + admin check).
- `src/pages/AdminProducts.tsx` (or admin landing) — add pending-runs badge + link.

## Out of scope

- Homepage "Restocking" section and all buyer-facing pages — untouched, keep reading live `products`.
- Mercana flow — still admin-upload only, not part of staging.
- Manual one-off fetches from the existing admin Fetch UI — leave as-is (still write straight to live) unless you want those gated too.
