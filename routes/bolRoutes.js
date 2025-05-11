import express from 'express';
import Bol from '../models/Bol.js';

const router = express.Router();

// GET all BOLs
router.get('/', async (req, res) => {
  try {
    const bols = await Bol.find().sort({ date: -1 }); // Newest first
    res.json(bols);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single BOL by ID
router.get('/:id', async (req, res) => {
  try {
    const bol = await Bol.findById(req.params.id);
    if (!bol) {
      return res.status(404).json({ message: 'BOL not found' });
    }
    res.json(bol);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST new BOL
router.post('/', async (req, res) => {
  try {
    const bol = new Bol({
      ...req.body,
      status: req.body.status || 'Pending' // Default status
    });
    const newBol = await bol.save();
    res.status(201).json(newBol);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT/PATCH update BOL
router.put('/:id', async (req, res) => {
  try {
    const updatedBol = await Bol.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc and validate
    );
    if (!updatedBol) {
      return res.status(404).json({ message: 'BOL not found' });
    }
    res.json(updatedBol);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE BOL
router.delete('/:id', async (req, res) => {
  try {
    const deletedBol = await Bol.findByIdAndDelete(req.params.id);
    if (!deletedBol) {
      return res.status(404).json({ message: 'BOL not found' });
    }
    res.json({ message: 'BOL deleted', deletedBol });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;