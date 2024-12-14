import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types/types'
import toast from 'react-hot-toast'

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    removeAll: () => void
}


export const useCart = create<CartStore>()(persist(
    (set, get) => ({
        items: [],
        addItem: (item: CartItem) => {
            if (!item.selectedSize || !item.selectedColor) {
                return toast.error('Please select size and color');
            }

            const existingItem = get().items.find((i) => 
                i.id === item.id && 
                i.selectedSize?.id === item.selectedSize?.id && 
                i.selectedColor?.id === item.selectedColor?.id
            );

            if (existingItem) {
                return toast('Item already in cart', {icon: '🛒'});
            }

            set((state) => ({items: [...state.items, item]}));
            toast.success('Added to cart');
        },
        removeItem: (id) => {
            set((state) => ({
                items: state.items.filter((item) => item.id !== id)
            }));
            toast('Removed from cart', {icon: '🗑️'});
        },
        removeAll: () => set({ items: [] })
    }),
    {
        name: 'cart-storage'
    }
));