import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bolRoutes from './routes/bolRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
//app.use(cors());
// app.use(cors({
//   origin: [
//     'http://localhost:5173',                 // Dev frontend
//     'https://frontendrendertest.onrender.com' // Prod frontend
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));

app.use(cors({
  origin: 'http://localhost:3001', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If using cookies/auth
}));

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://frontendrendertest.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bol-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('BOL Tracker API is running');
});

// API routes
app.use('/api/bols', bolRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
