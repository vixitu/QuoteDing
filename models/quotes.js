const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Quote = sequelize.define("Quote", {
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Quote;
