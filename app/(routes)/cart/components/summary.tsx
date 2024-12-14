'use client';

import React, { useEffect, useState } from 'react';
import { useRouter,  } from 'next/navigation';
import Currency from '@/components/ui/currency';
import { useCart } from '@/hooks/use-cart';

const Summary: React.FC = () => {
    const [total, setTotal] = useState<number>(0);
    const { items } = useCart();

    const router = useRouter();

    useEffect(() => {
        const calculateTotal = () => {
            const totalAmount = items.reduce((acc, item) => acc + Number (item.price), 0);
            setTotal(totalAmount);
        };

        calculateTotal();
    }, [items]);



    const handleCheckout = async () => {
        router.push('/checkout');
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="flex justify-between mb-2">
                <span>Total:</span>
                <Currency value={total.toString()} />
            </div>
            <button
                onClick={handleCheckout}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
                Checkout
            </button>
        </div>
    );
};

export default Summary;