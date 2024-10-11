const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  minBookingPeriod: {
    type: Number,
    required: true,
  },
  maxBookingPeriod: {
    type: Number,
    required: true,
  },
  file: {
    type: String, // Stores the filename of the uploaded image
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
