import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';

const productSchema = new mongoose.Schema(
  {
    productCode: {  // Changed from loadNumber
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {  // Changed from shipper
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {  // New field
      type: String,
      trim: true,
    },
    category: {  // Changed from consignee
      type: String,
      required: true,
      enum: ['plush', 'clothing', 'accessories', 'digital'],
    },
    price: {  // Changed from rate
      type: Number,
      required: true,
      min: 0.01,  // Minimum $0.01
      set: v => parseFloat(v.toFixed(2)),  // Ensure 2 decimal places
    },
    stock: {  // Changed from miles
      type: Number,
      min: 0,
      default: 0,
    },
    status: {  // Kept (useful for product availability)
      type: String,
      enum: ['Active', 'OutOfStock', 'Discontinued'],
      default: 'Active',
    },
    images: [{  // Enhanced from single image
      url: { type: String },
      publicId: { type: String },
      isPrimary: { type: Boolean, default: false },
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },  // For computed fields
  }
);

// Auto-generate product code if not provided
productSchema.pre('save', function(next) {
  if (!this.productCode) {
    this.productCode = `CAPY-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

// Delete images from Cloudinary when product is removed
productSchema.post('remove', async function(doc) {
  if (doc.images) {
    await Promise.all(
      doc.images.map(image => 
        cloudinary.uploader.destroy(image.publicId)
    );
  }
});

export default mongoose.model('Product', productSchema);