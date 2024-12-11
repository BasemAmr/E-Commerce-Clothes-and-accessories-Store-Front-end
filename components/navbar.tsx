"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Container from './ui/container';
import MainNav from './main-nav';
import NavbarActions from './navbar-actions';
import { Category } from '@/types/types';

interface NavbarProps {
    categories: Category[];
}


const RenderNavbar = (
    { categories }: NavbarProps
) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
                    <button
                        className="lg:hidden p-2 -ml-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
                        <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Store
                        </p>
                    </Link>

                    <div className="hidden lg:block">
                        <MainNav data={categories} />
                    </div>

                    <NavbarActions />
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
                        <div className="py-2">
                            <MainNav data={categories} mobile />
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default RenderNavbar;