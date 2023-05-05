//imports
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

//route imports

const app = express();
const port = process.env.PORT || 8080;
console.log("running port 8080");

app.use(cors("*"));
app.use(helmet());
app.use(bodyParser.json());
app.use("/api/Auth/admin", require("./Routes/AdminRoute"));


app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(port, () => console.log("Application is running"));
