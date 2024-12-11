"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { Color, Size } from "@/types/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterProps {
    data: (Size | Color)[];
    name: string;
    valueKey: string;
}

const Filter: React.FC<FilterProps> = ({
    data,
    name,
    valueKey,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const selectedValue = searchParams.get(valueKey);
    
    const onClick = (id: string) => {
        const current = qs.parse(searchParams.toString());
        
        const query = {
            ...current,
            [valueKey]: id === selectedValue ? null : id
        };
        
        // Preserve other query params while updating filter
        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, { skipNull: true, skipEmptyString: true });
        
        router.push(url, { scroll: false });
    };

    const isSelected = (id: string) => selectedValue === id;

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{name}</h3>
            <div className="flex flex-wrap gap-2">
                {data.map((filter) => (
                    <div key={filter.id} className="flex items-center">
                        <Button
                            className={cn(
                                "rounded-md text-sm p-2 border-2 transition-all",
                                isSelected(filter.id)
                                    ? "bg-black text-white border-black" 
                                    : "bg-white text-gray-800 hover:border-gray-300"
                            )}
                            onClick={() => onClick(filter.id)}
                        >
                            {isSelected(filter.id) && (
                                <X className="h-4 w-4 mr-2" />
                            )}
                            {valueKey === "colorId" && (
                                <div 
                                    className="h-4 w-4 rounded-full mr-2 border border-gray-200" 
                                    style={{ backgroundColor: (filter as Color).value }} 
                                />
                            )}
                            {filter.name}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Filter;