"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '@/types/types';
import IconButton from '@/components/ui/icon-button';
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    data: Product | null;
    setIsOpen: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, data, setIsOpen }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(isOpen);
        };

        const handleScroll = () => {
            document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            handleScroll();
            setIsAnimating(true);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, setIsOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => setIsOpen(isOpen), 200);
    };

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isMounted || !isOpen || !data) return null;

    return (
        <div 
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
                "transition-opacity duration-300 ease-in-out",
                isAnimating ? "opacity-100" : "opacity-0"
            )}
            onClick={handleOutsideClick}
        >
            <div 
                className={cn(
                    "relative w-full max-h-[90vh] overflow-y-auto",
                    "max-w-3xl bg-white rounded-lg shadow-2xl",
                    "transition-all duration-300 ease-in-out",
                    "scrollbar-hide",
                    isAnimating 
                        ? "scale-100 translate-y-0" 
                        : "scale-95 translate-y-4"
                )}
            >
                <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm">
                    <IconButton
                        className="absolute top-4 right-4 hover:scale-110 transition"
                        onClick={handleClose}
                        icon={<X size={24} />}
                    />
                </div>

                <div className="p-6">
                    <Gallery images={data.images} />
                    <div className="mt-6">
                        <Info 
                            product={data} 
                            selectedSize={selectedSize} 
                            setSelectedSize={setSelectedSize} 
                            selectedColor={selectedColor} 
                            setSelectedColor={setSelectedColor} 
                        />
                    </div>
                </div>

                <div className="sticky bottom-0 p-4 bg-white/80 backdrop-blur-sm border-t">
                    <Button 
                        onClick={handleClose}
                        className="w-full sm:w-auto hover:scale-105 transition"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;