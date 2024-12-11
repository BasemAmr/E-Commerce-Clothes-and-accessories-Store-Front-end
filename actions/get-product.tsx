import {  Product } from "@/types/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id:string): Promise<Product> => {
    // const res = await fetch(`${URL}/${id}`);
    console.log('id',id)
    console.log('URL',URL)
    console.log('URL/id',`${URL}/${id}`)
    return fetch(`${URL}/${id}`).then(res => res.json());

    // return res.json();
}

export default getProduct;