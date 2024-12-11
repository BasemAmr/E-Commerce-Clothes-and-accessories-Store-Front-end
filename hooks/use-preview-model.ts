import { Product } from '@/types/types';
import {create} from 'zustand';

interface PreviewModel {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    data: Product | null;
    setData: (data: Product  | null) => void;
}

export const usePreviewModel = create<PreviewModel>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) =>  set({
        isOpen: !isOpen
    }),
    data: null,
    setData: (data) => set({
        data
    })
}));