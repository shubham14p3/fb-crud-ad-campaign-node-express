const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// initialising express 
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialising Facebook business sdk
app.get("/", (req, res) =>
  res.json({ message: "NPM Succesfully Started, This is the first Local host" })
);
require("./app/routes/campaign.js")(app);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
