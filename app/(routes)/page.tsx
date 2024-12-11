
import Container from '@/components/ui/container';
import Billboard from '@/components/billboard';
import ProductList from '@/components/product-list';

import getBillboard from '@/actions/get-billboards';
import getProducts from '@/actions/get-products';
import getCategories from '@/actions/get-categories';

const HomePage = async() => {

    const billboard = await getBillboard('eaeef8c7-973b-44ce-ad70-3b0c933a2922');
    const products = await getProducts({ isFeatured: true });
    const categories = await getCategories();


    return (
        <Container>
            <div className="space-y-10 pb-10">
                <Billboard data={billboard} />
            </div>
            <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
                <ProductList title="Featured Products" items={products} 
                categories={categories}
                />
            </div>
        </Container>
    );
}

export default HomePage