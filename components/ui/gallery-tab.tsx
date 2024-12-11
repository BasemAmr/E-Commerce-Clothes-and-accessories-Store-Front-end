"use client";

import { Tab } from '@headlessui/react';
import Image from 'next/image';
import { Image as ImageType } from '@/types/types';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';

import {Button} from './button';

const GalleryTab: React.FC<{ image: ImageType }> = ({ image }) => {
    return (
        <Tab as={Fragment}>
            {({ selected }) => (
                <Button
                    className={cn(
                        "relative w-full aspect-square rounded-md overflow-hidden focus:outline-none",
                        "ring-2 ring-offset-2 transition-all duration-200",
                        selected ? "ring-black" : "ring-transparent hover:ring-gray-300"
                    )}
                >
                    <Image
                        src={image.url}
                        alt=""
                        fill
                        className={cn(
                            "object-cover transition-opacity duration-300",
                            selected ? "opacity-100" : "opacity-70 hover:opacity-100"
                        )}
                        sizes="(max-width: 640px) 25vw, 100px"
                        priority={selected}
                        quality={selected ? 85 : 50}
                    />
                </Button>
            )}
        </Tab>
    );
};

export default GalleryTab;