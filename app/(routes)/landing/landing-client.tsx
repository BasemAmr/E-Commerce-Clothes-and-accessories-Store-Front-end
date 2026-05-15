'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import liteClient from 'algoliasearch/lite';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import {
  SearchBox,
  Hits,
  Highlight,
  Configure,
  useInstantSearch,
} from 'react-instantsearch';
import type { Hit } from 'instantsearch.js';
import { useSearchConfig } from '@/hooks/use-search-config';

type AlgoliaHit = Hit<{
  objectID: string;
  name: string;
  price?: number;
  images?: string[];
  category?: string;
  [key: string]: unknown;
}>;

interface HitProps {
  hit: AlgoliaHit;
}

function formatPrice(price: number | undefined): string {
  if (typeof price !== 'number' || Number.isNaN(price)) {
    return '';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);
}

function MiniHit({ hit }: HitProps) {
  const price = formatPrice(hit.price);

  return (
    <a
      href={`/product/${hit.objectID}`}
      className="group relative flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 p-4 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:border-black/10 hover:bg-white"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {hit.images && hit.images.length > 0 ? (
          <Image
            src={hit.images[0]}
            alt={hit.name}
            width={64}
            height={64}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-slate-900">
          <Highlight
            attribute="name"
            hit={hit}
            classNames={{
              highlighted: 'bg-amber-200/60 font-semibold not-italic',
            }}
          />
        </h4>
        {hit.category && (
          <p className="mt-1 text-xs text-slate-500">{hit.category}</p>
        )}
      </div>

      {price ? (
        <span className="text-sm font-semibold text-slate-900">{price}</span>
      ) : null}
    </a>
  );
}

function EmptyState() {
  const { indexUiState, results } = useInstantSearch();
  const query = indexUiState.query ?? '';
  const hasResults = (results?.nbHits ?? 0) > 0;

  if (hasResults) return null;

  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-slate-900">
        {query ? `No results for "${query}"` : 'Start typing to explore the catalog'}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Try style names, colors, or materials to see instant filtering in action.
      </p>
    </div>
  );
}

export function LandingSearchDemo() {
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

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="h-12 rounded-2xl bg-slate-100/80" />
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100/70" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !searchClient || !config) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <p className="text-sm font-semibold">Instant search is unavailable.</p>
        <p className="mt-2 text-sm">
          {error?.message || 'Unable to initialize search right now.'}
        </p>
      </div>
    );
  }

  return (
    <InstantSearchNext
      searchClient={searchClient}
      indexName={config.indexName}
      routing={false}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={6} />

      <div className="grid gap-5">
        <SearchBox
          classNames={{
            root: 'ais-SearchBox',
            form: 'relative',
            input:
              'w-full rounded-2xl border border-slate-200 bg-white/90 px-12 py-3 text-base text-slate-900 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.4)] placeholder:text-slate-400 focus:border-slate-900 focus:outline-none',
            submit:
              'absolute left-4 top-1/2 -translate-y-1/2 text-slate-400',
            reset:
              'absolute right-4 top-1/2 -translate-y-1/2 text-slate-400',
          }}
          submitIconComponent={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
          placeholder="Search for denim, linen, or oversized"
        />

        <div className="grid gap-3">
          <EmptyState />
          <Hits
            hitComponent={MiniHit}
            classNames={{
              list: 'grid gap-3',
              item: 'ais-Hits-item',
              emptyRoot: 'hidden',
            }}
          />
        </div>
      </div>
    </InstantSearchNext>
  );
}
