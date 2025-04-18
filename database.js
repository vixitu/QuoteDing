const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false, // Disable logging to reduce overhead
  pool: {
    max: 1, // Limit to one connection to prevent locking
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    // Enable WAL mode
    mode: Sequelize.OPEN_READWRITE | Sequelize.OPEN_CREATE,
    busyTimeout: 30000, // 30 seconds timeout
  },
});

// Enable WAL mode
sequelize.query("PRAGMA journal_mode=WAL;");

module.exports = sequelize;
