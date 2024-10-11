// src/controllers/bookingController.js
const Booking = require("./Booking");
const Room = require("../models/Room"); // Ensure you import the Room model

// Create a booking
const createBooking = async (req, res) => {
  const { customerName, roomId, checkIn, checkOut } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // Fetch the room to get its rentPerDay and ensure it's available
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).send("Room not found");
      }

      // Check for existing bookings within the same period
      const existingBookings = await Booking.find({
        roomId,
        $or: [
          {
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) },
          },
        ],
      });

      if (existingBookings.length > 0) {
        return res
          .status(400)
          .send("Room is already booked for the selected dates");
      }

      // Calculate total price
      const days =
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
      const totalPrice = days * room.rentPerDay;

      // Create a new booking
      const newBooking = new Booking({
        customerName,
        roomId,
        checkIn,
        checkOut,
        totalPrice,
      });

      await newBooking.save();
      res.status(201).send("Booking created successfully");
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createBooking,
};
