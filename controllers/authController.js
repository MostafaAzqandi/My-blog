import { Op } from 'sequelize';
import db from '../models/index.js';

const User = db.User;

// Show login page
export const showLogin = (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        error: null
    });
};

// Process login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }
        
        // Check password
        const isValid = await user.isValidPassword(password);
        
        if (!isValid) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }
        
        if (!user.isActive) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Your account has been deactivated'
            });
        }
        
        // Store user in session
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.userName = user.username;
        
        res.redirect('/');
        
    } catch (error) {
        console.error(error);
        res.render('auth/login', {
            title: 'Login',
            error: 'An error occurred. Please try again.'
        });
    }
};

// Show register page
export const showRegister = (req, res) => {
    res.render('auth/register', {
        title: 'Register',
        error: null,
        formData: {}
    });
};

// Process registration
export const register = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        
        // Validation
        if (!username || !email || !password || !fullName) {
            return res.render('auth/register', {
                title: 'Register',
                error: 'All fields are required',
                formData: req.body
            });
        }
        
        if (password.length < 6) {
            return res.render('auth/register', {
                title: 'Register',
                error: 'Password must be at least 6 characters',
                formData: req.body
            });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username }
                ]
            }
        });
        
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Register',
                error: 'Username or email already exists',
                formData: req.body
            });
        }
        
        // Create user
        await User.create({
            username,
            email,
            password,
            fullName,
            role: 'user'
        });
        
        res.redirect('/login');
        
    } catch (error) {
        console.error(error);
        res.render('auth/register', {
            title: 'Register',
            error: error.message || 'An error occurred',
            formData: req.body
        });
    }
};

// Logout
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
};