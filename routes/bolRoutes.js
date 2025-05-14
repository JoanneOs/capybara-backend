import express from 'express';
import Bol from '../models/Bol.js';
import cloudinary from '../config/cloudinary.js'; // Import the Cloudinary configuration
import multer from 'multer'; // Import the multer middleware for handling file uploads


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Configure multer to store uploaded files in memory as Buffers


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

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { loadNumber, shipper, consignee, rate, miles, status } = req.body;
    let imageResult = null;

    if (req.file){
      const base64Image = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
      imageResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'bol_images', // Optional folder in Cloudinary to organize images
      });
    }
    const bol = new Bol({
      loadNumber,
      shipper,
      consignee,
      rate: parseFloat(rate),
      miles: parseInt(miles),
      status: status || 'Pending',
      image: imageResult ? { url: imageResult.secure_url, publicId: imageResult.public_id } : {},

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

    try {
      const bol = await Bol.findById(req.params.id);
      if (!bol) {
        return res.status(404).json({ message: 'BOL not found' });
      }
  
      // If there's an image associated with the BOL, delete it from Cloudinary
      if (bol.image && bol.image.publicId) {
        await cloudinary.uploader.destroy(bol.image.publicId);
        // 'cloudinary.uploader.destroy()' uses the public ID to remove the image from Cloudinary.
      }
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