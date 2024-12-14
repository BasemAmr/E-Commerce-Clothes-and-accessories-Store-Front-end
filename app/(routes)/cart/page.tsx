"use client";

import Container from "@/components/ui/container";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";


const CartPage = () => {
    const [isMounted, setIsMounted] = useState(false);

    const {items, } = useCart();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="bg-white">
            <Container>
                <div className="px-4 py-16 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold">Shopping Cart</h1>
                </div>
                {/* // div with responisve marigin and grid rsponsive for screens and gap and another div in it with the col span  that check for cart.tems.length */}
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                       <div className="col-span-3">
                            {items.length === 0 && (
                                <div className="bg-gray-100 p-4 rounded-lg text-center">
                                    Your cart is empty
                                </div>
                            )}
                            <ul>

                                {
                                    items.map((item) => (
                                        <CartItem key={item.id} item={item} />
                                    ))
                                }
                            </ul>
                            <Summary />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default CartPage;