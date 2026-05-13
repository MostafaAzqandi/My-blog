import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class Post extends Model {
  // Returns a short summary of the post
  getSummary(length = 150) {
    if (this.content.length <= length) return this.content;
    return this.content.substring(0, length) + "...";
  }

  // Find all published posts
  static async findPublished() {
    return await this.findAll({
      where: { published: true },
      order: [["createdAt", "DESC"]],
    });
  }
  // Check if user owns this post
  isOwnedBy(userId) {
    return this.userId === userId;
  }
}

// The table structure
Post.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title is required" },
        len: {
          args: [3, 200],
          msg: "Title must be between 3 and 200 characters",
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Content is required" },
      },
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Post",
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

export default Post;
