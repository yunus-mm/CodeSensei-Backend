import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// Register user (direct, no OTP)
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, profession, password } = req.body;
        if (!name || !email || !phone || !profession || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists.' });
        }
        // Store password as plain text (not recommended for production!)
        const user = new User({ name, email, phone, profession, password });
        await user.save();
        return res.status(201).json({ message: 'Registration successful', user: { name, email, phone, profession } });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
        console.error('Login error:', error);
    }
});

// Get all users' profiles (public route, for demo purposes)
router.get('/profile', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
});

// Get current user's profile (for demo, fetch by email from query param or body)
router.get('/me', async (req, res) => {
    try {
        // Try to get email from query or body
        const email = req.query.email || req.body.email;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

export default router;
