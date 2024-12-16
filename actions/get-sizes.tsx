import { Size } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`;

const getSizes = async (): Promise<Size[]> => {
    try {
        const res = await fetch(URL, { cache: 'force-cache', next: { revalidate: 3600 } });
        return res.json();
    } catch (error) {
        console.error('Error fetching sizes:', error);
        return [];
    }
};

export default getSizes;