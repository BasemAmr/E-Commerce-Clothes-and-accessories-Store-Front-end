import qs from 'query-string';
import { Product } from '@/types/types';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    isFeatured?: boolean;
} 

const getProducts = async (query: Query): Promise<Product[]> => {
    // Construct the query URL
    const url = qs.stringifyUrl({
        url: URL,
        query: {
            categoryId: query.categoryId,
            colorId: query.colorId, // Include colorId in query
            sizeId: query.sizeId,   // Include sizeId in query
            isFeatured: query.isFeatured,
            isArchived: false,      // Ensure archived products are excluded
        },
    });

    try {
        // Fetch from the server with caching
        const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);

        // Parse and return response
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export default getProducts;
