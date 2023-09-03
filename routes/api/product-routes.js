const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [Category, Tag],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ Error: 'Failed to get products' });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findByPk(req.params.id, {
      include: [Category, Tag],
    });
    if (products) {
      res.json(products);
    } else {
      res.status(404).json({ Error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ Error: 'Error occured fetching the product' });
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ Error: 'Failed to create product' });
  }
});
// update product
router.put('/:id', async (req, res) => {
  // update product data
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });
      // create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      // run both actions
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [Category, Tag],
    });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ Error: 'Failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deletedRowsCount = await Product.destroy({
      where: { id: req.params.id },
    });
    if (deletedRowsCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ Error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ Error: 'Failed to delete product' });
  }
});
module.exports = router;

