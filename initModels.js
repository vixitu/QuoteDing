const sequelize = require("./database");
const Quote = require("./models/quotes");

const initModels = async () => {
  await sequelize.sync({ force: false });
  console.log("Database & tables created!");
};

module.exports = { initModels, Quote };
