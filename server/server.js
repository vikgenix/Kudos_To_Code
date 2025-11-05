const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Example route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Import routes
// const userRoutes = require("./routes/userRoutes");
// app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
