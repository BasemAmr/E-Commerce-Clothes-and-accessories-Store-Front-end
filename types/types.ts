export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
}

export interface Category {
    id: string;
    name: string;
    billboards: Billboard;
}

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    price: string;
    isFeatured: boolean;
    sizes: Size[],
    colors: Color[],
    images: Image[];
    isArchived?: boolean;
}

export interface Size {
    id: string;
    name: string;
    value: string;
}

export interface Color {
    id: string;
    name: string;
    value: string;
}

export interface Image {
    id: string;
    url: string;
}

export interface CartItem extends Product {
    selectedSize?: Size;
    selectedColor?: Color;
}
