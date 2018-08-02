const app = require("express")();
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const DB_URL = process.env.DB_URL || require("./config").DB_URL;

app.use(bodyparser.json());
app.use('/api', apiRouter);
// app.use(req, res, next) => {
//   res.status(err.status).send(err.msg)
// }

mongoose.connect(DB_URL)
  .then(() => { console.log('connected!') })

app.get('/', (req, res) => res.send('all good!'))

module.exports = app;