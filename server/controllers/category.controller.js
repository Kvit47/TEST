const Category = require('../model/category.model');

const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name || typeof name !== 'object' || !name.az || !name.en || !name.ru) {
            return res.status(400).json({ message: 'Name with az, en, and ru is required' });
        }
        if (!image) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const category = await Category.create({ name: { az: name.az, en: name.en, ru: name.ru }, image: image });
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error getting categories', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error getting category', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;
        if (name !== undefined) {
            if (typeof name !== 'object' || !name.az || !name.en || !name.ru) {
                return res.status(400).json({ message: 'Name must include az, en, and ru' });
            }
        }
        if (image !== undefined) {
            if (!image) {
                return res.status(400).json({ message: 'Image is required' });
            }
        }
        
        const update = name && image ? { name: { az: name.az, en: name.en, ru: name.ru }, image: image } : {};
        const category = await Category.findByIdAndUpdate(id, update, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error updating category', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };