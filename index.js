const path = require("path");
const express = require("express");

const app = express();

app.use("/assets", express.static(path.join(__dirname, "./assets")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    title: "My Todo Application",
  });
});

app.get("/login", (req, res) => {
  res.send("This is our login page");
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
