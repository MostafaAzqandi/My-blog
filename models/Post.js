import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Post extends Model {
    // Returns a short summary of the post
    getSummary(length = 150) {
        if (this.content.length <= length) return this.content;
        return this.content.substring(0, length) + '...';
    }
    
    // Checks if post was created in last 24 hours
    isNew() {
        const hoursSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60);
        return hoursSinceCreation < 24;
    }
    
    // Find all published posts
    static async findPublished() {
        return await this.findAll({
            where: { published: true },
            order: [['createdAt', 'DESC']]
        });
    }
}

// The table structure
Post.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Title is required' },
            len: { args: [3, 200], msg: 'Title must be between 3 and 200 characters' }
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Content is required' }
        }
    },
    author: {
        type: DataTypes.STRING,
        defaultValue: 'Anonymous'
    },
    published: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'Post',
    timestamps: true  // Adds createdAt and updatedAt automatically
});

export default Post;