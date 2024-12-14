'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useCart } from '@/hooks/use-cart';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function SuccessPage() {
    const router = useRouter();
    const [status, setStatus] = useState('loading');
    const {removeAll} = useCart();

    const searchParams = useSearchParams();

    // Sample object extracted from search params
    const transactionObj = {
        id: searchParams.get('id'),
        pending: searchParams.get('pending'),
        amount_cents: searchParams.get('amount_cents'),
        success: searchParams.get('success'),
        is_auth: searchParams.get('is_auth'),
        is_capture: searchParams.get('is_capture'),
        is_standalone_payment: searchParams.get('is_standalone_payment'),
        is_voided: searchParams.get('is_voided'),
        is_refunded: searchParams.get('is_refunded'),
        is_3d_secure: searchParams.get('is_3d_secure'),
        integration_id: searchParams.get('integration_id'),
        profile_id: searchParams.get('profile_id'),
        has_parent_transaction: searchParams.get('has_parent_transaction'),
        order: searchParams.get('order'),
        created_at: searchParams.get('created_at'),
        currency: searchParams.get('currency'),
        merchant_commission: searchParams.get('merchant_commission'),
        discount_details: searchParams.get('discount_details'),
        is_void: searchParams.get('is_void'),
        is_refund: searchParams.get('is_refund'),
        error_occured: searchParams.get('error_occured'),
        refunded_amount_cents: searchParams.get('refunded_amount_cents'),
        captured_amount: searchParams.get('captured_amount'),
        updated_at: searchParams.get('updated_at'),
        is_settled: searchParams.get('is_settled'),
        bill_balanced: searchParams.get('bill_balanced'),
        is_bill: searchParams.get('is_bill'),
        owner: searchParams.get('owner'),
        data_message: searchParams.get('data.message'),
        source_data_type: searchParams.get('source_data.type'),
        source_data_pan: searchParams.get('source_data.pan'),
        source_data_sub_type: searchParams.get('source_data.sub_type'),
        acq_response_code: searchParams.get('acq_response_code'),
        txn_response_code: searchParams.get('txn_response_code'),
        hmac: searchParams.get('hmac')
      };
  

    useEffect(() => {
        const orderId = localStorage.getItem('currentOrderId');

        if (!orderId) {
            router.push('/');
            return;
        }

        const checkOrderStatus = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/webhook`, {...transactionObj, orderId});
                
                if (response.data.received) {
                    setStatus('complete');
                    localStorage.removeItem('currentOrderId');
                    removeAll();
                } else {
                    setTimeout(checkOrderStatus, 2000);
                }
            } catch (error) {
                setStatus('error');
                console.error(error);
            }
        };

        checkOrderStatus();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                {status === 'loading' && (
                    <div className="space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-700">Processing your payment...</h2>
                        <p className="text-gray-500">Please wait while we confirm your transaction.</p>
                    </div>
                )}

                {status === 'complete' && (
                    <div className="space-y-6">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                        <h1 className="text-2xl font-bold text-gray-800">Thank you for your purchase!</h1>
                        <p className="text-gray-600">Your order has been successfully processed.</p>
                        <button 
                            onClick={() => router.push('/')}
                            className="w-full bg-black text-white py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                        <h2 className="text-xl font-semibold text-gray-800">Something went wrong...</h2>
                        <p className="text-gray-600">We encountered an error processing your payment.</p>
                        <button 
                            onClick={() => router.push('/')}
                            className="w-full bg-black text-white py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
                        >
                            Return Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}