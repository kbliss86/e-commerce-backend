const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: Product
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ Error: 'Failed to get tags' });
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findByPk(req.params.id, {
      include: Product
    });
    if (tags) {
      res.json(tags);
    } else {
      res.status(404).json({ Error: 'Tag not found' });
    }
  } catch (err) {
    res.status(500).json({ Error: 'Failed to get tag' });
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ Error: 'Failed to create tag' });
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: req.params.id } }
    );
    const updatedTag = await Tag.findByPk(req.params.id);
    res.json(updatedTag);
  } catch (err) {
    res.status(400).json({ Error: 'Failed to update tag' });
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedRowsCount = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (deletedRowsCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ Error: 'Tag not found' });
    }
  } catch (err) {
    res.status(500).json({ Error: 'Failed to delete tag' });
  }
});

module.exports = router;
