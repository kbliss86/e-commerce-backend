const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      include: Product
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({Error: 'Failed to get categories'});
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categories = await Category.findByPk(req.params.id, {
      include: Product
    });
    if (categories) {
      res.json(categories);
    } else {
      res.status(404).json({ Error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ Error: 'Failed to get category' });
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ Error: 'Failed to create category' });
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updatedCategories = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!updatedCategories[0]) {
      res.status(404).json({ Error: 'Category not found' });
      return;
    }
    res.json(updatedCategories);
  } catch (err) {
    res.status(400).json({ Error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedRows = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ Error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ Error: 'Failed to delete category' });
  }
});

module.exports = router;