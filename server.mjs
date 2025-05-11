import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bolRoutes from './routes/bolRoutes.js'; // Note the .js extension

const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bol-system')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('BOL Tracker API');
});

// Routes
app.use('/api/bols', bolRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});