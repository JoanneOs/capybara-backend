import Product from '../models/Product.js';
import logger from '../utils/logger.js';
import cloudinary from '../config/cloudinary.js';

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const products = await Product.find(filter)
      .sort('-createdAt')
      .lean();
    
    res.json(products);
  } catch (err) {
    logger.error(`Get products error: ${err.message}`);
    res.status(500).json({ 
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    logger.error(`Get product by ID error: ${err.message}`);
    res.status(500).json({ 
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const createProduct = async (req, res) => {
    try {
      const { name, price, description, category, stock } = req.body;
      
      let images = [];
      if (req.files?.length) {
        images = await Promise.all(
          req.files.map(async file => {
            const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(dataUri, {
              folder: 'capybara_products'
            });
            return {
              url: result.secure_url,
              publicId: result.public_id,
              isPrimary: false
            };
          })
        );
        if (images.length) images[0].isPrimary = true;
      }
  
      const product = new Product({
        name,
        price,
        description,
        category,
        stock,
        images
      });
  
      await product.save();
      
      res.status(201).json(product);
    } catch (err) {
      logger.error(`Create product error: ${err.message}`);
      res.status(400).json({ 
        message: 'Failed to create product',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };
  

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    logger.error(`Update product error: ${err.message}`);
    res.status(400).json({ 
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    if (product.images?.length) {
      await Promise.all(
        product.images.map(img => 
          img.publicId && cloudinary.uploader.destroy(img.publicId)
        )
      );
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    logger.error(`Delete product error: ${err.message}`);
    res.status(500).json({ 
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};