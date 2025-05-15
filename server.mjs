import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bolRoutes from './routes/bolRoutes.js'; // Note the .js extension

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
//app.use(cors());
// // app.use(cors({
// //   origin: [
// //     'http://localhost:5173',                 // Dev frontend
// //    'https://frontendrendertest.onrender.com' // Prod frontend
// //   ],
// //   methods: ['GET', 'POST', 'PUT', 'DELETE']
// // }));
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? 'https://frontendrendertest.onrender.com' 
//     : 'http://localhost:3001'
// };
// app.use(cors(corsOptions));

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://frontendrendertest.onrender.com' 
    : 'http://localhost:3001'
};
app.use(cors(corsOptions));


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