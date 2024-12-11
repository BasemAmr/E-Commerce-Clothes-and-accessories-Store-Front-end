"use client";

import { Tab } from '@headlessui/react';
import Image from 'next/image';
import { Image as ImageType } from '@/types/types';
import GalleryTab from '@/components/ui/gallery-tab';
import { Fragment } from 'react';

const Gallery: React.FC<{ images: ImageType[] }> = ({ images }) => {
    return (
        <Tab.Group as="div" className="flex flex-col-reverse gap-6">
            <div className="w-full px-1">
                <Tab.List className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-w-[600px] mx-auto">
                    {images.map((image) => (
                        <GalleryTab key={image.id} image={image} />
                    ))}
                </Tab.List>
            </div>
            <Tab.Panels className="w-full aspect-square sm:aspect-[16/9] lg:aspect-[21/9]">
                {images.map((image) => (
                    <Tab.Panel key={image.id} as={Fragment}>
                        {({ selected }) => (
                            <div className="relative w-full h-full transition-all duration-200 ease-in-out">
                                <Image 
                                    src={image.url} 
                                    alt="" 
                                    fill
                                    priority={selected}
                                    className="object-cover rounded-lg"
                                    sizes="(max-width: 640px) 100vw, 
                                           (max-width: 1024px) 80vw,
                                           1200px"
                                />
                            </div>
                        )}
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    );
};

export default Gallery;