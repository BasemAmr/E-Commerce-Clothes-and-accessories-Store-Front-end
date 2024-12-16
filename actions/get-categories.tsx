import { Category } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async (): Promise<Category[]> => {
    const res = await fetch(URL, { cache: 'force-cache', next: { revalidate: 3600 } });

    return res.json();
}

export default getCategories;