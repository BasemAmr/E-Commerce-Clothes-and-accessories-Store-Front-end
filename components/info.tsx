import { cn } from "@/lib/utils";
import { Product } from "@/types/types";
import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import { useCart } from "@/hooks/use-cart";

const Info = (
    {product, selectedSize, setSelectedSize, selectedColor, setSelectedColor} : { product: Product; selectedSize: string | null; setSelectedSize: (size: string) => void; selectedColor: string | null; setSelectedColor: (color: string) => void }
) => {

    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem({
            ...product,
            selectedSize: product.sizes.find(s => s.id === selectedSize),
            selectedColor: product.colors.find(c => c.id === selectedColor)
        });
    };

    return (
        <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <Currency value={product.price} />
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Sizes</h2>
                        <div className="flex space-x-2">
                            {product.sizes.map((size) => (
                                <Button
                                    key={size.id}
                                    className={cn(
                                        'px-4 py-2 border rounded-md',
                                        selectedSize === size.id ? 'border-black' : 'border-gray-300'
                                    )}
                                    onClick={() => setSelectedSize(size.id)}
                                >
                                    {size.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Colors</h2>
                        <div className="flex space-x-2">
                            {product.colors.map((color) => (
                                <button
                                    key={color.id}
                                    className={cn(
                                        'w-8 h-8 rounded-full',
                                        selectedColor === color.id ? 'ring-2 ring-black' : 'ring-1 ring-gray-300'
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setSelectedColor(color.id)}
                                />
                            ))}
                        </div>
                    </div>
                    <Button 
                        className="w-full mt-4" 
                        variant="default" 
                        size="lg"
                        disabled={!selectedSize || !selectedColor}
                        onClick={handleAddToCart}
                    >
                        {!selectedSize || !selectedColor ? 'Select options' : 'Add to Cart'}
                    </Button>
                </div>
    );
}


export default Info;