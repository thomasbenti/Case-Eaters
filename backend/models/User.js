/*
    User Model Definition
    Defines the structure of the User table in the database.
    Each user has a unique accountId, first and last name, email, password, meal plan status,
    notification preferences, and active status.
    The model also establishes a one-to-many relationship with the Post model, indicating that
    a user can have multiple posts.
*/

const { on } = require("events");
const { type } = require("os")

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        accountId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mealPlan: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        recievesNotifications: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
}); 

    User.associate = (models) => {
        User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' });
    };
    return User;
};