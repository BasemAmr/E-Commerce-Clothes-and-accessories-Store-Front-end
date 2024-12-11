"use client";

import { useState } from 'react';
import { Category, Product} from '@/types/types';
import ProductList from '@/components/product-list';
import Gallery from '@/components/gallery';
import Info from '@/components/info';

const ProductPage: React.FC<{ product: Product; suggestedProducts: Product[], categories: Category[] }> = ({ product, suggestedProducts, categories }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);



    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Gallery images={product.images} />
                <Info product={product} selectedSize={selectedSize} setSelectedSize={setSelectedSize} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
            </div>
            <div className="mt-8">
                <ProductList items={suggestedProducts} title="Suggested Products" 
                categories={categories}
                />
            </div>

        </div>
    );
};

export default ProductPage;