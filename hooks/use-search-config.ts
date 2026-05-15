import { useEffect, useState } from 'react';

export interface SearchConfig {
  appId: string;
  searchKey: string;
  indexName: string;
}

interface UseSearchConfigOptions {
  enabled?: boolean;
}

/**
 * Fetch the secured Algolia API key scoped to this store.
 * 
 * The CMS backend generates this key server-side, embedding the storeId filter
 * so the client cannot search products from other stores. This is called once
 * on mount and cached for 30 minutes.
 * 
 * @param storeId - The current store ID from URL params
 * @returns { data, isLoading, error }
 */
export function useSearchConfig(
  storeId: string,
  options: UseSearchConfigOptions = { enabled: true }
) {
  const [data, setData] = useState<SearchConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!options.enabled || !storeId) {
      setIsLoading(false);
      return;
    }

    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cmsUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!cmsUrl) {
          throw new Error('NEXT_PUBLIC_API_URL not configured');
        }

        // The CMS backend endpoint verifies store ownership via Clerk auth
        // and returns a secured API key that only searches this store's products
        const response = await fetch(
          `${cmsUrl}/search/key`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch search config: ${response.status} ${response.statusText}`
          );
        }

        const config: SearchConfig = await response.json();
        setData(config);
        
        // Log success for debugging
        console.debug('[SEARCH_CONFIG] Secured API key fetched for store:', storeId);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('[SEARCH_CONFIG_ERROR]', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [storeId, options.enabled]);

  return { data, isLoading, error };
}
