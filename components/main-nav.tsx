"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/types/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MainNavProps {
    data: Category[];
    mobile?: boolean;
}

const MainNav = ({ data, mobile }: MainNavProps) => {
    const pathname = usePathname();
    
    return (
        <nav className={cn(
            "flex",
            mobile ? "flex-col space-y-4 px-6" : "items-center space-x-4 lg:space-x-6 mx-6"
        )}>
            {data.map((route) => (
                <Link
                    key={route.id}
                    href={`/category/${route.id}`}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-black relative group",
                        pathname === `/category/${route.id}` ? "text-black" : "text-gray-500",
                        mobile && "py-2"
                    )}
                >
                    {route.name}
                    <span className={cn(
                        "absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full",
                        pathname === `/category/${route.id}` && "w-full"
                    )} />
                </Link>
            ))}
        </nav>
    );
};

export default MainNav;