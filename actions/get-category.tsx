import { Category } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategory = async (id: string): Promise<Category> => {
    try {
        const res = await fetch(`${URL}/${id}`, { cache: 'force-cache', next: { revalidate: 3600 } });
        return res.json();
    } catch (error) {
        console.error(`Error fetching category ${id}:`, error);
        throw new Error('Failed to fetch category');
    }
};

export default getCategory;