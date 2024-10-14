// backend/src/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

// Function to generate next Employee ID (EMP### format)
const generateUserId = async () => {
    try {
        // Fetch the latest user
        const latestUser = await prisma.users.findFirst({
            orderBy: {
                id: 'desc', // Sort in descending order to get the latest user
            },
        });

        // If there are no users, start with 'EMP001'
        if (!latestUser || !latestUser.id) {
            return 'EMP001';
        }

        // Extract the numeric part of the latest user ID
        const lastIdNumber = parseInt(latestUser.id.replace('EMP', ''), 10);

        // Increment the numeric part and return the new ID
        const newIdNumber = lastIdNumber + 1;
        return `EMP${newIdNumber.toString().padStart(3, '0')}`;
    } catch (error) {
        console.error('Error generating user ID:', error);
        throw new Error('Failed to generate user ID');
    }
};

// User signup (both admin and user)
// User signup (both admin and user)
exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role, secretKey, department } = req.body;

    try {
        console.log('Request Body:', req.body);

        // Check if user already exists
        const existingUser = await prisma.users.findFirst({
            where: { username },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate secret key for admin registration
        if (role === 'admin' && secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ message: 'Invalid secret key for admin registration' });
        }

        // Generate user ID
        const userId = await generateUserId();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with initial completions set to 0
        const newUser = await prisma.users.create({
            data: {
                id: userId, // Use the generated user ID
                username,
                password: hashedPassword,
                role,
                department,
                enrollments: 0,
                completions: 0,
            },
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Error in signup:', error.message);

        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Username already taken' });
        }

        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// User login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            role: user.role,
            userId: user.id
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
