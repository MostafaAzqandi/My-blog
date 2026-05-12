import express from 'express';
import {
    getAllPosts,
    getSinglePost,
    showCreateForm,
    createPost,
    showEditForm,
    updatePost,
    deletePost
} from '../controllers/postController.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/posts/:id', getSinglePost);

// Create routes
router.get('/create', showCreateForm);
router.post('/create', createPost);

// Edit routes
router.get('/posts/:id/edit', showEditForm);
router.put('/posts/:id', updatePost);

// Delete route
router.delete('/posts/:id', deletePost);

export default router;