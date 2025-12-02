const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Sheet = require("./models/Sheet");
const Problem = require("./models/Problem");

const checkDB = async () => {
  await connectDB();

  try {
    const sheets = await Sheet.find({});
    console.log(`\n📊 Found ${sheets.length} sheets:`);
    
    for (const sheet of sheets) {
      const problemCount = await Problem.countDocuments({ sheet: sheet._id });
      console.log(`- [${sheet._id}] "${sheet.title}" (Public: ${sheet.isPublic}) - Problems: ${problemCount}`);
    }

    const totalProblems = await Problem.countDocuments({});
    console.log(`\n∑ Total Problems in DB: ${totalProblems}`);

    process.exit(0);
  } catch (error) {
    console.error("Error checking DB:", error);
    process.exit(1);
  }
};

checkDB();
