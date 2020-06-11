const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  pump: {
    type: Schema.Types.ObjectId,
    ref: "pumps"
  },
  fillings: [{type: String}],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Booking = mongoose.model("bookings", BookingSchema);
