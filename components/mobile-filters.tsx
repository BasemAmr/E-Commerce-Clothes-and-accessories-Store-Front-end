"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Plus, X } from "lucide-react";
import { Color, Size } from "@/types/types";
import Filter from "@/components/filters";
import { Button } from "@/components/ui/button";

interface MobileFiltersProps {
    sizes: Size[];
    colors: Color[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
    sizes,
    colors
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="flex items-center gap-x-2 lg:hidden"
            >
                Filters
                <Plus size={20} />
            </Button>

            <Dialog 
                open={open} 
                as="div" 
                className="relative z-40 lg:hidden" 
                onClose={setOpen}
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                
                <div className="fixed inset-0 z-40 flex">
                    <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-lg font-medium">Filters</h2>
                            <Button
                                onClick={() => setOpen(false)}
                                className="p-2"
                            >
                                <X size={20} />
                            </Button>
                        </div>

                        <div className="p-4">
                            <Filter
                                valueKey="sizeId"
                                name="Sizes"
                                data={sizes}
                            />
                            <Filter
                                valueKey="colorId"
                                name="Colors"
                                data={colors}
                            />
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
};

export default MobileFilters;