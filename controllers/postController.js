import db from "../models/index.js";

const Post = db.Post;

// Display all posts (homepage)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.User,
          as: "author", 
          attributes: ["username", "fullName"],
        },
      ],
    });

    res.render("posts/index", {
      title: "Home",
      posts: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load posts",
    });
  }
};

// Show single post
export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: db.User, as: "author", attributes: ["username", "fullName"] },
      ],
    });

    if (!post) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Post not found",
      });
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
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load post",
    });
  }
};

// Show create post form (requires login)
export const showCreateForm = (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  res.render("posts/create", {
    title: "Create New Post",
  });
};

// Create new post (requires login)
export const createPost = async (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const { title, content, published } = req.body;

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
      published: published === "on" ? true : false,
      userId: req.session.userId,
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

// Show edit form (requires ownership)
export const showEditForm = async (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Post not found",
      });
    }

    // Check if user owns this post OR is admin
    if (
      post.userId !== req.session.userId &&
      req.session.userRole !== "admin"
    ) {
      return res.status(403).render("error", {
        title: "Access Denied",
        message: "You can only edit your own posts",
      });
    }

    res.render("posts/edit", {
      title: "Edit Post",
      post: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load edit form",
    });
  }
};

// Update post (requires ownership)
export const updatePost = async (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Post not found",
      });
    }

    // Check if user owns this post OR is admin
    if (
      post.userId !== req.session.userId &&
      req.session.userRole !== "admin"
    ) {
      return res.status(403).render("error", {
        title: "Access Denied",
        message: "You can only edit your own posts",
      });
    }

    const { title, content, published } = req.body;

    await post.update({
      title,
      content,
      published: published === "on" ? true : false,
    });

    res.redirect(`/posts/${post.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to update post",
    });
  }
};

// Delete post (requires ownership)
export const deletePost = async (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Post not found",
      });
    }

    // Check if user owns this post OR is admin
    if (
      post.userId !== req.session.userId &&
      req.session.userRole !== "admin"
    ) {
      return res.status(403).render("error", {
        title: "Access Denied",
        message: "You can only delete your own posts",
      });
    }

    await post.destroy();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to delete post",
    });
  }
};
