import React from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/types';
import { useCart } from '@/hooks/use-cart';
import { X } from 'lucide-react';
import Currency from '@/components/ui/currency';

interface CartItemProps {
    item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const { removeItem } = useCart();

    return (
        <div className="flex flex-col md:flex-row p-4 md:p-6">
            <div className="relative w-32 h-32 md:w-48 md:h-48">
                <Image src={item.images[0].url} alt={item.name} layout="fill" objectFit="cover" />
                <button
                    className="absolute top-0 right-0 p-1 bg-white rounded-full"
                    onClick={() => removeItem(item.id)}
                >
                    <X className="w-6 h-6 text-red-500" />
                </button>
            </div>
            <div className="flex p-4 gap-4">

            <div className="flex flex-col gap-2">
                <h3 className="font-semibold">{item.name}</h3>
                <div className="flex gap-2 text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                        {item.selectedSize?.name}
                    </span>
                    <span 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: item.selectedColor?.value }}
                    />
                </div>
                <Currency value={item.price} />
            </div>
        </div>
        </div>
    );
};

export default CartItem;