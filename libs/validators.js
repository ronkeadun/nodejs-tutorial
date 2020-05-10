const { body, query, param } = require("express-validator");

const VALIDATORS = {
  TODO: {
    CreateTodo: [
      body("name")
        .exists()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    ],
    GetTodo: [
      query("id")
        .exists()
        .withMessage("Id is required")
        .isMongoId()
        .withMessage("Id passed is invalid"),
    ],
    UpdateTodo: [
      param("id")
        .exists()
        .withMessage("Id is required")
        .isMongoId()
        .withMessage("Id passed is invalid"),
      body("name")
        .exists()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
      body("done").exists().withMessage("Done must be string"),
    ],
    DeleteTodo: [
      param("id")
        .exists()
        .withMessage("Id is required")
        .isMongoId()
        .withMessage("Id passed is invalid"),
    ],
  },
};

module.exports = VALIDATORS;
