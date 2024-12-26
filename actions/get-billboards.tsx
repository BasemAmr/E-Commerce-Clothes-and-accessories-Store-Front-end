import { Billboard } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboard = async (id:string): Promise<Billboard> => {
    const res = await fetch(`${URL}/${id}`, { cache: 'force-cache', next: { revalidate: 10 } });

    return res.json();
}

export default getBillboard;