const express = require('express');
const router = express.Router();
const {
    createSubcategory,
    getSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory,
} = require('../controllers/subcategory.controller');

router.route('/').get(getSubcategories).post(createSubcategory);
router.route('/:id').get(getSubcategoryById).put(updateSubcategory).delete(deleteSubcategory);

module.exports = router;
