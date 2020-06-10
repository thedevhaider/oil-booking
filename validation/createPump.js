const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCreatePumpInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.landmark = !isEmpty(data.landmark) ? data.landmark : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be 2 to 30 Characters long";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }

  if (Validator.isEmpty(data.landmark)) {
    errors.landmark = "Landmark is required";
  }
  
  if (data.latitude === undefined) {
    errors.latitude = "Latitude is required";
  } 

  if (data.longitude === undefined) {
    errors.longitude = "Longitude is required";
  } 

  if (data.fillings === undefined) {
    errors.fillings = "Fillings are required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
