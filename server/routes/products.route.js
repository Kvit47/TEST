const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

const {
    getProductsHandler,
    postProductHandler,
    getProductByIdHandler,
    updateProductHandler,
    deleteProductHandler,
} = require('../controllers/products.controller');

// Public: no auth required
router.route('/').get(getProductsHandler);
router.route('/:id').get(getProductByIdHandler);

// Protected: Bearer token required
router.route('/').post(authMiddleware, postProductHandler);
router.route('/:id').put(authMiddleware, updateProductHandler).delete(authMiddleware, deleteProductHandler);

module.exports = router;