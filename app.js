const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { DB_URL } = require("./config");
const apiRouter = require("./routes/api");

app.use(bodyParser.json());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
  if ((err.code = 404)) res.status(404).send("404: Page not found");
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send("Internal Server Error");
});

mongoose
  .connect(DB_URL)
  .then(() => console.log(`yassss, connected boyz`));

module.exports = app;