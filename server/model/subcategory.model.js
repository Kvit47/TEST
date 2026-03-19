const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
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
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);
module.exports = Subcategory;