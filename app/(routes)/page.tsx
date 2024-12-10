
import Container from '@/components/ui/container';
import Billboard from '@/components/billboard';
import getBillboard from '@/actions/get-billboards';
import getProducts from '@/actions/get-products';

const HomePage = async() => {

    const billboard = await getBillboard('eaeef8c7-973b-44ce-ad70-3b0c933a2922');
    const products = await getProducts({ isFeatured: true });

    return (
        <Container>
            <div className="space-y-10 pb-10">
                <Billboard data={billboard} />
            </div>
        </Container>
    );
}

export default HomePage