/**
 * Search Utilities & Constants
 * 
 * Shared types, constants, and helper functions for Algolia InstantSearch integration.
 * 
 * Architecture:
 * - SearchConfig: Type definition for the secured API key response from CMS
 * - Algolia Record Schema: Defines what attributes are indexed and searchable
 * - Error handling: Common error messages and recovery strategies
 */

/**
 * Algolia Record Shape
 * This matches the data structure indexed in Algolia on the CMS side.
 * Keep this in sync with `lib/algolia.ts` toAlgoliaRecord() transformer.
 */
export interface AlgoliaProduct {
  objectID: string;
  storeId: string;
  name: string;
  price: number; // Stored in cents (e.g., 2999 = $29.99)
  category: string;
  categoryId: string;
  sizes: string[];
  colors: string[];
  images: string[]; // URLs (ImageKit)
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: number; // Unix timestamp in ms
}

/**
 * Algolia Search Configuration
 * Returned by CMS endpoint: GET /api/stores/[storeId]/search/key
 */
export interface SearchConfig {
  appId: string;
  searchKey: string;
  indexName: string;
}

/**
 * Algolia Index Settings
 * These should be applied once via Algolia dashboard or CLI.
 * Defines searchable attributes, facets, custom ranking, etc.
 */
export const ALGOLIA_INDEX_CONFIG = {
  indexName: 'products',
  searchableAttributes: ['name', 'category', 'colors', 'sizes'],
  attributesForFaceting: [
    'category',
    'sizes',
    'colors',
    'storeId',
    'isFeatured',
    'isArchived',
  ],
  customRanking: ['desc(isFeatured)', 'desc(createdAt)'],
  highlightPreTag: '<mark class="bg-yellow-100 font-bold">',
  highlightPostTag: '</mark>',
  hitsPerPage: 12,
  typoTolerance: 'min', // Typo tolerance: min (1 typo), strict (0 typos), or adaptive
} as const;

/**
 * Error Messages
 * User-friendly explanations for common search failures
 */
export const SEARCH_ERROR_MESSAGES = {
  MISSING_API_KEY: 'Search configuration is not available. Please refresh and try again.',
  FETCH_FAILED:
    'Unable to initialize search. Please check your connection and refresh.',
  NETWORK_ERROR:
    'A network error occurred while fetching search results. Please try again.',
  NOT_CONFIGURED:
    'Search has not been configured for this store. Please contact support.',
} as const;

/**
 * Format price for display
 * @param priceInCents Price from Algolia (stored in cents)
 * @returns Formatted price string
 */
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

/**
 * Extract store ID from API URL
 * @param apiUrl The NEXT_PUBLIC_API_URL environment variable
 * @returns Store ID or empty string if not found
 */
export function extractStoreIdFromUrl(apiUrl: string): string {
  const match = apiUrl.match(/stores\/([^/]+)/);
  return match ? match[1] : '';
}

/**
 * Log search events for analytics
 * Can be extended to send events to analytics service (Mixpanel, Segment, etc.)
 */
export function logSearchEvent(event: {
  type: 'search' | 'filter' | 'click' | 'error';
  storeId: string;
  query?: string;
  filter?: string;
  productId?: string;
  error?: string;
}): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[SEARCH_ANALYTICS]', event);
  }
  // TODO: Send to analytics service
  // analytics.track(event.type, { ...event });
}
