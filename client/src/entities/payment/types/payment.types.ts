export type PaymentData = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    updatedAt: string;
};

export type PaymentInitResponse = {
    token: string;
    pageUrl: string;
};
