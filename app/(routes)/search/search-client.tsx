'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import liteClient from 'algoliasearch/lite';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import {
  SearchBox,
  Hits,
  RefinementList,
  Configure,
  Pagination,
  Highlight,
  useInstantSearch,
} from 'react-instantsearch';
import { useSearchConfig } from '@/hooks/use-search-config';

// ─── Types ─────────────────────────────────────────────────────────────────

interface AlgoliaHit {
  objectID: string;
  name: string;
  /**
   * IMPORTANT: Verify what unit your CMS stores prices in.
   *
   * Option A — price stored in CENTS (e.g., 2999 = $29.99):
   *   Display: `(hit.price / 100).toFixed(2)` ← current code, correct for cents
   *
   * Option B — price stored in DOLLARS (e.g., 29.99):
   *   Display: `hit.price.toFixed(2)` ← use this if Prisma stores dollars
   *
   * Your toAlgoliaRecord() passes `price: product.price` directly from Prisma
   * (which declares `price Float`). If your seed data uses values like 29.99,
   * you are in Option B and the current divide-by-100 makes every price $0.30.
   *
   * Check your actual DB values and update formatPrice() below accordingly.
   */
  price: number;
  __position: number;
  images?: string[];
  category?: string;
  colors?: string[];
  sizes?: string[];
  [key: string]: unknown;
}

interface HitProps {
  hit: AlgoliaHit;
}

// ─── Price formatting ───────────────────────────────────────────────────────

/**
 * Adjust this function based on how your CMS stores price.
 * If Prisma `price Float` = dollars (e.g. 29.99) → remove the /100.
 * If Prisma `price Float` = cents (e.g. 2999.0)  → keep the /100.
 */
function formatPrice(price: number): string {
  // TODO: Confirm your price unit. Remove /100 if prices are stored as dollars.
  return `$${(price / 100).toFixed(2)}`;
}

// ─── Hit Component ──────────────────────────────────────────────────────────

