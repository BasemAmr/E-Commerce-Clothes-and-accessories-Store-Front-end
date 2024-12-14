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

    const res = await (await fetch(url)).json();

    const filtered = res.filter((product: Product) => {
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
    }
    );

    return filtered;
}

export default getProducts;