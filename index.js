const path = require("path");
const express = require("express");
const bodyparser = require("body-parser");
const { TodoRouter } = require("./routes/todo");
const { App } = require("./config");

const app = express();

app.use("/assets", express.static(path.join(__dirname, "./assets")));

app.set("view engine", "ejs");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {
    title: App.NAME,
    baseUrl: App.BASE_URL,
  });
});

app.get("/login", (req, res) => {
  res.send("This is our login page");
});

app.use("/todo", TodoRouter);

const port = process.env.PORT || App.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  // console.log("Process Environment Variable", process.env);
});
