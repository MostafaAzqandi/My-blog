import express from 'express';
import {
    showLogin,
    login,
    showRegister,
    register,
    logout
} from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Login routes
router.get('/login', showLogin);
router.post('/login', login);

// Register routes
router.get('/register', showRegister);
router.post('/register', register);

// Logout route
router.get('/logout', isAuthenticated, logout);

export default router;