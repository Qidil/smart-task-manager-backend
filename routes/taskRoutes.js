const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, taskController.getTask);
router.post("/", verifyToken, taskController.createTask);
router.put("/:id", verifyToken, taskController.updateTask);
router.delete("/:id", verifyToken, taskController.deleteTask);
router.patch("/mark-all-complete", verifyToken, taskController.markAllComplete);

module.exports = router;
