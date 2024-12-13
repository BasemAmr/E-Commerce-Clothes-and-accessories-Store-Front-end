import {create} from 'zustand'
import {  persist } from 'zustand/middleware'

import {Product} from '@/types/types'
import toast from 'react-hot-toast'

interface CartStore {
    items: Product[]
    addItem: (item: Product) => void
    removeItem: (item: Product) => void
    removeAll: () => void
}

export const useCart = create<CartStore>()(persist(
    (set, get) => ({
        items: [],
        addItem: (item) => {
            const existentItems = get().items
            const selectedItem = existentItems.find((existentItem) => existentItem.id === item.id)
            if (selectedItem) {
                return toast('Item already in cart', {icon: '🛒'})
            } 
            set((state) => ({items: [...state.items, item]}))
            toast('Item added to cart', {icon: '🛒'})
        },
        removeItem: (item) => {
            set((state) => ({items: state.items.filter((existentItem) => existentItem.id !== item.id)}))
            toast('Item removed from cart', {icon: '🗑️'})
        },
        removeAll: () => {
            set(() => ({items: []}))
            toast('Cart cleared', {icon: '🗑️'})
        }
    }),
    {
        name: 'cart-storage'
    }
))