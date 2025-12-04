const Sheet = require("../models/Sheet");
const Problem = require("../models/Problem");
const User = require("../models/User");

// --- Sheet Operations ---

exports.createSheet = async (req, res) => {
  try {
    const { title, description, isPublic, sections } = req.body;
    const sheet = new Sheet({
      title,
      description,
      isPublic,
      sections,
      createdBy: req.user.id,
    });
    await sheet.save();
    res.status(201).json(sheet);
  } catch (error) {
    res.status(500).json({ message: "Error creating sheet", error: error.message });
  }
};

exports.getSheets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, filter, sort } = req.query;

    console.log(`Fetching sheets - User: ${req.user.id}, Page: ${page}, Limit: ${limit}, Search: ${search}, Filter: ${filter}, Sort: ${sort}`);

    // Build Query
    const query = {};
    
    // Search (Title or Description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter (Public/Private)
    if (filter === "public") {
      query.isPublic = true;
    } else if (filter === "private") {
      query.isPublic = false;
    }

    // Sort
    let sortOption = { createdAt: -1 }; // Default: Newest first
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "title_asc") {
      sortOption = { title: 1 };
    } else if (sort === "title_desc") {
      sortOption = { title: -1 };
    }

    const totalSheets = await Sheet.countDocuments(query);
    const sheets = await Sheet.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    
    console.log("Found sheets count:", sheets.length);
    const user = await User.findById(req.user.id);
    const completedProblems = new Set(user.completedProblems.map((id) => id.toString()));

    const sheetsWithProgress = await Promise.all(
      sheets.map(async (sheet) => {
        const problems = await Problem.find({ sheet: sheet._id });
        const totalProblems = problems.length;
        const completedCount = problems.filter((p) => completedProblems.has(p._id.toString())).length;
        const progress = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

        return {
          ...sheet,
          questions: totalProblems,
          progress,
          followers: 0, // Placeholder for now
        };
      })
    );

    res.json({
      data: sheetsWithProgress,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalSheets / limit),
        totalItems: totalSheets,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sheets", error: error.message });
  }
};

exports.getSheet = async (req, res) => {
  try {
    const sheet = await Sheet.findById(req.params.id).lean();
    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }

    const problems = await Problem.find({ sheet: sheet._id }).lean();
    const user = await User.findById(req.user.id);
    const completedProblems = new Set(user.completedProblems.map((id) => id.toString()));

    // Group problems by section
    const sectionsMap = {};
    // Initialize sections from sheet definition
    if (sheet.sections) {
        sheet.sections.forEach(sectionName => {
            sectionsMap[sectionName] = {
                name: sectionName,
                total: 0,
                completed: 0,
                problems: []
            };
        });
    }

    problems.forEach((problem) => {
      const isCompleted = completedProblems.has(problem._id.toString());
      const sectionName = problem.section || "Uncategorized";
      
      if (!sectionsMap[sectionName]) {
          sectionsMap[sectionName] = {
              name: sectionName,
              total: 0,
              completed: 0,
              problems: []
          };
      }

      sectionsMap[sectionName].total += 1;
      if (isCompleted) sectionsMap[sectionName].completed += 1;
      
      sectionsMap[sectionName].problems.push({
        ...problem,
        isCompleted,
      });
    });

    const sections = Object.values(sectionsMap);

    res.json({
      ...sheet,
      questions: problems.length,
      sections,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sheet details", error: error.message });
  }
};

exports.updateSheet = async (req, res) => {
  try {
    const { title, description } = req.body;
    const sheet = await Sheet.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id }, // Ensure ownership
      { title, description },
      { new: true }
    );
    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found or unauthorized" });
    }
    res.json(sheet);
  } catch (error) {
    res.status(500).json({ message: "Error updating sheet", error: error.message });
  }
};

exports.deleteSheet = async (req, res) => {
  try {
    const sheet = await Sheet.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found or unauthorized" });
    }
    // Delete associated problems
    await Problem.deleteMany({ sheet: sheet._id });
    res.json({ message: "Sheet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sheet", error: error.message });
  }
};

// --- Problem Operations ---

exports.addProblem = async (req, res) => {
  try {
    console.log("Adding problem to sheet:", req.params.sheetId);
    console.log("Problem data:", req.body);
    const { sheetId } = req.params;
    const { title, link, difficulty, tags, section } = req.body;

    // Verify sheet ownership
    const sheet = await Sheet.findOne({ _id: sheetId, createdBy: req.user.id });
    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found or unauthorized" });
    }

    const problem = new Problem({
      title,
      link,
      difficulty,
      tags,
      section,
      sheet: sheetId,
    });
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: "Error adding problem", error: error.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    // Verify ownership via the sheet
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const sheet = await Sheet.findOne({ _id: problem.sheet, createdBy: req.user.id });
    if (!sheet) {
      return res.status(403).json({ message: "Unauthorized to delete this problem" });
    }

    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting problem", error: error.message });
  }
};

exports.toggleProblemStatus = async (req, res) => {
  try {
    const { problemId } = req.params;
    const user = await User.findById(req.user.id);
    
    const problemIndex = user.completedProblems.indexOf(problemId);
    let isCompleted = false;

    if (problemIndex > -1) {
      // Unmark
      user.completedProblems.splice(problemIndex, 1);
      isCompleted = false;
    } else {
      // Mark
      user.completedProblems.push(problemId);
      isCompleted = true;
    }

    await user.save();
    res.json({ message: "Status updated", isCompleted });
  } catch (error) {
    res.status(500).json({ message: "Error updating problem status", error: error.message });
  }
};
