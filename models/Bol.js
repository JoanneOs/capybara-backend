import mongoose from 'mongoose';

// Define the schema for the Bill of Lading (BOL)
const bolSchema = new mongoose.Schema(
  {
    loadNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Ensures no leading/trailing spaces
    },
    date: {
      type: Date,
      default: Date.now,
    },
    shipper: {
      type: String,
      required: true,
      trim: true,
    },
    consignee: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0, // Ensures rate is not negative
    },
    miles: {
      type: Number,
      min: 0, // Ensures miles is not negative
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Disputed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model based on the schema
export default mongoose.model('Bol', bolSchema);
