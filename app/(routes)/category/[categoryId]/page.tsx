import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getSizes from "@/actions/get-sizes";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/billboard";
import Filter from "@/components/filters";
import NoResults from "@/components/ui/no-result";
import Container from "@/components/ui/container";
import MobileFilters from "@/components/mobile-filters";
import { FilteredCards } from "../components/filtered";
import { Suspense } from "react";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
  searchParams: Promise<{
    colorId: string;
    sizeId: string;
  }>;
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { categoryId } = await params;
  const { colorId, sizeId } = await searchParams;

  const products = await getProducts({
    categoryId: categoryId,
    colorId: colorId,
    sizeId: sizeId,
  });

  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(categoryId);

  console.log("category", category);
  console.log("products", products);
  console.log("sizes", sizes);
  console.log("colors", colors);
  console.log("billboard", category.billboards);

  return (
    <div className="bg-white">
      <Container>
        <Billboard data={category.billboards} />
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <Suspense fallback={<div>Loading...</div>}>
              <MobileFilters sizes={sizes} colors={colors} />
            </Suspense>
            <div className="hidden lg:block">
              <Suspense fallback={<div>Loading...</div>}>
                <Filter valueKey="sizeId" name="Sizes" data={sizes} />
                <Filter valueKey="colorId" name="Colors" data={colors} />
              </Suspense>
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 && <NoResults />}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FilteredCards products={products} category={category} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
