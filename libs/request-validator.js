const { validationResult, matchedData } = require("express-validator");

const validateRequest = (req, res, next) => {
  console.log("Request body", req.body);
  const errors = validationResult(req).array();
  if (errors.length) {
    return res.status(422).send(errors);
  }
  const data = matchedData(req);
  res.locals.data = data;
  return next();
};

module.exports = {
  validateRequest,
};
