const Subcategory = require('../model/subcategory.model');
const Category = require('../model/category.model');
const mongoose = require('mongoose');

const createSubcategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        if (!name || typeof name !== 'object' || !name.az || !name.en || !name.ru) {
            return res.status(400).json({ message: 'Name with az, en, and ru is required' });
        }
        if (!categoryId) {
            return res.status(400).json({ message: 'categoryId is required' });
        }
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: 'Invalid categoryId' });
        }
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const subcategory = await Subcategory.create({ name: { az: name.az, en: name.en, ru: name.ru }, categoryId });
        res.status(201).json(subcategory);
    } catch (error) {
        console.error('Error creating subcategory', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSubcategories = async (req, res) => {
    try {
        const { categoryId } = req.query;
        const filter = {};
        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: 'Invalid categoryId' });
            }
            filter.categoryId = categoryId;
        }
        const subcategories = await Subcategory.find(filter);
        res.status(200).json(subcategories);
    } catch (error) {
        console.error('Error getting subcategories', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const subcategory = await Subcategory.findById(id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json(subcategory);
    } catch (error) {
        console.error('Error getting subcategory', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId } = req.body;
        const update = {};
        if (name !== undefined) {
            if (typeof name !== 'object' || !name.az || !name.en || !name.ru) {
                return res.status(400).json({ message: 'Name must include az, en, and ru' });
            }
            update.name = { az: name.az, en: name.en, ru: name.ru };
        }
        if (categoryId !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: 'Invalid categoryId' });
            }
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            update.categoryId = categoryId;
        }
        const subcategory = await Subcategory.findByIdAndUpdate(id, update, { new: true });
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json(subcategory);
    } catch (error) {
        console.error('Error updating subcategory', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subcategory = await Subcategory.findByIdAndDelete(id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.error('Error deleting subcategory', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createSubcategory, getSubcategories, getSubcategoryById, updateSubcategory, deleteSubcategory };