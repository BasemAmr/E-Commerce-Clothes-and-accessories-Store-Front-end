"use client"

import ProductCard from "@/components/ui/product-card";
import { Product, Category } from "@/types/types";
import PreviewModal from '@/components/ui/modal';
import { usePreviewModel } from '@/hooks/use-preview-model';
export const FilteredCards = (
    { products, category } : { products: Product[], category: Category }
) => {
   

    const { isOpen, setIsOpen, data } = usePreviewModel();

    return (
        <>
            {products.map((product) => (
                <ProductCard key={product.id} data={product} category={category} />
            ))}
            <PreviewModal 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          data={data}
        />
        </>
    );

};