const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const fs = require("fs");
const connectDB = require("./config/db");
const Sheet = require("./models/Sheet");
const Problem = require("./models/Problem");
const User = require("./models/User");

const seedNeetcode = async () => {
  await connectDB();

  try {
    // 1. Find a user to assign the sheet to
    const user = await User.findOne();
    if (!user) {
      console.error("❌ No user found in database. Please create a user first.");
      process.exit(1);
    }
    console.log(`✅ Assigning sheet to user: ${user.email} (${user._id})`);

    // 2. Read and parse data
    const dataPath = path.join(__dirname, "neetcode_250.json");
    const fileContent = fs.readFileSync(dataPath, "utf-8");
    const problemsData = JSON.parse(fileContent);

    // Group by category (section)
    const sectionsMap = {};
    problemsData.forEach(p => {
        if (!sectionsMap[p.category]) {
            sectionsMap[p.category] = [];
        }
        sectionsMap[p.category].push(p);
    });

    const sections = Object.keys(sectionsMap).map(name => ({
        name,
        problems: sectionsMap[name]
    }));

    console.log(`✅ Parsed ${sections.length} sections from JSON.`);

    // 3. Create Sheet
    const sheetTitle = "Neetcode 250";
    let sheet = await Sheet.findOne({ title: sheetTitle, createdBy: user._id });

    if (sheet) {
      console.log("⚠️ Sheet already exists. Deleting old problems...");
      await Problem.deleteMany({ sheet: sheet._id });
    } else {
      console.log("✅ Creating new sheet...");
      sheet = new Sheet({
        title: sheetTitle,
        description: "The ultimate list of 250 problems to ace your coding interviews.",
        createdBy: user._id,
        isPublic: true,
        sections: sections.map(s => s.name),
      });
      await sheet.save();
    }

    // 4. Create Problems
    let problemCount = 0;
    for (const section of sections) {
      console.log(`Processing section: ${section.name} (${section.problems.length} problems)`);
      
      const problemDocs = section.problems.map(p => ({
        title: p.title,
        link: p.link,
        difficulty: "Medium", // Default, as JSON doesn't have it
        tags: [section.name],
        sheet: sheet._id,
        section: section.name,
      }));

      if (problemDocs.length > 0) {
        await Problem.insertMany(problemDocs);
        problemCount += problemDocs.length;
      }
    }

    // Update sheet with correct sections list
    sheet.sections = sections.map(s => s.name);
    await sheet.save();

    console.log(`🎉 Successfully seeded "Neetcode 250" with ${problemCount} problems from JSON!`);
    process.exit(0);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedNeetcode();
