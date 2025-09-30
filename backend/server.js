// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/userRoute.js';
import userRoutes from './routes/adminUserRoute.js';
import jobApplicationRoutes from './routes/jobApplicationRoutes.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON body parse karne ke liye

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// auth Routes
app.use('/api/auth', authRoutes);

// job Routes
app.use('/api/jobs', jobRoutes);

// job application routes
app.use('/api/applications', jobApplicationRoutes);

// users (admin) Routes
app.use('/api/users', userRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportal';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
