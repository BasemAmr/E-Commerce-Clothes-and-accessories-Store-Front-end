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
    const url = qs.stringifyUrl({
        url: URL,
        query: {
            categoryId: query.categoryId,
            isFeatured: query.isFeatured
        }
    });

    try {
        const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600 } });
        const data = await res.json();

        const filtered = data.filter((product: Product) => {
            if (query.colorId) {
                return product.colors.some((color) => color.id === query.colorId);
            }
            if (query.sizeId) {
                return product.sizes.some((size) => size.id === query.sizeId);
            }
            if (product.isArchived) {
                return false;
            }
            return product;
        });

        return filtered;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export default getProducts;