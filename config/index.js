const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const Config = Object.freeze({
  App: {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    NAME: process.env.APP_NAME,
  },
  MongoDB: {
    URI: process.env.MONGO_URI,
  },
});

mongoose
  .connect(Config.MongoDB.URI, () => {}, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.connection
  .once("connected", () => console.log("Mongoose is connected!!!"))
  .on("error", (error) => {
    console.log("Your Error is", error);
  });
console.log("Process Configuration", Config);

module.exports = Config;
