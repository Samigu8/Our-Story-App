const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getMemories, addMemory } = require("../controllers/memoryControllers");

router.get("/", auth, getMemories);
router.post("/", auth, addMemory);

module.exports = router;
