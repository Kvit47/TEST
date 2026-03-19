import { create } from 'zustand';
import { PaymentData, PaymentInitResponse } from '../types/payment.types';

type PaymentStore = {
    paymentData: PaymentData;
    setPaymentData: (data: PaymentData) => void;
    checkoutData: PaymentInitResponse | null;
    setCheckoutData: (data: PaymentInitResponse | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

const usePaymentStore = create<PaymentStore>((set) => ({
    paymentData: {
        id: '',
        amount: 0,
        currency: '',
        status: '',
        createdAt: '',
        updatedAt: '',
    },
    setPaymentData: (data) => set({ paymentData: data }),
    checkoutData: null,
    setCheckoutData: (data) => set({ checkoutData: data }),
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
    error: null,
    setError: (error) => set({ error }),
}));

export default usePaymentStore;
