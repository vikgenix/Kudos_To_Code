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

app.use(
  cors({
    origin: "https://kudos-to-code.vercel.app/", // or your deployed frontend URL
    credentials: true, // if you send cookies or tokens
  })
);

// Step 2: Connect to MongoDB
connectDB();

// Step 3: Middleware to parse JSON request bodies
app.use(express.json());

// Step 4: Mount auth routes
// All auth-related routes will start with /api/auth
app.use("/api/auth", require("./routes/auth"));

// Step 5: Default route to test server
app.get("/", (req, res) => {
  res.send("Hello World! Your server is working 🚀");
});

// Step 6: Start server on PORT from .env or default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});