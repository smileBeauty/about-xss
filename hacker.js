const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = express.Router();

const filePath = path.join(__dirname, "./static/a.jpg");
const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());

router.all("/static/*.js", (req, res) => {
  console.log(req.cookies);
  res.sendStatus(201);
});

router.all("/static/*", (req, res) => {
  console.log(req.cookies);
  res.sendFile(filePath);
});
app.use(router);

app.listen("8081", () => {
  console.log("server on 8081");
});
