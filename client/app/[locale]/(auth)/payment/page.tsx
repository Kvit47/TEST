'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import paymentApi from '@/src/entities/payment/service/payment.api';
import usePaymentStore from '@/src/entities/payment/model/paymet.store';
import { ShieldCheck, Package, CreditCard, Loader2 } from 'lucide-react';

const STATIC_PRODUCT = {
    id: 'brand-hoodie-001',
    name: 'Premium Brand Hoodie',
    description: 'High-quality cotton blend hoodie with embroidered logo',
    price: 89.99,
    size: 'M',
    color: 'Black',
};

export default function PaymentPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setCheckoutData } = usePaymentStore();

    const handlePay = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const orderId = `order-${Date.now()}`;
            const data = await paymentApi.initPayment(STATIC_PRODUCT.price, orderId);

            setCheckoutData(data);
            window.location.href = data.pageUrl;
        } catch {
            setError('Payment initialization failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Brand header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Checkout</h1>
                    <p className="text-sm text-neutral-500 mt-1">Complete your purchase securely</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                    {/* Product */}
                    <div className="p-6 border-b border-neutral-100">
                        <div className="flex gap-4 items-start">
                            <div className="w-20 h-20 bg-neutral-900 rounded-xl flex items-center justify-center shrink-0">
                                <Package className="text-white" size={28} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-neutral-900 text-base leading-tight">
                                    {STATIC_PRODUCT.name}
                                </h2>
                                <p className="text-sm text-neutral-500 mt-1">{STATIC_PRODUCT.description}</p>
                                <div className="flex gap-3 mt-2">
                                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                                        Size: {STATIC_PRODUCT.size}
                                    </span>
                                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                                        {STATIC_PRODUCT.color}
                                    </span>
                                </div>
                            </div>
                            <span className="font-bold text-neutral-900 text-base shrink-0">
                                {STATIC_PRODUCT.price.toFixed(2)} ₼
                            </span>
                        </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="px-6 py-4 border-b border-neutral-100 space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Subtotal</span>
                            <span className="text-neutral-700">{STATIC_PRODUCT.price.toFixed(2)} ₼</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Delivery</span>
                            <span className="text-emerald-600 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-neutral-100">
                            <span className="font-semibold text-neutral-900">Total</span>
                            <span className="font-bold text-neutral-900 text-base">
                                {STATIC_PRODUCT.price.toFixed(2)} ₼
                            </span>
                        </div>
                    </div>

                    {/* Test card notice */}
                    <div className="px-6 pt-4">
                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard size={14} className="text-sky-600" />
                                <span className="text-xs font-semibold text-sky-700">Sandbox Test Card</span>
                            </div>
                            <div className="space-y-0.5 text-xs text-sky-600 font-mono">
                                <p>4256 6900 0000 0001</p>
                                <p className="font-sans text-sky-500">Any future exp date · Any 3-digit CVV</p>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="px-6 pt-3">
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Pay button */}
                    <div className="p-6 space-y-3">
                        <Button
                            onClick={handlePay}
                            disabled={isLoading}
                            className="w-full h-12 text-base font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    Redirecting to payment...
                                </span>
                            ) : (
                                `Pay ${STATIC_PRODUCT.price.toFixed(2)} ₼`
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
                            <ShieldCheck size={13} />
                            <span>Secured by OderoPay</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
