import { Suspense } from 'react';
import { SearchPageClient } from './search-client';
import Container from '@/components/ui/container';

/**
 * Search Page — Server Component
 * 
 * This is a Next.js 15 Server Component that wraps the InstantSearch client.
 * 
 * Why server component?
 * - No JS penalty for SSR (search is lazy-loaded via Suspense)
 * - Fetch security once per page load, not per widget
 * - SEO-friendly metadata can be added here
 */

export default function SearchPage() {
  return (
    <div className="bg-white">
      <Container>
        <div className="py-16 sm:py-24">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Search Products
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          {/* 
            Suspense boundary: While fetching the secured API key, show a skeleton.
            Once the key arrives, InstantSearchNext mounts and starts searching.
          */}
          <Suspense
            fallback={
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
                  </div>
                  <div className="lg:col-span-3">
                    <div className="h-10 bg-gray-100 rounded animate-pulse mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-64 bg-gray-100 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            <SearchPageClient />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
