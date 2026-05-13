// Check if user is admin
export const isAdmin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    
    if (req.session.userRole !== 'admin') {
        return res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You do not have permission to access the admin area'
        });
    }
    
    next();
};

// Make user data available to admin views
export const setAdminLocals = (req, res, next) => {
    res.locals.isAdmin = req.session.userRole === 'admin';
    next();
};