const sequelize = require("./database");
const Quote = require("./models/quotes");

const initModels = async () => {
  await sequelize.sync({ force: true });
  console.log("Database & tables created!");
};

module.exports = { initModels, Quote };
