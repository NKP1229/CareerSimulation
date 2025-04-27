const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());

app.listen(PORT, (req, res, next) => {
  console.log(`I am listening on port number ${PORT}`);
});
