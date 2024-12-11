"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Category, Product } from '@/types/types';
import { Expand, ShoppingCart } from 'lucide-react';
import IconButton from '@/components/ui/icon-button';
import Currency from '@/components/ui/currency';
import { useRouter } from 'next/navigation';

import { usePreviewModel } from '@/hooks/use-preview-model';

interface ProductCardProps {
    data: Product;
    category?: Category;
}

const ProductCard: React.FC<ProductCardProps> = ({ data, category }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
     
    const { isOpen, setIsOpen, setData } = usePreviewModel();

    const handleClick = (
        datum: Product
    ) => {
        setIsLoading(true);
        setIsOpen(isOpen);
        console.log('clicked', isOpen);
        setData(datum);
        console.log('clicked'
            , datum
        );
        setTimeout(() => {
            setIsLoading(false);
        }, 200);
    };

    return (
        <div className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4 hover:scale-105 hover:shadow-lg transition">
            <div className="aspect-square rounded-xl bg-gray-100 relative">
                <Image
                    src={data?.images?.[0]?.url}
                    alt={data.name}
                    fill
                    className="object-cover rounded-lg hover:opacity-75 transition"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    onClick={
                        () => router.push(`/product/${data.id}`)
                    }
                />
                <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
                    <div className="flex gap-x-6 justify-center">
                        <IconButton 
                            onClick={
                                () => handleClick(data)
                            }
                            icon={<Expand size={20} className="text-gray-600" />}
                            className='p-2'
                        />
                        <IconButton
                            onClick={() => {}}
                            icon={<ShoppingCart size={20} className="text-gray-600" />}
                            className='p-2 '
                        />
                    </div>
                </div>
            </div>

            <div>
                <p className="font-semibold text-lg">{data.name}</p>
                <p className="text-sm text-gray-500">{category?.name}</p>
            </div>

            <div className="flex items-center justify-between">
                <Currency value={data.price} />
                {isLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900/20 border-t-gray-900" />
                )}
            </div>
        </div>
    );
};

export default ProductCard;