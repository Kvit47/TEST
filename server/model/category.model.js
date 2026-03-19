const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
    image:{
        type: String,
        required: true,
    }        
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;