function Hit({ hit }: HitProps) {
  return (
    <a
      href={`/product/${hit.objectID}`}
      className="group block rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 bg-white"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        {hit.images && hit.images.length > 0 ? (
          <Image
            src={hit.images[0]} fill sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            alt={hit.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 leading-snug">
          <Highlight
            attribute="name"
            hit={hit}
            classNames={{
              highlighted: 'bg-yellow-100 font-semibold not-italic',
            }}
          />
        </h3>

        {hit.category && (
          <p className="text-xs text-gray-400 mb-2">{hit.category}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(hit.price)}
          </span>

          {/* Color swatches (first 3) */}
          {hit.colors && hit.colors.length > 0 && (
            <div className="flex gap-1">
              {hit.colors.slice(0, 3).map((color: string, idx: number) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                >
                  {color}
                </span>
              ))}
              {hit.colors.length > 3 && (
                <span className="text-xs text-gray-400">+{hit.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Sizes */}
        {hit.sizes && hit.sizes.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-2">
            {hit.sizes.slice(0, 4).map((size: string, idx: number) => (
              <span
                key={idx}
                className="text-xs border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded"
              >
                {size}
              </span>
            ))}
            {hit.sizes.length > 4 && (
              <span className="text-xs text-gray-400 self-center">+{hit.sizes.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}

// ─── No Results State ────────────────────────────────────────────────────────

/**
 * Shows a contextual empty state.
 * - Empty query  → "Start typing to search"
 * - Query + 0 hits → "No results for 'X'" with suggestions
 *
 * Uses useInstantSearch() to read the current query and status without prop-drilling.
 */
function EmptyState() {
  const { indexUiState, results } = useInstantSearch();
  const query = indexUiState.query ?? '';
  const hasResults = (results?.nbHits ?? 0) > 0;

  // Don't render if there are results (Hits renders those)
  if (hasResults) return null;

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Search our catalog</h3>
        <p className="text-gray-500 text-sm">Type a product name, category, color, or size</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No results for &ldquo;{query}&rdquo;
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Try different keywords, check your spelling, or browse by category
      </p>
    </div>
  );
}

// ─── Sidebar Filter Section ──────────────────────────────────────────────────

function FilterSection({ title, attribute }: { title: string; attribute: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
        {title}
      </h3>
      <RefinementList
        attribute={attribute}
        classNames={{
          root: 'ais-RefinementList',
          list: 'space-y-1.5',
          item: 'flex items-center',
          checkbox: 'w-4 h-4 rounded cursor-pointer accent-black',
          label: 'text-sm text-gray-700 ml-2 cursor-pointer flex-1',
          count: 'ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full',
          selectedItem: 'font-medium',
        }}
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

/**
 * Search Page Client Component — renders InstantSearch
 *
 * Architecture:
 * 1. Fetch secured API key from CMS (/api/stores/[storeId]/search/key)
 * 2. Initialize Algolia client with secured key (embeds storeId + isArchived filters)
 * 3. Mount InstantSearchNext with URL routing (query, filters sync to URL)
 *
 * CRITICAL NOTE ON ZERO HITS:
 * The secured key embeds `storeId:X AND isArchived:false`. Algolia CANNOT filter
 * on attributes that are missing from a record. If your indexed records don't have
 * the `storeId` field, ALL records are excluded and you get 0 hits.
 *
 * RUN: `npx ts-node scripts/reindex-all-products.ts` to re-sync your data.
 *
 * DO NOT add filters in <Configure>: the secured key already applies them at the
 * cryptographic level. Double-filtering against stale data = 0 hits.
 */
export function SearchPageClient() {
  const storeId = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_API_URL || '';
    const match = url.match(/stores\/([^/]+)/);
    return match ? match[1] : '';
  }, []);

  const { data: config, isLoading, error } = useSearchConfig(storeId);

  const searchClient = useMemo(() => {
    if (!config?.appId || !config?.searchKey) return null;
    return liteClient(config.appId, config.searchKey);
  }, [config?.appId, config?.searchKey]);

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-gray-100 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 bg-gray-100 rounded" />
            ))}
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (error || !searchClient || !config) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="text-base font-semibold text-red-900 mb-2">Search Unavailable</h3>
        <p className="text-sm text-red-700 mb-4">
          {error?.message || 'Unable to initialize search. Please try again later.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <InstantSearchNext
      searchClient={searchClient}
      indexName={config.indexName}
      routing={true}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      {/*
        hitsPerPage only. Do NOT add storeId/isArchived filters here —
        the secured API key already embeds them. Adding them again creates
        double-filtering that returns 0 hits if attributes are ever missing.
      */}
      <Configure hitsPerPage={12} />

      {/* ── Main search box (shown at top, always visible) ── */}
      <div className="mb-8">
        <SearchBox
          classNames={{
            root: 'ais-SearchBox',
            form: 'relative',
            input:
              'w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-white placeholder:text-gray-400',
            submit:
              'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600',
            reset:
              'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600',
            loadingIndicator: 'hidden',
          }}
          submitIconComponent={() => (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          placeholder="Search by name, category, color, or size..."
          autoFocus
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* ── Sidebar filters ── */}
        <aside className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-20 p-4 rounded-xl border border-gray-100 bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Filter
            </h2>

            <FilterSection title="Category" attribute="category" />
            <FilterSection title="Size"     attribute="sizes" />
            <FilterSection title="Color"    attribute="colors" />

            {/*
              NOTE: There is NO sidebar SearchBox here.
              Previously there were two SearchBoxes rendered simultaneously on desktop,
              which looked broken. The main search box above handles all screen sizes.
              If you need mobile-only filter access, implement a slide-out drawer instead.
            */}
          </div>
        </aside>

        {/* ── Results ── */}
        <main className="lg:col-span-3">
          {/* Empty state — shown when query returns 0 hits */}
          <EmptyState />

          {/* Results grid */}
          <Hits
            hitComponent={Hit}
            classNames={{
              root: 'ais-Hits',
              list: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
              item: 'ais-Hits-item',
              emptyRoot: 'hidden', // EmptyState component handles this instead
            }}
          />

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <Pagination
              classNames={{
                root: 'flex gap-1',
                item: 'rounded-lg text-sm transition-colors',
                link: 'flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg hover:bg-gray-50',
                selectedItem: '[&>a]:bg-black [&>a]:text-white [&>a]:border-black',
                disabledItem: 'opacity-40 pointer-events-none',
              }}
            />
          </div>
        </main>
      </div>
    </InstantSearchNext>
  );
}
