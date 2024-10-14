// src/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// Signup route with validation
router.post(
    '/signup',
    [
        body('username').isString().notEmpty().withMessage('Username is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
        body('secretKey').optional(),
    ],
    signup
);

// Login route with validation
router.post(
    '/login',
    [
        body('username').isString().notEmpty().withMessage('Username is required'),
        body('password').isString().notEmpty().withMessage('Password is required'),
    ],
    login
);

module.exports = router;
