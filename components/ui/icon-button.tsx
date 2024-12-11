"use client";

import {cn} from '@/lib/utils';

const IconButton: React.FC<{ icon: React.ReactNode, onClick: () => void, className?: string }> = ({ icon, onClick, className }) => (
    <button
        onClick={onClick}
        className={cn("rounded-full flex items-center justify-center bg-white shadow-md transition", className)}
    >
        {icon}
    </button>
);

export  default IconButton;