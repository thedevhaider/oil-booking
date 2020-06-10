const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateNearestPumpInput(data) {
  let errors = {};
  
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
