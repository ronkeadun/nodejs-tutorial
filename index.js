const { app } = require("./app");
const { App } = require("./config");

const port = process.env.PORT || App.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  // console.log("Process Environment Variable", process.env);
});
