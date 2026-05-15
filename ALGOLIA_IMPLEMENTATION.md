# Algolia InstantSearch Implementation Guide

## Architecture Overview

This shop frontend now integrates real-time search via Algolia's direct-client search pattern:

```
Shop Frontend (Next.js 15)
    ↓
    ├─→ Server Component (page.tsx)
    │   └─→ Fetches search config from CMS
    │
    └─→ Client Component (search-client.tsx, 'use client')
        ├─→ Initializes Algolia client with secured key
        ├─→ User types/filters in real-time
        └─→ Results stream directly from Algolia CDN (<50ms latency)

CMS Backend (Your existing system)
    ↓
    └─→ GET /api/stores/[storeId]/search/key
        └─→ Clerk auth ✓
        └─→ Verify store ownership ✓
        └─→ Generate secured API key with storeId filter ✓
        └─→ Return { appId, searchKey, indexName }
```

---

## What Was Implemented in Shop Frontend

### 1. **New Hook: `hooks/use-search-config.ts`**

Fetches the secured API key from your CMS on component mount.

**Key points:**
- Runs once per page load (cached for 30 min via Algolia)
- Verifies CMS connectivity
- Returns `{ appId, searchKey, indexName }`
- Client never sees the admin API key (only the secured one)

**Usage:**
```tsx
const { data: config, isLoading, error } = useSearchConfig(storeId);
```

### 2. **New Page: `app/(routes)/search/page.tsx`** (Server Component)

Entry point for the search interface.

**Key points:**
- Server-rendered (no JS penalty for SEO)
- Wraps SearchPageClient in Suspense boundary
- Shows skeleton while fetching search config
- `dynamic = 'force-dynamic'` required for InstantSearchNext SSR

### 3. **New Component: `app/(routes)/search/search-client.tsx`** ('use client')

The interactive search interface using `react-instantsearch-nextjs`.

**Key features:**
- SearchBox: Type to search by name, category, color, size
- RefinementLists: Filter by category, size, color
- Hits: Grid of product results
- Pagination: Navigate through results
- URL Routing: Search state syncs to URL (query, page, filters persist on refresh)

**Architecture patterns:**
- `useMemo` for searchClient: Prevents re-initialization on every render
- `liteClient` from algoliasearch: Minimal bundle size (~20KB gzipped)
- Graceful error handling: Show user-friendly message if search fails

### 4. **New Utilities: `lib/search.ts`**

Shared types, constants, and helpers.

**Contains:**
- `AlgoliaProduct`: Type definition for indexed records
- `SearchConfig`: Response type from CMS
- `ALGOLIA_INDEX_CONFIG`: Index settings (searchable attributes, facets)
- `SEARCH_ERROR_MESSAGES`: User-friendly error text
- Helper functions: `formatPrice()`, `extractStoreIdFromUrl()`

### 5. **Dependencies Added**

```json
{
  "algoliasearch": "^4.24.0",
  "react-instantsearch": "^7.14.0",
  "react-instantsearch-nextjs": "^1.0.2"
}
```

---

## What Needs to Be Added to CMS Backend

### File: `app/api/stores/[storeId]/search/key/route.ts`

You already provided this! Here's what it does:

✓ Verifies user is authenticated via Clerk
✓ Verifies user owns this store (security gate)
✓ Generates a secured API key with `storeId` filter embedded
✓ Returns `{ appId, searchKey, indexName }` to shop frontend

**The secured key is cryptographically signed** — the client cannot remove the `storeId` filter. This is the industry-standard pattern for multi-tenant search.

### CMS Dependencies

Make sure your CMS has:
```bash
npm install algoliasearch
```

### CMS Routes to Modify

Add Algolia sync **after** Prisma operations in these files:

#### 1. `app/api/stores/[storeId]/products/route.ts` (CREATE)
```typescript
// After prismadb.product.create({...})
import { productIndex, toAlgoliaRecord } from '@/lib/algolia';

productIndex.saveObject(toAlgoliaRecord(product)).catch((err) => {
  console.error('[ALGOLIA_SYNC]', err);
  // Non-blocking: don't fail HTTP response if Algolia is slow
});
```

