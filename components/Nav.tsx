import getCategories from "@/actions/get-categories";
import RenderNavbar from "./navbar";

const Navbar = async () => {
    const categories = await getCategories();
    return (
        <RenderNavbar   categories={categories} />

    )
}

export default Navbar;
