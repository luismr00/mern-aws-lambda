const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// Create a new item
router.post('/', async (req, res) => {
    const newItem = new Item(req.body);
    try {
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error creating item:', err); // Add this line for logging
        res.status(400).json({ message: err.message });
    }
});

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error('Error getting items:', err); // Add this line for logging
        res.status(500).json({ message: err.message });
    }
});

// Get a single item
router.get('/:id', getItem, (req, res) => {
    res.json(res.item);
});

// Update an item
router.put('/:id', getItem, async (req, res) => {
    if (req.body.name != null) {
        res.item.name = req.body.name;
    }
    try {
        const updatedItem = await res.item.save();
        res.json(updatedItem);
    } catch (err) {
        console.error('Error updating item:', err); // Add this line for logging
        res.status(400).json({ message: err.message });
    }
});

// Delete an item
router.delete('/:id', getItem, async (req, res) => {
    try {
        console.log('Attempting to delete item with ID:', req.params.id); // Logging for debugging
        console.log('Item details:', res.item); // Logging the item details
        await Item.deleteOne({ _id: res.item._id }); // Using deleteOne() instead of remove()
        res.json({ message: 'Item deleted' });
    } catch (err) {
        console.error('Error deleting item:', err); // Add this line for logging
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a single item
async function getItem(req, res, next) {
    let item;
    try {
        item = await Item.findById(req.params.id);
        if (item == null) {
            return res.status(404).json({ message: 'Cannot find item' });
        }
    } catch (err) {
        console.error('Error finding item:', err); // Add this line for logging
        return res.status(500).json({ message: err.message });
    }
    res.item = item;
    next();
}

module.exports = router;
