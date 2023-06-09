const express = require('express');
const List = require('../models/List');

const router = express.Router();

// Create a new list
router.post('/lists', async (req, res) => {
  try {
    const { title } = req.body;
    const newList = await List.create({ title });
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create list' });
  }
});

// Get all lists
router.get('/lists', async (req, res) => {
  try {
    const lists = await List.find().populate('tasks');
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve lists' });
  }
});

module.exports = router;
