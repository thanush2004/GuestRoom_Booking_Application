require("dotenv").config(); // Loads environment variables from a .env file into process.env
const express = require("express"); // Express framework for Node.js
const multer = require("multer"); // For handling file uploads
const mongoose = require("mongoose"); // MongoDB object modeling tool
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const bcrypt = require("bcrypt"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For generating JSON Web Tokens
const path = require("path"); // Utility for working with file and directory paths
const fs = require("fs"); // File system module for reading/writing files

// Models - Make sure these files exist in the './models' directory
const Room = require("./models/Rooms");
const User = require("./models/User"); // Model for User schema
const Booking = require("./models/Booking"); // Model for Booking schema

const app = express(); // Initialize express app

// Set up directory for image uploads
const uploadDir = path.join(__dirname, "public/Images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve images statically from the /public/Images folder
app.use("/Images", express.static(path.join(__dirname, "public/Images")));

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images"); // Store images in the public/Images folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a unique filename
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.static("public")); // Serve static files from the 'public' folder
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB using mongoose
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.info("Connected to the database"))
  .catch((err) => console.error(`Error connecting to the database: ${err}`));

// User registration route
app.post("/register", async (req, res) => {
  const { email, mobileNumber, password, userType } = req.body;

  if (!email || !mobileNumber || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      mobileNumber,
      password: hashedPassword,
      userType,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, userType: user.userType });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Upload room route
app.post("/upload", upload.single("file"), async (req, res) => {
  const { name, description, minBookingPeriod, maxBookingPeriod } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  try {
    const newRoom = new Room({
      name,
      description,
      minBookingPeriod,
      maxBookingPeriod,
      file: req.file.filename, // Store the filename of the uploaded image
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom); // Send back the saved room data
  } catch (error) {
    console.error("Error saving room:", error);
    res.status(500).json({ error: "Failed to save room" });
  }
});

// Room booking route
app.post("/booking", async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).send("Room not found");
      }

      const isBooked = room.bookings.some((booking) => {
        return (
          (checkIn >= booking.checkIn && checkIn < booking.checkOut) ||
          (checkOut > booking.checkIn && checkOut <= booking.checkOut) ||
          (checkIn < booking.checkIn && checkOut > booking.checkOut)
        );
      });

      if (isBooked) {
        return res
          .status(400)
          .send("Room is already booked for the selected dates");
      }

      const days =
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
      const totalPrice = days * room.rentPerDay;

      const newBooking = new Booking({
        customerId: userId,
        roomId: room._id,
        checkIn,
        checkOut,
        totalPrice,
      });

      await newBooking.save();
      room.bookings.push({ checkIn, checkOut });
      await room.save();

      res.status(201).send(newBooking);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error in /booking route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get rooms route
app.get("/getRooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update room route
app.put("/update/:id", upload.single("file"), async (req, res) => {
  const { name, minBookingPeriod, maxBookingPeriod, rentPerDay } = req.body;
  const updateData = { name, minBookingPeriod, maxBookingPeriod, rentPerDay };

  if (req.file) {
    updateData.file = req.file.filename;
  }

  try {
    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete room route
app.delete("/delete/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
