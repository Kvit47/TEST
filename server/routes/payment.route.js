const express = require('express');
const router = express.Router();
const { initPayment } = require('../controllers/payment.controller');

router.post('/init', initPayment);

module.exports = router;
