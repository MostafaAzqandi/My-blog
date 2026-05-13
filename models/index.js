import { sequelize } from '../config/database.js';
import Post from './Post.js';
import User from './User.js';

// Define relationships
// User has many Posts
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
// Post belongs to User
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

const db = {
    sequelize,
    Post,
    User
};

export default db;