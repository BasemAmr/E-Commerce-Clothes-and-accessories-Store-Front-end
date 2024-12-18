
import getProduct from '@/actions/get-product';
import getProducts from '@/actions/get-products';
import ProductPage from './component/page-with-state';
import getCategories from '@/actions/get-categories';

interface PageParams {
    params : Promise<{
        productId: string;
    }>
}


const page = async (
    { params } : PageParams
) => {
    const { productId } = await params;
    
    const product = await getProduct(productId);
    const suggestedProducts = (await getProducts({ 
        categoryId: product.categoryId,
        isFeatured: false,
        colorId: '',
        sizeId: ''
     })).filter(p => p.id !== product.id);
    const categories =  await getCategories();

    return (
            <ProductPage 
                product={product}
                suggestedProducts={suggestedProducts}
                categories={categories}
            />
    );
}



export default page;