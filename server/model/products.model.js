const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        az: {
            type: String,
            required: true,
        },
        en: {
            type: String,
            required: true,
        },
        ru: {
            type: String,
            required: true,
        },
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        az: {
            type: String,
            required: true,
        },
        en: {
            type: String,
            required: true,
        },
        ru: {
            type: String,
            required: true,
        },
    },
    image: {
        type: String,
        required: false,
    },
    images:{
        type: [String],
        required: false,
    },
    variants: [{
        color: { type: String, required: true }, // e.g., "Red" or "#FF0000"
        size: { type: String, required: true },  // e.g., "XL"
        stock: { type: Number, default: 0, min: 0 }
    }],
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;