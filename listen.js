const app = require("./app");
const PORT = process.env || 9090;

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`listening on port ${PORT}`);
});


