"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";

const InputField = ({ 
    name, 
    label, 
    type = "text", 
    required = false,
    ...props 
  }: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
        {...props}
      />
    </div>
  );
  

const CheckoutPage = () => {
  const router = useRouter();
  const { items } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    street: "",
    building: "",
    apartment: "",
    floor: "",
    state: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: items.reduce((acc, item) => acc + Number(item.price), 0)*100,
          currency: "EGP",
          items: items.map(item => ({
            name: item.name,
            amount: Number(item.price)*100,
            description: `${item.name} - ${item.selectedSize?.name} - ${item.selectedColor?.name}`,
            quantity: 1
          })),
          billing_data: {
            ...formData
          },
          customer: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email
          },
          productIds: items.map(item => item.id)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

      // Parse JSON data
      const data = await response.json();
      console.log('Payment URL:', data.payment_url);
      localStorage.setItem('currentOrderId', data.orderId);
      router.push(data.payment_url);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputField
            name="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <InputField
            name="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <InputField
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            name="phone_number"
            label="Phone"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
          <InputField
            name="street"
            label="Street"
            value={formData.street}
            onChange={handleChange}
            required
          />
          <InputField
            name="building"
            label="Building"
            value={formData.building}
            onChange={handleChange}
            required
          />
          <InputField
            name="apartment"
            label="Apartment"
            value={formData.apartment}
            onChange={handleChange}
          />
          <InputField
            name="floor"
            label="Floor"
            value={formData.floor}
            onChange={handleChange}
          />
          <InputField
            name="state"
            label="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <InputField
            name="country"
            label="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-black px-6 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
};


export default CheckoutPage;