const Product = require('../model/products.model');
const Subcategory = require('../model/subcategory.model');
const mongoose = require('mongoose');

const getProductsHandler = async (req, res) => {
    try {
        const { subcategoryId } = req.query;
        const filter = subcategoryId ? { subcategoryId } : {};
        const products = await Product.find(filter);
        res.status(200).json({ data: products });
    } catch (error) {
        console.error('Error getting products', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const postProductHandler = async (req, res) => {
    try {
        const { name, price, description, image, images, variants, subcategoryId, quantity } = req.body;
        if (!name || typeof name !== 'object' || !name.az || !name.en || !name.ru || price == null || !description || typeof description !== 'object' || !description.az || !description.en || !description.ru || !subcategoryId || quantity == null) {
            return res.status(400).json({ message: 'Name, price, description, subcategoryId, and quantity are required' });
        }
        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(400).json({ message: 'Invalid subcategoryId' });
        }
        const subcategory = await Subcategory.findById(subcategoryId);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        const productData = {
            name,
            price,
            description,
            subcategoryId,
            quantity,
            ...(image !== undefined && { image }),
            ...(Array.isArray(images) && { images }),
            ...(Array.isArray(variants) && { variants }),
        };
        const product = await Product.create(productData);
        res.status(201).json({ data: product });
    } catch (error) {
        console.error('Error creating product', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getProductByIdHandler = async (req, res) => {

    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: product });
    } catch (error) {
        console.error('Error getting product by id', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateProductHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, image, images, variants, subcategoryId, quantity } = req.body;
        if (subcategoryId !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
                return res.status(400).json({ message: 'Invalid subcategoryId' });
            }
            const subcategory = await Subcategory.findById(subcategoryId);
            if (!subcategory) {
                return res.status(404).json({ message: 'Subcategory not found' });
            }
        }
        const update = {};
        if (name !== undefined) update.name = name;
        if (price !== undefined) update.price = price;
        if (description !== undefined) update.description = description;
        if (image !== undefined) update.image = image;
        if (images !== undefined) update.images = Array.isArray(images) ? images : [];
        if (variants !== undefined) update.variants = Array.isArray(variants) ? variants : [];
        if (subcategoryId !== undefined) update.subcategoryId = subcategoryId;
        if (quantity !== undefined) update.quantity = quantity;
        update.updatedAt = new Date();
        const product = await Product.findByIdAndUpdate(id, update, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: product });
    } catch (error) {
        console.error('Error updating product', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteProductHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getProductsHandler, postProductHandler, getProductByIdHandler, updateProductHandler, deleteProductHandler };