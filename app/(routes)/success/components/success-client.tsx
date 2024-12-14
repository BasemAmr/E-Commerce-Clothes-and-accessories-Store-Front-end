'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useCart } from '@/hooks/use-cart';
import { CheckCircle, XCircle, Loader2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuccessClient() {
    const router = useRouter();
    const [status, setStatus] = useState('loading');
    const {removeAll} = useCart();
    const searchParams = useSearchParams();

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
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-8 md:p-12">
                    {status === 'loading' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 text-center"
                        >
                            <div className="relative mx-auto w-24 h-24">
                                <Loader2 className="w-full h-full animate-spin text-blue-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-800">Processing Payment</h2>
                                <p className="text-gray-500">Please wait while we confirm your order...</p>
                            </div>
                        </motion.div>
                    )}

                    {status === 'complete' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8 text-center"
                        >
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                                    <CheckCircle className="h-12 w-12 text-green-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
                                <p className="text-gray-600">Thank you for shopping with us</p>
                            </div>
                            <div className="pt-4">
                                <button 
                                    onClick={() => router.push('/')}
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                                >
                                    <ShoppingBag className="mr-2 h-5 w-5" />
                                    Continue Shopping
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8 text-center"
                        >
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-red-100 mx-auto flex items-center justify-center">
                                    <XCircle className="h-12 w-12 text-red-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
                                <p className="text-gray-600">We couldn&apos;t process your payment</p>
                            </div>
                            <button 
                                onClick={() => router.push('/')}
                                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                            >
                                Return Home
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}