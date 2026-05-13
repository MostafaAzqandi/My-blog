import db from '../models/index.js';
import { Op } from 'sequelize';

const { User, Post } = db;

// Admin Dashboard
export const dashboard = async (req, res) => {
    try {
        // Get statistics
        const totalUsers = await User.count();
        const totalPosts = await Post.count();
        const publishedPosts = await Post.count({ where: { published: true } });
        const recentUsers = await User.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'username', 'email', 'fullName', 'role', 'isActive', 'createdAt']
        });
        const recentPosts = await Post.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'author', attributes: ['username'] }]
        });
        
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {
                totalUsers,
                totalPosts,
                publishedPosts,
                draftPosts: totalPosts - publishedPosts
            },
            recentUsers,
            recentPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load admin dashboard'
        });
    }
};

// ========== USER MANAGEMENT ==========

// List all users
export const listUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] }
        });
        
        res.render('admin/users', {
            title: 'Manage Users',
            users: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load users'
        });
    }
};

// Edit user form
export const editUserForm = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'User not found'
            });
        }
        
        res.render('admin/edit-user', {
            title: 'Edit User',
            user: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load user'
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'User not found'
            });
        }
        
        const { fullName, role, isActive } = req.body;
        
        await user.update({
            fullName: fullName || user.fullName,
            role: role || user.role,
            isActive: isActive === 'on' ? true : false
        });
        
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to update user'
        });
    }
};

// Delete user (and all their posts)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'User not found'
            });
        }
        
        // Don't allow deleting yourself
        if (user.id === req.session.userId) {
            return res.status(400).render('error', {
                title: 'Cannot Delete',
                message: 'You cannot delete your own account'
            });
        }
        
        await user.destroy();
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to delete user'
        });
    }
};

// ========== POST MANAGEMENT ==========

// List all posts (admin view)
export const listAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'author', attributes: ['username', 'fullName'] }]
        });
        
        res.render('admin/posts', {
            title: 'Manage Posts',
            posts: posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load posts'
        });
    }
};

// Admin edit any post
export const adminEditPost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [{ model: User, as: 'author', attributes: ['username'] }]
        });
        
        if (!post) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Post not found'
            });
        }
        
        res.render('admin/edit-post', {
            title: 'Edit Post',
            post: post
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load post'
        });
    }
};

// Admin update any post
export const adminUpdatePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Post not found'
            });
        }
        
        const { title, content, published } = req.body;
        
        await post.update({
            title,
            content,
            published: published === 'on' ? true : false
        });
        
        res.redirect('/admin/posts');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to update post'
        });
    }
};

// Admin delete any post
export const adminDeletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Post not found'
            });
        }
        
        await post.destroy();
        res.redirect('/admin/posts');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to delete post'
        });
    }
};