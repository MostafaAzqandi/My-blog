import { sequelize } from '../config/database.js';
import Post from './Post.js';


const db = {
    sequelize,
    Post
};

export default db;