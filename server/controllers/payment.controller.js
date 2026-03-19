require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

function generateRandomKey() {
    return crypto.randomBytes(12).toString('hex');
}

// OderoPay signature: HMAC-SHA256(URL + API_KEY + SECRET_KEY + RANDOM_KEY + BODY, secretKey) → base64
function generateSignature(apiKey, secretKey, randomKey, url, body = '') {
    const concatenated = url + apiKey + secretKey + randomKey + body;
    return crypto.createHmac('sha256', secretKey).update(concatenated).digest('base64');
}

function buildOderoHeaders(url, bodyString = '') {
    const apiKey = process.env.ODERO_API_KEY;
    const secretKey = process.env.ODERO_SECRET_KEY;
    const randomKey = generateRandomKey();
    const signature = generateSignature(apiKey, secretKey, randomKey, url, bodyString);

    return {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-rnd-key': randomKey,
        'x-auth-version': 'V1',
        'x-signature': signature,
    };
}

// const initPayment = async (req, res) => {
//     try {
//         const { amount, orderId } = req.body;
//         if (!amount || !orderId) {
//             return res.status(400).json({ message: 'Amount and orderId are required' });
//         }

//         const url = `${process.env.ODERO_API_URL}/payment/v1/checkout-payments/init`;

//         const payload = {
//             price: amount,
//             paidPrice: amount,
//             walletPrice: 0,
//             currency: 'AZN',
//             paymentGroup: 'PRODUCT',
//             conversationId: orderId,
//             callbackUrl: process.env.ODERO_CALLBACK_URL,
//             items: [
//                 {
//                     externalId: orderId,
//                     name: 'Order #' + orderId,
//                     price: amount,
//                 },
//             ],
//         };

//         const bodyString = JSON.stringify(payload);
//         const headers = buildOderoHeaders(url, bodyString);

//         const response = await axios.post(url, payload, { headers });
//         const { token, pageUrl } = response.data.data;

//         res.status(200).json({ token, pageUrl });
//     } catch (error) {
//         console.error('Error initializing payment:', error?.response?.data || error.message);
//         res.status(500).json({
//             message: 'Internal server error while initializing payment',
//             details: error?.response?.data || null,
//         });
//     }
// };

const initPayment = async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        // Проверка наличия ключей ПЕРЕД запросом
        if (!process.env.ODERO_API_KEY || !process.env.ODERO_SECRET_KEY) {
            return res.status(400).json({ 
                message: 'API Key или Secret Key не установлены в .env' 
            });
        }

        const url = `${process.env.ODERO_API_URL}/payment/v1/checkout-payments/init`;

        const payload = {
            price: amount.toString(), // В Odero часто требуется строка или Decimal
            paidPrice: amount.toString(),
            currency: 'AZN',
            paymentGroup: 'PRODUCT',
            conversationId: orderId,
            callbackUrl: process.env.ODERO_CALLBACK_URL,
            // Добавьте объект buyer (покупатель), он часто обязателен
            buyer: {
                id: "C123",
                name: "Ivan",
                surname: "Ivanov",
                email: "test@example.com",
                identityNumber: "1234567",
                registrationAddress: "Baku",
                city: "Baku",
                country: "Azerbaijan"
            },
            items: [
                {
                    externalId: orderId,
                    name: 'Order #' + orderId,
                    price: amount.toString(),
                },
            ],
        };

        const bodyString = JSON.stringify(payload);
        const headers = buildOderoHeaders(url, bodyString); // Убедитесь, что эта функция не падает

        const response = await axios.post(url, payload, { headers });
        
        // Odero обычно возвращает данные в объекте data
        const { token, pageUrl } = response.data.data;
        res.status(200).json({ token, pageUrl });

    } catch (error) {
        // ОЧЕНЬ ВАЖНО: логируем ответ от сервера Odero
        console.error('Odero Error:', error.response?.data || error.message);
        
        res.status(error.response?.status || 500).json({
            message: 'Ошибка при инициализации платежа',
            details: error.response?.data || error.message,
        });
    }
};
const callbackPayment = async (req, res) => {
    try {
        const { token, paymentIdList } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const url = `${process.env.ODERO_API_URL}/payment/v1/checkout-payments/${token}`;
        const headers = buildOderoHeaders(url);

        const response = await axios.get(url, { headers });
        const paymentData = response.data.data;

        if (paymentData?.paymentStatus === 'SUCCESS') {
            console.log('Payment successful. Payment ID:', paymentData.id, '| Order:', paymentData.orderId);
        } else {
            console.log('Payment not successful. Status:', paymentData?.paymentStatus);
        }

        res.status(200).json({ message: 'Callback processed', status: paymentData?.paymentStatus });
    } catch (error) {
        console.error('Error in payment callback:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Internal server error while processing callback' });
    }
};

module.exports = {
    initPayment,
    callbackPayment,
};
