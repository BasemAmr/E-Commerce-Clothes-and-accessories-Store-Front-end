"use client";

import { Category, Product } from "@/types/types";
import NoResult from "@/components/ui/no-result";
import ProductCard from "@/components/ui/product-card";

import PreviewModal from '@/components/ui/modal';
import { usePreviewModel } from '@/hooks/use-preview-model';

interface ProductListProps {
    items: Product[];
    categories: Category[];
    title: string;
}

const ProductList = (
    { items, categories, title }: ProductListProps
) => {

    const { isOpen, setIsOpen, data } = usePreviewModel();

    return (
        <div className="space-y-10 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            {
                items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((item) => (
                            <ProductCard key={item.id} data={item} category={
                                categories.find((category) => category.id === item.categoryId)
                            }/>
                        ))}
                    </div>
                ) : (
                    <NoResult />
                )
            }
            <PreviewModal 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          data={data}
        />
        </div>
    );
};


export default ProductList;