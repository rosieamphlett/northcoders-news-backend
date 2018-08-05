const data = require("./devData");
const mongoose = require("mongoose");
const { DB_URL } = require("../config");
const seedDB = require("./seed");

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Seeding to ${DB_URL}`);
  })
  .then(() => seedDB(data))
  .then(() => {
    console.log("Seeding woohoo");
  })
  .then(() => mongoose.disconnect());