import express from 'express';
import { isAdmin } from '../middleware/admin.js';
import {
    dashboard,
    listUsers,
    editUserForm,
    updateUser,
    deleteUser,
    listAllPosts,
    adminEditPost,
    adminUpdatePost,
    adminDeletePost
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(isAdmin);

// Dashboard
router.get('/admin', dashboard);

// User management
router.get('/admin/users', listUsers);
router.get('/admin/users/:id/edit', editUserForm);
router.put('/admin/users/:id', updateUser);
router.delete('/admin/users/:id', deleteUser);

// Post management
router.get('/admin/posts', listAllPosts);
router.get('/admin/posts/:id/edit', adminEditPost);
router.put('/admin/posts/:id', adminUpdatePost);
router.delete('/admin/posts/:id', adminDeletePost);

export default router;