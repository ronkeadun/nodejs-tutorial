const mongoose = require("mongoose");
require("./../config");

const TaskSchema = new mongoose.Schema(
  {
    name: mongoose.SchemaTypes.String,
    done: {
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema, "tasks");

/*const task = new Task({
  name: "Friday Clubbing",
});

task
  .save()
  .then((doc) => {
    console.log("Document saved", doc);
  })
  .catch((error) => {
    console.error(error);
  });*/

/*task.save((error) => {
  if (error) {
    console.log("something went wrong");
  } else {
    console.log("data has been saved");
  }
});*/

module.exports = {
  TaskSchema,
  Task,
};
