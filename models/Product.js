import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be at least $0.01'],
    set: v => parseFloat(v.toFixed(2))
  },
  description: {
    type: String,
    maxlength: [500, 'Description too long']
  },
  category: {
    type: String,
    required: true,
    enum: ['plush', 'clothing', 'accessories', 'digital']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  images: [{
    url: String,
    publicId: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Delete images from Cloudinary when product is removed
productSchema.post('remove', async function(doc) {
  if (doc.images?.length) {
    await Promise.all(
      doc.images.map(img => 
        img.publicId && cloudinary.uploader.destroy(img.publicId)
    );
  }
});

export default mongoose.model('Product', productSchema);