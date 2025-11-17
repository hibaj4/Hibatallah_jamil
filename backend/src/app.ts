import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import booksRoutes from './routes/books';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/books', booksRoutes);

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/booktracker';
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connect error', err);
  });