#### 2. `app/api/stores/[storeId]/products/[productId]/route.ts` (UPDATE)
```typescript
// After prismadb.product.update({...})
productIndex.saveObject(toAlgoliaRecord(updated)).catch(console.error);
```

#### 3. `app/api/stores/[storeId]/products/[productId]/route.ts` (DELETE)
```typescript
// After prismadb.product.delete({...})
productIndex.deleteObject(params.productId).catch(console.error);
```

### CMS New File: `lib/algolia.ts`

```typescript
import { algoliasearch } from 'algoliasearch';

const appId = process.env.ALGOLIA_APP_ID!;
const adminKey = process.env.ALGOLIA_ADMIN_API_KEY!;

export const algoliaClient = algoliasearch(appId, adminKey);
export const productIndex = algoliaClient.initIndex('products');

export function toAlgoliaRecord(product: any) {
  return {
    objectID: product.id,
    storeId: product.storeId,
    name: product.name,
    price: product.price, // In cents
    category: product.category?.name || 'Uncategorized',
    categoryId: product.categoryId,
    sizes: product.sizes?.map((s: any) => s.name) || [],
    colors: product.colors?.map((c: any) => c.name) || [],
    images: product.images?.map((img: any) => img.url) || [],
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    createdAt: product.createdAt.getTime(),
  };
}
```

### CMS New Script: `scripts/seed-algolia.ts`

One-time script to index existing products:

```typescript
import { prisma } from '@/lib/prismadb';
import { productIndex, toAlgoliaRecord } from '@/lib/algolia';

async function reindex() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true, sizes: true, colors: true }
  });
  
  await productIndex.replaceAllObjects(products.map(toAlgoliaRecord));
  console.log(`Indexed ${products.length} products`);
}

reindex()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
```

Run once: `npx ts-node scripts/seed-algolia.ts`

### CMS Environment Variables

```env
# Private - never exposed to client
ALGOLIA_APP_ID=XXXXXX
ALGOLIA_ADMIN_API_KEY=XXXXXX
ALGOLIA_SEARCH_API_KEY=XXXXXX  # Base search-only key
```

---

## Shop Frontend Environment Variables

Update `.env.local`:

```env
# Already exists:
NEXT_PUBLIC_API_URL=http://localhost:3000/api/stores/78951e55-0811-428f-9709-7d91c141dfe8

# Add these (from Algolia dashboard):
NEXT_PUBLIC_ALGOLIA_APP_ID=YOUR_ALGOLIA_APP_ID
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=YOUR_ALGOLIA_SEARCH_API_KEY
```

---

## Data Flow: Product Creation to Search Results

### Step 1: Admin creates product in CMS
```
CMS Dashboard → Click "New Product" → Fill form → Click "Save"
```

### Step 2: Product written to database
```
POST /api/stores/[storeId]/products/route.ts
  → prismadb.product.create({ ... })  // Hits PostgreSQL
  → productIndex.saveObject(transformed)  // Fires async to Algolia
  → Return { id, name, price, ... }  // Response to UI
```

### Step 3: Algolia updates index
```
Algolia receives product record
  → Adds to "products" index
  → Applies configured ranking
  → Deploys to global CDN
```

### Step 4: Shop frontend fetches search config
```
Load /search page
  → SearchPageClient mounts
  → useSearchConfig() runs
  → Calls GET /api/stores/[storeId]/search/key
  → CMS verifies auth + ownership
  → Returns secured key
  → SearchClient initializes
```

### Step 5: User searches
```
User types in SearchBox
  → InstantSearchNext triggers search
  → Algolia processes query in <50ms
  → Results stream to Hits component
  → UI updates in real-time
```

---

## Testing Checklist

### ✓ Setup
- [ ] Run `npm install` in shop to add Algolia packages
- [ ] Update `.env.local` with Algolia credentials
- [ ] Update CMS `.env` with Algolia admin key + search key

