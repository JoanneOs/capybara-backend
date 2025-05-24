import express from 'express';
import Product from '../models/Product.js'; // Import Product model instead of Bol
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET all products
router.get('/', async (req, res) => {
  try {
    // Fetch all products sorted by newest first
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST new product with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    let imageResult = null;

    // Upload image to Cloudinary if provided
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
      imageResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'product_images', // Changed from bol_images
      });
    }

    // Create new product
    const product = new Product({
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      image: imageResult ? { 
        url: imageResult.secure_url, 
        publicId: imageResult.public_id 
      } : null,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: err.errors 
      });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: err.errors 
      });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from Cloudinary if exists
    if (product.image?.publicId) {
      await cloudinary.uploader.destroy(product.image.publicId);
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.json({ 
      message: 'Product deleted', 
      deletedProduct 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

export default router;