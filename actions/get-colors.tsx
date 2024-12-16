import { Color } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colors`;

const getColors = async (): Promise<Color[]> => {
    try {
        const res = await fetch(URL, { cache: 'force-cache', next: { revalidate: 3600 } });
        return res.json();
    } catch (error) {
        console.error('Error fetching colors:', error);
        return [];
    }
};

export default getColors;