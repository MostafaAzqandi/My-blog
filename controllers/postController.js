import db from "../models/index.js";

const Post = db.Post;

// Display all posts (homepage)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.render("posts/index", {
      title: "Home",
      posts: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Show single post
export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.render("posts/show", {
      title: post.title,
      post: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Show create post form
export const showCreateForm = (req, res) => {
  res.render("posts/create", {
    title: "Create New Post",
  });
};

// Create new post
export const createPost = async (req, res) => {
  try {
    const { title, content, author, published } = req.body;

    // Simple validation
    if (!title || !content) {
      return res.render("posts/create", {
        title: "Create New Post",
        error: "Title and content are required",
        formData: req.body,
      });
    }

    await Post.create({
      title,
      content,
      author: author || "Anonymous",
      published: published === "on" ? true : false,
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.render("posts/create", {
      title: "Create New Post",
      error: error.message,
      formData: req.body,
    });
  }
};

// Show edit form
export const showEditForm = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("posts/edit", {
      title: "Edit Post",
      post: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const { title, content, author, published } = req.body;

    await post.update({
      title,
      content,
      author: author || post.author,
      published: published === "on" ? true : false,
    });

    res.redirect(`/posts/${post.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    await post.destroy();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
