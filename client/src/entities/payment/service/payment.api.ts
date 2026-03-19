import { api } from "@/src/shared/api/api-instanse";
import { PaymentInitResponse } from "../types/payment.types";

const paymentApi = {
    initPayment: async (amount: number, orderId: string): Promise<PaymentInitResponse> => {
        const response = await api.post('/pay/init', { amount, orderId });
        return response.data;
    },
};

export default paymentApi;
