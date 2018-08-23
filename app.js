const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL || require("./config/config2").DB_URL;
const apiRouter = require("./routes/api");
const cors = require('cors')

app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/api", apiRouter);

app.use(cors())

app.use((err, req, res, next) => {
  if (err.status === 400)
    res.status(400).send({ msg: err.msg || "Bad request :(", err: err });
  if (err.status === 404)
    res.status(404).send({ msg: "Page not found", err: err });
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send("Internal Server Error");
});

mongoose
  .connect(DB_URL)
  .then(() => console.log(`yassss connected`));

module.exports = app;