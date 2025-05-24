import express from 'express';
import Bol from '../models/Product.js';
import cloudinary from '../config/cloudinary.js'; // cloudinary config
import multer from 'multer'; // multer for file uploads


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store in memory


// GET all bols
router.get('/', async (req, res) => {
  try {
    const bols = await Bol.find().sort({ date: -1 }); // newest first
    res.json(bols);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single bol by id
router.get('/:id', async (req, res) => {
  try {
    const bol = await Bol.findById(req.params.id);
    if (!bol) {
      return res.status(404).json({ message: 'bol not found' });
    }
    res.json(bol);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST new bol

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { loadNumber, shipper, consignee, rate, miles, status } = req.body;
    let imageResult = null;

    if (req.file){
      const base64Image = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
      imageResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'bol_images', // cloudinary folder
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
      return res.status(400).json({ message: 'validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT/PATCH update bol
router.put('/:id', async (req, res) => {
  try {
    const updatedBol = await Bol.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated, validate
    );
    if (!updatedBol) {
      return res.status(404).json({ message: 'bol not found' });
    }
    res.json(updatedBol);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE bol
router.delete('/:id', async (req, res) => {
  try {

    // check this nested try
    try {
      const bol = await Bol.findById(req.params.id);
      if (!bol) {
        return res.status(404).json({ message: 'bol not found' });
      }

      if (bol.image && bol.image.publicId) {
        await cloudinary.uploader.destroy(bol.image.publicId); // delete from cloudinary
      }
    const deletedBol = await Bol.findByIdAndDelete(req.params.id);
    if (!deletedBol) {
      return res.status(404).json({ message: 'bol not found' });
    }
    res.json({ message: 'bol deleted', deletedBol });
    } catch (err) {
      // nested try error
      res.status(500).json({ message: 'Server error in nested try', error: err.message });
    }

  } catch (err) {
    // outer try error
    res.status(500).json({ message: 'Server error in outer try', error: err.message });
  }

});

export default router;

