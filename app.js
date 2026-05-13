import express from 'express';
import session from 'express-session';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import path from "path";
import { sequelize, testConnection } from './config/database.js';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import {setUserLocals} from "./middleware/auth.js";
import { setAdminLocals } from './middleware/admin.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'pug');
app.set('views', path.join(import.meta.dirname, 'views'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));
app.use((req, res, next) => {
    res.locals.session = req.session;  // Make session available in all views
    next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(setUserLocals);
app.use(setAdminLocals);


// Routes
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', adminRoutes);

// Start server after database connects
testConnection();

sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Database synced');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Database error:', err.message);
    });