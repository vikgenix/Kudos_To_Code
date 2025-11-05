const User = require("../models/User");
const { hashPassword, comparePassword } = require("../services/hashService");
const { generateToken } = require("../services/jwtService");

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Get user input

    // Step 1: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists!" });

    // Step 2: Hash password using hashService
    const hashedPassword = await hashPassword(password);

    // Step 3: Save user to database
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Step 4: Send success response
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    // Handle errors gracefully
    res.status(500).json({ error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Get user input

    // Step 1: Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Step 2: Compare provided password with hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Step 3: Generate JWT using jwtService
    const token = generateToken({ id: user._id, email: user.email });

    // Step 4: Send success response with token
    res.json({ message: "Login successful!", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Protected profile route
exports.profile = (req, res) => {
  // req.user is set by auth middleware after token verification
  res.json({
    message: "Welcome to your profile!",
    user: req.user,
  });
};
