// Check if user is logged in
export const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
    if (!req.session.userId || req.session.userRole !== 'admin') {
        return res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You do not have permission to access this page'
        });
    }
    next();
};

// Check if user owns the post (for editing/deleting)
export const isOwner = (req, res, next) => {
    // This will be used in post controller
    req.isOwner = async (post) => {
        return post.userId === req.session.userId || req.session.userRole === 'admin';
    };
    next();
};

// Make user data available to all views
export const setUserLocals = (req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId;
    res.locals.userRole = req.session.userRole || null;
    res.locals.userName = req.session.userName || null;
    next();
};