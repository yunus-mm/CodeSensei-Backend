import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

// Import routes
import userRoutes from './routes/userRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
