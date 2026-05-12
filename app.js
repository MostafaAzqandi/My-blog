import express from 'express';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import path from "path";
import { sequelize, testConnection } from './config/database.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'pug');
app.set('views', path.join(import.meta.dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
app.use('/', postRoutes);

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