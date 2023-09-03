// Purpose: To create the Category model for the database
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');
// Purpose: Sequelize model for Category table
class Category extends Model {}
// Category model
Category.init(
  {
    id: {
        // Integer
        type: DataTypes.INTEGER,
        // Doesn't allow null values
        allowNull: false,
        // Set as primary key
        primaryKey: true,
        // Uses auto increment
        autoIncrement: true
    },
    category_name: {
        // String
        type: DataTypes.STRING,
        // Doesn't allow null values
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;
