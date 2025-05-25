import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://www.getpostman.com'
  ],
  credentials: true
}));

app.use(express.json());
app.use(logger);

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => 
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);