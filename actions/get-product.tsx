import { Product } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product> => {
    try {
        const res = await fetch(`${URL}/${id}`, { cache: 'force-cache', next: { revalidate: 3600 } });
        return res.json();
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw new Error('Failed to fetch product');
    }
};

export default getProduct;