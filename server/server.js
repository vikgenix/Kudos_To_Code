// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Example route
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// // Import routes
// // const userRoutes = require("./routes/userRoutes");
// // app.use("/api/users", userRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config(); // Step 1: Load environment variables from .env
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }
));

// Step 2: Connect to MongoDB
connectDB();

// Step 3: Middleware to parse JSON request bodies
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Step 4: Mount auth routes
// All auth-related routes will start with /api/auth
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sheets", require("./routes/sheetRoutes"));

// Step 5: Default route to test server
app.get("/", (req, res) => {
  res.send("Hello World! Your server is working 🚀");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };
  res.json({
    server: "Running",
    database: statusMap[dbStatus] || "Unknown",
    timestamp: new Date().toISOString(),
  });
});

// Step 6: Start server on PORT from .env or default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
