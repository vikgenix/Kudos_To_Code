const express = require("express");
const router = express.Router();
const sheetController = require("../controllers/sheetController");
const authMiddleware = require("../middlewares/authMiddleware");

// Protect all routes
router.use(authMiddleware);

// Sheet Routes
router.post("/", sheetController.createSheet);
router.get("/", sheetController.getSheets);
router.get("/:id", sheetController.getSheet);
router.put("/:id", sheetController.updateSheet);
router.delete("/:id", sheetController.deleteSheet);

// Problem Routes
router.post("/:sheetId/problems", sheetController.addProblem);
router.delete("/problems/:id", sheetController.deleteProblem);
router.put("/problems/:problemId/toggle", sheetController.toggleProblemStatus);

module.exports = router;
