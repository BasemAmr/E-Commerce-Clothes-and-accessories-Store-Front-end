import Container from "@/components/ui/container"
import MainNav from "@/components/main-nav"
import NavbarActions from "@/components/navbar-actions"

import Link from "next/link"

import getCategories from "@/actions/get-categories";

export const revalidate = 0;

const Navbar = async () => {
    const categories = await getCategories();

    return (
        <div className="border-b">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">

                    <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
                        <p className="text-lg font-bold">Ecommerce Shop</p>
                    </Link>
                    <MainNav 
                       data={categories}
                    />
                </div>
                <NavbarActions />
            </Container>
        </div>
    )
}

export default Navbar