const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creating Schema
const PumpSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    required: true
  },
  location: {
    type: { type: String },
    coordinates: []
  },
  fillings: [{type: String}],
  date: {
    type: Date,
    default: Date.now
  }
});

PumpSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("pumps", PumpSchema);
