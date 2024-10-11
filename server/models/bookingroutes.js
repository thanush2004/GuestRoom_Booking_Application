const express = require("express");
const { createBooking } = require("../controllers/bookingController");

const router = express.Router();

// Define routes for bookings
router.post("/", createBooking); // Create a new booking

module.exports = router;
