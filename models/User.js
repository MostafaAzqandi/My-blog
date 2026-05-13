import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

class User extends Model {
    // Check if password is correct
    async isValidPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
    
    // Hide sensitive data when sending to client
    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    }
    
    // Hash password before creating user
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }
}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: { args: [3, 50], msg: 'Username must be between 3 and 50 characters' },
            isAlphanumeric: { msg: 'Username can only contain letters and numbers' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Please enter a valid email address' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: { args: [6, 100], msg: 'Password must be at least 6 characters' }
        }
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'User',
    timestamps: true
});

// Hash password before saving
User.beforeCreate(async (user) => {
    user.password = await User.hashPassword(user.password);
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password = await User.hashPassword(user.password);
    }
});

export default User;