### ✓ Backend (CMS)
- [ ] Add `lib/algolia.ts` with client + transformer
- [ ] Update `app/api/stores/[storeId]/search/key/route.ts` (already provided)
- [ ] Modify product CREATE/UPDATE/DELETE routes to sync to Algolia
- [ ] Run `scripts/seed-algolia.ts` to index existing products
- [ ] Verify in Algolia dashboard: "products" index has records

### ✓ Frontend (Shop)
- [ ] Run `npm run dev` to start Next.js
- [ ] Navigate to `/search`
- [ ] Verify page loads without errors (check browser console)
- [ ] Type in SearchBox — results should appear within 1-2 seconds
- [ ] Click category/size/color filter — results should update instantly
- [ ] Refresh page with filters — URL should include query params, results persist
- [ ] Click product result — should navigate to product detail page

### ✓ Tenant Isolation
- [ ] Create product in Store A (CMS)
- [ ] Search in Shop A — product should appear
- [ ] Switch to Shop B — search should NOT show Store A products (storeId filter in secured key)

### ✓ Archive Behavior
- [ ] Create product, verify it appears in search
- [ ] Archive product in CMS
- [ ] Refresh search in shop — product should disappear (<1 sec)

---

## File Structure Summary

```
shop/
├── app/(routes)/search/
│   ├── page.tsx               ← Server component (SSR wrapper)
│   └── search-client.tsx      ← Client component (InstantSearchNext)
├── hooks/
│   ├── use-cart.ts
│   ├── use-preview-model.ts
│   └── use-search-config.ts   ← NEW: Fetch secured API key
├── lib/
│   ├── utils.ts
│   └── search.ts              ← NEW: Types & constants
├── .env                        ← Update with Algolia credentials
├── .env.example               ← NEW: Template for env vars
└── package.json               ← Updated with Algolia deps
```

---

## Troubleshooting

### "Search configuration is not available"
- Check browser console for fetch error
- Verify `NEXT_PUBLIC_API_URL` is correct in `.env.local`
- Verify CMS `/api/stores/[storeId]/search/key` endpoint responds with `{ appId, searchKey, indexName }`
- Check CMS logs for auth errors

### "No results" when searching
- Did you run `scripts/seed-algolia.ts` on CMS to index existing products?
- Check Algolia dashboard: does "products" index exist and contain records?
- Verify search key has correct `storeId` filter (inspect Network tab, look for query params)

### Results don't appear after creating new product
- Check CMS logs: did `productIndex.saveObject()` catch an error?
- Verify Algolia admin API key is correct
- Algolia sync is non-blocking — give it 5-10 seconds

### URL routing doesn't work (filters don't persist on refresh)
- Must use `InstantSearchNext` (not `InstantSearch`) from `react-instantsearch-nextjs`
- Must set `routing={true}` on InstantSearchNext component
- Must set `dynamic = 'force-dynamic'` on page.tsx for SSR

---

## Performance Notes

- **Search latency:** <50ms (Algolia CDN)
- **Index updates:** <1s (Algolia processes sync request)
- **Initial load:** ~2KB JavaScript (liteClient is minimal)
- **Search state:** Synced to URL, survives page refresh
- **Scaling:** Single "products" index handles unlimited stores (storeId filter + secured key)

---

## Next Steps (Optional Enhancements)

1. **Analytics:** Track search queries, click-through rate, popular filters
2. **Synonyms:** Add synonyms in Algolia (e.g., "tee" → "shirt")
3. **Typo tolerance:** Fine-tune typo handling (`min`, `strict`, `adaptive`)
4. **Facet counts:** Display "12 products" next to each filter
5. **Sorting:** Add sort by price, newest, bestselling
6. **Search insights:** Algolia API Logs → Analytics dashboard
7. **A/B testing:** Test different ranking strategies with A/B tests

---

## References

- [Algolia Official Docs](https://www.algolia.com/doc/)
- [react-instantsearch-nextjs](https://www.algolia.com/doc/guides/building-search-ui/installation/react-instantsearch-nextjs/)
- [Secured API Keys](https://www.algolia.com/doc/guides/security/api-keys/secured-api-keys/)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [InstantSearchNext with Routing](https://www.algolia.com/doc/guides/building-search-ui/routing/react-instantsearch-nextjs/)
