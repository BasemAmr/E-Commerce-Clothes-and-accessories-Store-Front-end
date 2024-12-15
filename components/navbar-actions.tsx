"use client";


import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

const NavbarActions = () => {
    const [isMounted, setIsMounted] = useState(false);

// 
    const router = useRouter();

    const cart = useCart();
    const { items } = cart;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="ml-auto flex items-center gap-x-4">
            <Button
                className="flex items-center rounded-full bg-black px-9 py-2"
                variant="default"
                size="icon"
                onClick={() => router.push("/cart")}
            >
                <span className="text-sm font-medium text-white w-6 h-6 flex items-center justify-center rounded-full bg-black">
                🛒

                </span>
                <span className="ml-2 text-sm font-medium text-white">
                    {items.length}
                </span>
                
            </Button>
        </div>
    );
};

export default NavbarActions;